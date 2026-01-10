import { useState, useEffect, useCallback } from 'react';
import type { WeatherState } from '../types';
import { fetchWeather } from '../lib/api/weather';
import { useSettings } from '../providers/SettingsProvider';
import { useGeolocation } from './useGeolocation';

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function useWeather() {
  const { settings } = useSettings();
  const { weatherLocation, useLocalWeather } = settings;
  const geolocation = useGeolocation();

  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: true,
    error: null,
  });

  const [locationName, setLocationName] = useState<string>(
    useLocalWeather ? 'My Location' : weatherLocation.name
  );

  // Determine which coordinates to use
  const latitude = useLocalWeather && geolocation.latitude 
    ? geolocation.latitude 
    : weatherLocation.latitude;
  
  const longitude = useLocalWeather && geolocation.longitude 
    ? geolocation.longitude 
    : weatherLocation.longitude;

  // Update location name based on mode
  useEffect(() => {
    if (useLocalWeather) {
      if (geolocation.loading) {
        setLocationName('Locating...');
      } else if (geolocation.error) {
        setLocationName(weatherLocation.name); // Fallback to saved location
      } else {
        setLocationName('My Location');
      }
    } else {
      setLocationName(weatherLocation.name);
    }
  }, [useLocalWeather, geolocation.loading, geolocation.error, weatherLocation.name]);

  const refresh = useCallback(async () => {
    // Wait for geolocation if using local weather
    if (useLocalWeather && geolocation.loading) {
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchWeather(latitude, longitude);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather',
      });
    }
  }, [latitude, longitude, useLocalWeather, geolocation.loading]);

  // Initial fetch and refresh on location change
  useEffect(() => {
    // Don't fetch if waiting for geolocation
    if (useLocalWeather && geolocation.loading) {
      return;
    }
    refresh();
  }, [refresh, useLocalWeather, geolocation.loading]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    ...state,
    locationName,
    isUsingLocalWeather: useLocalWeather && !geolocation.error,
    geolocationError: geolocation.error,
    refresh,
  };
}

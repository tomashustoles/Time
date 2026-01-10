import { useState, useEffect, useCallback } from 'react';
import type { WeatherState } from '../types';
import { fetchWeather } from '../lib/api/weather';
import { useSettings } from '../providers/SettingsProvider';

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function useWeather() {
  const { settings } = useSettings();
  const { weatherLocation } = settings;

  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchWeather(
        weatherLocation.latitude,
        weatherLocation.longitude
      );
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather',
      });
    }
  }, [weatherLocation.latitude, weatherLocation.longitude]);

  // Initial fetch and refresh on location change
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}


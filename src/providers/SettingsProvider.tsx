import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Settings, TemperatureUnit, ThemeName, AnimationStyle } from '../types';
import { storage, getUserTimezone } from '../lib/utils';

const SETTINGS_STORAGE_KEY = 'time-settings';

// Default settings
const defaultSettings: Settings = {
  temperatureUnit: 'celsius',
  timezone: getUserTimezone(),
  weatherLocation: {
    latitude: 40.7128,
    longitude: -74.006,
    name: 'New York',
  },
  useLocalWeather: true, // Use geolocation by default
  newsSource: 'general',
  theme: 'light',
  activeGradient: 1,
  animationStyle: 'slow',
  showShadow: false,
  showTimeCard: false,
};

// Animation style presets
export const animationStylePresets = [
  { value: 'slow' as const, label: 'Slow', description: 'Gentle, calm motion' },
  { value: 'medium' as const, label: 'Medium', description: 'Balanced flow' },
  { value: 'fast' as const, label: 'Fast', description: 'Dynamic movement' },
  { value: 'waves' as const, label: 'Waves', description: 'Flowing wave pattern' },
  { value: 'spotlight' as const, label: 'Spotlight', description: 'Light beam effect' },
  { value: 'map' as const, label: 'Map', description: 'Live map with wind' },
  { value: 'none' as const, label: 'Static', description: 'No animation' },
];

// Preset locations for weather
export const locationPresets = [
  { name: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Dubai', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
];

// Timezone presets
export const timezonePresets = [
  { label: 'Local Time', value: getUserTimezone() },
  { label: 'New York (EST)', value: 'America/New_York' },
  { label: 'Los Angeles (PST)', value: 'America/Los_Angeles' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'Paris (CET)', value: 'Europe/Paris' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'UTC', value: 'UTC' },
];

// News source presets
export const newsSourcePresets = [
  { label: 'General', value: 'general' },
  { label: 'Technology', value: 'technology' },
  { label: 'Business', value: 'business' },
  { label: 'Science', value: 'science' },
  { label: 'Health', value: 'health' },
  { label: 'Sports', value: 'sports' },
  { label: 'Entertainment', value: 'entertainment' },
];

interface SettingsContextType {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setTimezone: (timezone: string) => void;
  setWeatherLocation: (location: Settings['weatherLocation']) => void;
  setUseLocalWeather: (useLocal: boolean) => void;
  setNewsSource: (source: string) => void;
  setTheme: (theme: ThemeName) => void;
  setActiveGradient: (gradient: 1 | 2) => void;
  setAnimationStyle: (style: AnimationStyle) => void;
  setShowShadow: (show: boolean) => void;
  setShowTimeCard: (show: boolean) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(() =>
    storage.get<Settings>(SETTINGS_STORAGE_KEY, defaultSettings)
  );

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      storage.set(SETTINGS_STORAGE_KEY, updated);
      return updated;
    });
  }, []);

  const setTemperatureUnit = useCallback(
    (unit: TemperatureUnit) => updateSettings({ temperatureUnit: unit }),
    [updateSettings]
  );

  const setTimezone = useCallback(
    (timezone: string) => updateSettings({ timezone }),
    [updateSettings]
  );

  const setWeatherLocation = useCallback(
    (location: Settings['weatherLocation']) =>
      updateSettings({ weatherLocation: location, useLocalWeather: false }),
    [updateSettings]
  );

  const setUseLocalWeather = useCallback(
    (useLocal: boolean) => updateSettings({ useLocalWeather: useLocal }),
    [updateSettings]
  );

  const setNewsSource = useCallback(
    (source: string) => updateSettings({ newsSource: source }),
    [updateSettings]
  );

  const setTheme = useCallback(
    (theme: ThemeName) => updateSettings({ theme }),
    [updateSettings]
  );

  const setActiveGradient = useCallback(
    (gradient: 1 | 2) => updateSettings({ activeGradient: gradient }),
    [updateSettings]
  );

  const setAnimationStyle = useCallback(
    (style: AnimationStyle) => updateSettings({ animationStyle: style }),
    [updateSettings]
  );

  const setShowShadow = useCallback(
    (show: boolean) => updateSettings({ showShadow: show }),
    [updateSettings]
  );

  const setShowTimeCard = useCallback(
    (show: boolean) => updateSettings({ showTimeCard: show }),
    [updateSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    storage.set(SETTINGS_STORAGE_KEY, defaultSettings);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setTemperatureUnit,
        setTimezone,
        setWeatherLocation,
        setUseLocalWeather,
        setNewsSource,
        setTheme,
        setActiveGradient,
        setAnimationStyle,
        setShowShadow,
        setShowTimeCard,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}


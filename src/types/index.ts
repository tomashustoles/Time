// Temperature units
export type TemperatureUnit = 'celsius' | 'fahrenheit';

// Theme types
export type ThemeName = 'light' | 'dark';

export interface Theme {
  name: ThemeName;
  label: string;
}

// Animation style types
export type AnimationStyle = 'slow' | 'medium' | 'fast' | 'waves' | 'spotlight' | 'map' | 'none';

// Settings state
export interface Settings {
  temperatureUnit: TemperatureUnit;
  timezone: string;
  weatherLocation: {
    latitude: number;
    longitude: number;
    name: string;
  };
  useLocalWeather: boolean;
  newsSource: string;
  theme: ThemeName;
  activeGradient: 1 | 2;
  animationStyle: AnimationStyle;
  showShadow: boolean;
  showTimeCard: boolean;
}

// Weather data
export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

// News data
export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  isBreaking?: boolean;
}

export interface NewsState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
}

// Common location presets
export interface LocationPreset {
  name: string;
  latitude: number;
  longitude: number;
}

// Timezone presets
export interface TimezonePreset {
  label: string;
  value: string;
}

// Future-ready types (stubs)
export interface User {
  id: string;
  email: string;
  displayName?: string;
  isPremium?: boolean;
}

export interface FeatureFlags {
  premiumThemes?: boolean;
  extraWidgets?: boolean;
  customGradients?: boolean;
}


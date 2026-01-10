import type { WeatherData } from '../../types';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
    is_day: number;
    time: string;
    windspeed: number;
    winddirection: number;
  };
}

/**
 * Fetch current weather from Open-Meteo API
 * Free API, no key required
 */
export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('current_weather', 'true');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: OpenMeteoResponse = await response.json();

  return {
    temperature: data.current_weather.temperature,
    weatherCode: data.current_weather.weathercode,
    isDay: data.current_weather.is_day === 1,
  };
}

/**
 * Get weather description from WMO weather code
 */
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[code] || 'Unknown';
}

/**
 * Check if weather is extreme (for highlighting in UI)
 */
export function isExtremeWeather(code: number, temperature: number): boolean {
  // Extreme weather codes (thunderstorms, heavy precipitation)
  const extremeCodes = [65, 67, 75, 82, 86, 95, 96, 99];

  // Extreme temperatures (below -20°C or above 40°C)
  const extremeTemp = temperature < -20 || temperature > 40;

  return extremeCodes.includes(code) || extremeTemp;
}


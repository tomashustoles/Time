import { useWeather } from '../hooks/useWeather';
import { useSettings } from '../providers/SettingsProvider';
import { formatTemperature } from '../lib/utils';
import { isExtremeWeather, getWeatherDescription } from '../lib/api/weather';
import { cn } from '../lib/utils';

interface TemperatureProps {
  className?: string;
}

export function Temperature({ className }: TemperatureProps) {
  const { data, loading, error } = useWeather();
  const { settings } = useSettings();

  // Loading state
  if (loading && !data) {
    return (
      <div className={cn('flex flex-col items-end', className)}>
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className={cn('flex flex-col items-end', className)}>
        <span className="text-foreground/50 text-sm">--°</span>
      </div>
    );
  }

  if (!data) return null;

  const isExtreme = isExtremeWeather(data.weatherCode, data.temperature);
  const description = getWeatherDescription(data.weatherCode);

  return (
    <div className={cn('flex flex-col items-end gap-0.5', className)}>
      {/* Temperature value */}
      <span
        className={cn(
          'font-sans font-bold tracking-tight',
          'text-2xl sm:text-3xl md:text-4xl',
          isExtreme ? 'text-accent' : 'text-foreground',
          'transition-colors duration-normal'
        )}
      >
        {formatTemperature(data.temperature, settings.temperatureUnit)}
      </span>

      {/* Weather description */}
      <span
        className={cn(
          'font-sans text-foreground/60',
          'text-xs sm:text-sm',
          'hidden sm:block'
        )}
      >
        {description}
      </span>

      {/* Location name */}
      <span
        className={cn(
          'font-sans text-foreground/40',
          'text-xs',
          'hidden md:block'
        )}
      >
        {settings.weatherLocation.name}
      </span>
    </div>
  );
}


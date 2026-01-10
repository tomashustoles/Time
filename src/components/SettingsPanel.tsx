import { useSettings, locationPresets, timezonePresets, newsSourcePresets } from '../providers/SettingsProvider';
import { useTheme } from '../providers/ThemeProvider';
import { useWeather } from '../hooks/useWeather';
import { cn } from '../lib/utils';
import { Icon } from './ui/Icon';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="px-4 py-4 border-b border-border last:border-b-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function OptionButton({ selected, onClick, children }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-between w-full px-3 py-2 rounded-lg',
        'text-left text-sm font-medium',
        'transition-all duration-fast',
        selected
          ? 'bg-foreground text-background'
          : 'bg-transparent text-foreground hover:bg-foreground/10'
      )}
    >
      <span>{children}</span>
      {selected && <Icon name="check" size={16} />}
    </button>
  );
}

export function SettingsPanel() {
  const {
    settings,
    setTemperatureUnit,
    setTimezone,
    setWeatherLocation,
    setUseLocalWeather,
    setNewsSource,
    setActiveGradient,
  } = useSettings();
  const { theme, setTheme, themes } = useTheme();
  const { isUsingLocalWeather, geolocationError } = useWeather();

  return (
    <div className="py-2">
      {/* Temperature Unit */}
      <SettingsSection title="Temperature">
        <div className="flex gap-2">
          <button
            onClick={() => setTemperatureUnit('celsius')}
            className={cn(
              'flex-1 py-2 rounded-lg font-medium text-sm',
              'transition-all duration-fast',
              settings.temperatureUnit === 'celsius'
                ? 'bg-foreground text-background'
                : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
            )}
          >
            °C
          </button>
          <button
            onClick={() => setTemperatureUnit('fahrenheit')}
            className={cn(
              'flex-1 py-2 rounded-lg font-medium text-sm',
              'transition-all duration-fast',
              settings.temperatureUnit === 'fahrenheit'
                ? 'bg-foreground text-background'
                : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
            )}
          >
            °F
          </button>
        </div>
      </SettingsSection>

      {/* Timezone */}
      <SettingsSection title="Timezone">
        <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-hide">
          {timezonePresets.map((tz) => (
            <OptionButton
              key={tz.value}
              selected={settings.timezone === tz.value}
              onClick={() => setTimezone(tz.value)}
            >
              {tz.label}
            </OptionButton>
          ))}
        </div>
      </SettingsSection>

      {/* Weather Location */}
      <SettingsSection title="Weather Location">
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
          {/* Use My Location option */}
          <button
            onClick={() => setUseLocalWeather(true)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 rounded-lg',
              'text-left text-sm font-medium',
              'transition-all duration-fast',
              settings.useLocalWeather
                ? 'bg-foreground text-background'
                : 'bg-transparent text-foreground hover:bg-foreground/10'
            )}
          >
            <div className="flex items-center gap-2">
              <Icon name="globe" size={16} />
              <span>Use My Location</span>
            </div>
            {settings.useLocalWeather && !geolocationError && <Icon name="check" size={16} />}
            {geolocationError && (
              <span className="text-xs text-accent">{geolocationError}</span>
            )}
          </button>
          
          <div className="h-px bg-border my-2" />
          
          {locationPresets.map((loc) => (
            <OptionButton
              key={loc.name}
              selected={!settings.useLocalWeather && settings.weatherLocation.name === loc.name}
              onClick={() => setWeatherLocation(loc)}
            >
              {loc.name}
            </OptionButton>
          ))}
        </div>
      </SettingsSection>

      {/* News Source */}
      <SettingsSection title="News Category">
        <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-hide">
          {newsSourcePresets.map((source) => (
            <OptionButton
              key={source.value}
              selected={settings.newsSource === source.value}
              onClick={() => setNewsSource(source.value)}
            >
              {source.label}
            </OptionButton>
          ))}
        </div>
      </SettingsSection>

      {/* Theme */}
      <SettingsSection title="Theme">
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={cn(
                'flex-1 py-2 rounded-lg font-medium text-sm',
                'transition-all duration-fast',
                'flex items-center justify-center gap-2',
                theme === t.name
                  ? 'bg-foreground text-background'
                  : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
              )}
            >
              <Icon name={t.name === 'light' ? 'sun' : 'moon'} size={16} />
              {t.label}
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* Gradient */}
      <SettingsSection title="Background Gradient">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveGradient(1)}
            className={cn(
              'flex-1 py-3 rounded-lg font-medium text-sm',
              'transition-all duration-fast',
              'relative overflow-hidden',
              settings.activeGradient === 1
                ? 'ring-2 ring-accent ring-offset-2'
                : 'ring-1 ring-border'
            )}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, hsl(220 20% 97%), hsl(260 15% 96%), hsl(280 15% 95%))',
              }}
            />
            <span className="relative text-foreground/70">Cool</span>
          </button>
          <button
            onClick={() => setActiveGradient(2)}
            className={cn(
              'flex-1 py-3 rounded-lg font-medium text-sm',
              'transition-all duration-fast',
              'relative overflow-hidden',
              settings.activeGradient === 2
                ? 'ring-2 ring-accent ring-offset-2'
                : 'ring-1 ring-border'
            )}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, hsl(40 30% 96%), hsl(20 25% 95%), hsl(200 20% 94%))',
              }}
            />
            <span className="relative text-foreground/70">Warm</span>
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}


import { useSettings, locationPresets, timezonePresets, newsSourcePresets, animationStylePresets } from '../providers/SettingsProvider';
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
    setAnimationStyle,
    setShowShadow,
    setShowTimeCard,
  } = useSettings();
  const { theme, setTheme, themes } = useTheme();
  const { geolocationError } = useWeather();

  return (
    <div className="py-2">
      {/* Theme */}
      <SettingsSection title="Theme">
        <div className="flex gap-2 mb-3">
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
        
        {/* Shadow toggle */}
        <label className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-foreground/5 cursor-pointer transition-all duration-fast">
          <span className="text-sm font-medium text-foreground">Text Shadow</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={settings.showShadow}
              onChange={(e) => setShowShadow(e.target.checked)}
              className="sr-only peer"
            />
            <div className={cn(
              'w-10 h-6 rounded-full transition-all duration-fast',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-accent',
              settings.showShadow
                ? 'bg-foreground'
                : 'bg-foreground/20'
            )} />
            <div className={cn(
              'absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-fast',
              settings.showShadow
                ? 'translate-x-4 bg-background'
                : 'translate-x-0 bg-foreground/50'
            )} />
          </div>
        </label>
        
        {/* Time Card toggle */}
        <label className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-foreground/5 cursor-pointer transition-all duration-fast">
          <span className="text-sm font-medium text-foreground">Time Card</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={settings.showTimeCard}
              onChange={(e) => setShowTimeCard(e.target.checked)}
              className="sr-only peer"
            />
            <div className={cn(
              'w-10 h-6 rounded-full transition-all duration-fast',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-accent',
              settings.showTimeCard
                ? 'bg-foreground'
                : 'bg-foreground/20'
            )} />
            <div className={cn(
              'absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-fast',
              settings.showTimeCard
                ? 'translate-x-4 bg-background'
                : 'translate-x-0 bg-foreground/50'
            )} />
          </div>
        </label>
      </SettingsSection>

      {/* Gradient Colors */}
      <SettingsSection title="Gradient Colors">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveGradient(1)}
            className={cn(
              'flex-1 h-14 rounded-xl font-medium text-sm',
              'transition-all duration-fast',
              'relative overflow-hidden',
              settings.activeGradient === 1
                ? 'ring-2 ring-accent ring-offset-2'
                : 'ring-1 ring-border hover:ring-foreground/30'
            )}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  theme === 'dark'
                    ? 'linear-gradient(135deg, hsl(220 20% 12%), hsl(260 15% 14%), hsl(280 15% 16%))'
                    : 'linear-gradient(135deg, hsl(220 20% 97%), hsl(260 15% 94%), hsl(280 15% 92%))',
              }}
            />
            <span className="relative text-foreground font-semibold drop-shadow-sm">Cool</span>
          </button>
          <button
            onClick={() => setActiveGradient(2)}
            className={cn(
              'flex-1 h-14 rounded-xl font-medium text-sm',
              'transition-all duration-fast',
              'relative overflow-hidden',
              settings.activeGradient === 2
                ? 'ring-2 ring-accent ring-offset-2'
                : 'ring-1 ring-border hover:ring-foreground/30'
            )}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  theme === 'dark'
                    ? 'linear-gradient(135deg, hsl(40 15% 10%), hsl(20 12% 12%), hsl(200 10% 14%))'
                    : 'linear-gradient(135deg, hsl(40 30% 96%), hsl(20 25% 93%), hsl(200 20% 91%))',
              }}
            />
            <span className="relative text-foreground font-semibold drop-shadow-sm">Warm</span>
          </button>
        </div>
      </SettingsSection>

      {/* Animation Style */}
      <SettingsSection title="Animation Style">
        <div className="grid grid-cols-2 gap-2">
          {animationStylePresets.map((style) => (
            <button
              key={style.value}
              onClick={() => setAnimationStyle(style.value)}
              className={cn(
                'flex flex-col items-start px-3 py-2 rounded-lg',
                'text-left text-sm',
                'transition-all duration-fast',
                settings.animationStyle === style.value
                  ? 'bg-foreground text-background'
                  : 'bg-transparent text-foreground hover:bg-foreground/10'
              )}
            >
              <span className="font-medium">{style.label}</span>
              <span className={cn(
                'text-xs',
                settings.animationStyle === style.value
                  ? 'text-background/70'
                  : 'text-foreground/50'
              )}>
                {style.description}
              </span>
            </button>
          ))}
        </div>
      </SettingsSection>

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
    </div>
  );
}


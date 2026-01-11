import { useTime } from '../hooks/useTime';
import { useSettings } from '../providers/SettingsProvider';
import { cn } from '../lib/utils';

interface ClockProps {
  className?: string;
  showSeconds?: boolean;
  showDate?: boolean;
}

export function Clock({ className, showSeconds = true, showDate = true }: ClockProps) {
  const { hours, minutes, seconds, dateString } = useTime();
  const { settings } = useSettings();
  
  // Apply realistic shadow effect when shadow setting is enabled
  const shadowStyle = settings.showShadow ? {
    textShadow: `
      4px 4px 8px rgba(0,0,0,0.5),
      8px 8px 20px rgba(0,0,0,0.45),
      16px 16px 40px rgba(0,0,0,0.4),
      24px 24px 60px rgba(0,0,0,0.35),
      40px 40px 80px rgba(0,0,0,0.25),
      -2px -2px 6px rgba(255,255,255,0.15)
    `,
  } : {};

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center select-none',
        className
      )}
    >
      {/* Time display */}
      <div className="flex items-baseline" style={shadowStyle}>
        <span
          className={cn(
            'font-mono font-bold tracking-tight text-foreground',
            'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem]',
            'transition-all duration-slow'
          )}
        >
          {hours}
        </span>
        <span
          className={cn(
            'font-mono font-bold text-foreground mx-1 sm:mx-2',
            'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem]',
            'animate-pulse'
          )}
          style={{ animationDuration: '2s' }}
        >
          :
        </span>
        <span
          className={cn(
            'font-mono font-bold tracking-tight text-foreground',
            'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem]',
            'transition-all duration-slow'
          )}
        >
          {minutes}
        </span>
        {showSeconds && (
          <>
            <span
              className={cn(
                'font-mono font-bold text-foreground/50 mx-1',
                'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
                'self-end mb-2 sm:mb-3 md:mb-4 lg:mb-6'
              )}
            >
              :
            </span>
            <span
              className={cn(
                'font-mono font-medium tracking-tight text-foreground/50',
                'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
                'self-end mb-2 sm:mb-3 md:mb-4 lg:mb-6',
                'min-w-[2ch]'
              )}
            >
              {seconds}
            </span>
          </>
        )}
      </div>

      {/* Date display */}
      {showDate && (
        <p
          className={cn(
            'font-sans font-medium text-foreground/70',
            'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl',
            'mt-2 sm:mt-3 md:mt-4 lg:mt-6',
            'tracking-wide'
          )}
        >
          {dateString}
        </p>
      )}
    </div>
  );
}


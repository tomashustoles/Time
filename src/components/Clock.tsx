import { useTime } from '../hooks/useTime';
import { cn } from '../lib/utils';

interface ClockProps {
  className?: string;
  showSeconds?: boolean;
  showDate?: boolean;
}

export function Clock({ className, showSeconds = true, showDate = true }: ClockProps) {
  const { hours, minutes, seconds, dateString } = useTime();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center select-none',
        className
      )}
    >
      {/* Time display */}
      <div className="flex items-baseline">
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


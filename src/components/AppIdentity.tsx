import { cn } from '../lib/utils';

interface AppIdentityProps {
  className?: string;
}

export function AppIdentity({ className }: AppIdentityProps) {
  return (
    <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
      {/* App Icon - Rounded square */}
      <div
        className={cn(
          'flex items-center justify-center',
          'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
          'bg-foreground rounded-xl sm:rounded-2xl',
          'shadow-md'
        )}
      >
        <span
          className={cn(
            'font-sans font-bold text-background',
            'text-lg sm:text-xl md:text-2xl'
          )}
        >
          T
        </span>
      </div>

      {/* App Name */}
      <span
        className={cn(
          'font-sans font-bold text-foreground tracking-tight',
          'text-lg sm:text-xl md:text-2xl'
        )}
      >
        Time
      </span>
    </div>
  );
}


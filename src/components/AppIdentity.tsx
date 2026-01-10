import { useState } from 'react';
import { cn } from '../lib/utils';
import { Icon } from './ui/Icon';

interface AppIdentityProps {
  className?: string;
  onSettingsClick?: () => void;
}

export function AppIdentity({ className, onSettingsClick }: AppIdentityProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
      {/* App Icon - Rounded square with hover state for settings */}
      <button
        onClick={onSettingsClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'flex items-center justify-center',
          'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
          'bg-foreground rounded-xl sm:rounded-2xl',
          'shadow-md',
          'transition-all duration-normal ease-out-expo',
          'hover:scale-105 hover:shadow-lg',
          'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          'cursor-pointer'
        )}
        aria-label="Open settings"
      >
        <span
          className={cn(
            'font-sans font-bold text-background',
            'text-lg sm:text-xl md:text-2xl',
            'transition-all duration-normal',
            isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          )}
        >
          T
        </span>
        <Icon
          name="menu"
          className={cn(
            'absolute text-background',
            'transition-all duration-normal',
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}
          size={24}
        />
      </button>

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

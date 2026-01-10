import { cn } from '../lib/utils';
import { Icon } from './ui/Icon';

interface MenuButtonProps {
  open: boolean;
  onClick: () => void;
  className?: string;
}

export function MenuButton({ open, onClick, className }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center',
        'w-12 h-12 sm:w-14 sm:h-14',
        'rounded-xl sm:rounded-2xl',
        'bg-transparent',
        'border-2 border-foreground',
        'text-foreground',
        'transition-all duration-normal ease-out-expo',
        'hover:bg-foreground hover:text-background',
        'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        'active:scale-95',
        open && 'bg-accent border-accent text-white hover:bg-accent/90',
        className
      )}
      aria-label={open ? 'Close settings' : 'Open settings'}
      aria-expanded={open}
    >
      <Icon 
        name={open ? 'close' : 'menu'} 
        size={24}
        className="transition-transform duration-normal"
      />
    </button>
  );
}


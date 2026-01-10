import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium transition-all duration-fast ease-out-expo',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'pressable',

          // Variants
          {
            // Default - solid black
            default:
              'bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/80',
            // Ghost - transparent with hover
            ghost:
              'bg-transparent text-foreground hover:bg-foreground/10 active:bg-foreground/20',
            // Outline - bordered
            outline:
              'border-2 border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background',
            // Accent - red highlight
            accent:
              'bg-accent text-white hover:bg-accent/90 active:bg-accent/80',
          }[variant],

          // Sizes
          {
            sm: 'h-8 px-3 text-sm rounded-md',
            md: 'h-10 px-4 text-base rounded-lg',
            lg: 'h-12 px-6 text-lg rounded-xl',
            icon: 'h-10 w-10 rounded-lg',
          }[size],

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';


import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface GridLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Full-screen grid layout with safe area support
 * Provides the main structure for corner-positioned elements
 */
export function GridLayout({ children, className }: GridLayoutProps) {
  return (
    <div
      className={cn(
        'relative w-full h-screen min-h-screen',
        'safe-top safe-bottom safe-left safe-right',
        className
      )}
    >
      {children}
    </div>
  );
}


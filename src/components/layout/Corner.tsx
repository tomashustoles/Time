import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface CornerProps {
  position: CornerPosition;
  children: ReactNode;
  className?: string;
}

const positionStyles: Record<CornerPosition, string> = {
  'top-left': 'top-0 left-0 items-start justify-start',
  'top-right': 'top-0 right-0 items-start justify-end',
  'bottom-left': 'bottom-0 left-0 items-end justify-start',
  'bottom-right': 'bottom-0 right-0 items-end justify-end',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center',
};

export function Corner({ position, children, className }: CornerProps) {
  return (
    <div
      className={cn(
        'absolute flex',
        positionStyles[position],
        position !== 'center' && 'p-4 sm:p-6 md:p-8 lg:p-10',
        className
      )}
    >
      {children}
    </div>
  );
}


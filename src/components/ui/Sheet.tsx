import {
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Sheet({ open, onClose, children, title, className }: SheetProps) {
  const isMobile = useIsMobile();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  // Close on backdrop click
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-foreground/20 backdrop-blur-sm',
          'z-[var(--z-overlay)]',
          'animate-fade-in'
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'fixed z-[var(--z-modal)]',
          'bg-background border border-border',
          'shadow-xl',
          'overflow-hidden',

          // Mobile: bottom sheet
          isMobile && [
            'inset-x-0 bottom-0',
            'rounded-t-2xl',
            'max-h-[85vh]',
            'animate-slide-up',
          ],

          // Desktop: corner overlay
          !isMobile && [
            'bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8',
            'w-80 sm:w-96',
            'max-h-[80vh]',
            'rounded-2xl',
            'animate-fade-in',
          ],

          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="font-semibold text-foreground text-lg">{title}</h2>
            <button
              onClick={onClose}
              className={cn(
                'w-8 h-8 flex items-center justify-center',
                'rounded-full',
                'text-foreground/60 hover:text-foreground',
                'hover:bg-foreground/10',
                'transition-colors duration-fast'
              )}
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-60px)] scrollbar-hide">
          {children}
        </div>

        {/* Mobile drag indicator */}
        {isMobile && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2">
            <div className="w-10 h-1 bg-foreground/20 rounded-full" />
          </div>
        )}
      </div>
    </>
  );
}


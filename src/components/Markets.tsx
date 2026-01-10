import { useMarkets } from '../hooks/useMarkets';
import { formatPrice } from '../lib/api/markets';
import { cn } from '../lib/utils';

interface MarketsProps {
  className?: string;
}

export function Markets({ className }: MarketsProps) {
  const { data, loading } = useMarkets();

  return (
    <div className={cn('flex flex-col items-end gap-1', className)}>
      {/* Bitcoin */}
      <div className="flex items-center gap-2">
        <span className="text-foreground/50 text-xs uppercase tracking-wider">
          BTC
        </span>
        {loading && data.bitcoin === null ? (
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
        ) : (
          <span
            className={cn(
              'font-mono font-semibold text-foreground',
              'text-sm sm:text-base'
            )}
          >
            {formatPrice(data.bitcoin)}
          </span>
        )}
      </div>

      {/* S&P 500 */}
      <div className="flex items-center gap-2">
        <span className="text-foreground/50 text-xs uppercase tracking-wider">
          S&P
        </span>
        {loading && data.sp500 === null ? (
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
        ) : (
          <span
            className={cn(
              'font-mono font-semibold text-foreground',
              'text-sm sm:text-base'
            )}
          >
            {formatPrice(data.sp500)}
          </span>
        )}
      </div>
    </div>
  );
}


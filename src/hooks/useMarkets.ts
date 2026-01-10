import { useState, useEffect, useCallback } from 'react';
import { fetchMarketData, type MarketData } from '../lib/api/markets';

interface MarketsState {
  data: MarketData;
  loading: boolean;
  error: string | null;
}

const REFRESH_INTERVAL = 60 * 1000; // 1 minute

export function useMarkets() {
  const [state, setState] = useState<MarketsState>({
    data: { bitcoin: null, sp500: null },
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchMarketData();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch market data',
      }));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}


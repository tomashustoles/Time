import { useState, useEffect, useCallback } from 'react';
import type { NewsState } from '../types';
import { fetchNews } from '../lib/api/news';
import { useSettings } from '../providers/SettingsProvider';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useNews() {
  const { settings } = useSettings();
  const { newsSource } = settings;

  const [state, setState] = useState<NewsState>({
    articles: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const articles = await fetchNews(newsSource);
      setState({ articles, loading: false, error: null });
    } catch (err) {
      setState({
        articles: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch news',
      });
    }
  }, [newsSource]);

  // Initial fetch and refresh on source change
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}


import type { NewsArticle } from '../../types';

// Using a free news API - for production, you'd want your own API key
// This uses a public RSS-to-JSON service as a fallback
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

// News RSS feeds by category
const NEWS_FEEDS: Record<string, string> = {
  general: 'https://feeds.bbci.co.uk/news/world/rss.xml',
  technology: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
  business: 'https://feeds.bbci.co.uk/news/business/rss.xml',
  science: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  health: 'https://feeds.bbci.co.uk/news/health/rss.xml',
  sports: 'https://feeds.bbci.co.uk/sport/rss.xml',
  entertainment: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
};

interface RssToJsonResponse {
  status: string;
  feed: {
    title: string;
    link: string;
  };
  items: Array<{
    title: string;
    pubDate: string;
    link: string;
    description: string;
    author?: string;
  }>;
}

/**
 * Fetch news articles from RSS feed
 */
export async function fetchNews(source: string = 'general'): Promise<NewsArticle[]> {
  const feedUrl = NEWS_FEEDS[source] || NEWS_FEEDS.general;

  const url = new URL(RSS_TO_JSON_API);
  url.searchParams.set('rss_url', feedUrl);
  url.searchParams.set('count', '10');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data: RssToJsonResponse = await response.json();

    if (data.status !== 'ok') {
      throw new Error('Failed to parse news feed');
    }

    return data.items.map((item) => ({
      title: item.title,
      source: data.feed.title || 'BBC News',
      url: item.link,
      publishedAt: item.pubDate,
      isBreaking: isBreakingNews(item.title, item.pubDate),
    }));
  } catch (error) {
    // Return fallback data if API fails
    console.error('Failed to fetch news:', error);
    return getFallbackNews();
  }
}

/**
 * Check if news is "breaking" (published within last 2 hours)
 */
function isBreakingNews(title: string, publishedAt: string): boolean {
  const now = new Date();
  const published = new Date(publishedAt);
  const hoursAgo = (now.getTime() - published.getTime()) / (1000 * 60 * 60);

  // Breaking if less than 2 hours old
  const isRecent = hoursAgo < 2;

  // Or contains breaking keywords
  const breakingKeywords = ['breaking', 'urgent', 'just in', 'developing'];
  const hasKeyword = breakingKeywords.some((keyword) =>
    title.toLowerCase().includes(keyword)
  );

  return isRecent || hasKeyword;
}

/**
 * Fallback news for when API is unavailable
 */
function getFallbackNews(): NewsArticle[] {
  const now = new Date().toISOString();
  return [
    {
      title: 'Unable to load news headlines',
      source: 'System',
      url: '#',
      publishedAt: now,
      isBreaking: false,
    },
  ];
}

/**
 * Get source label for display
 */
export function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    general: 'World News',
    technology: 'Technology',
    business: 'Business',
    science: 'Science',
    health: 'Health',
    sports: 'Sports',
    entertainment: 'Entertainment',
  };

  return labels[source] || 'News';
}


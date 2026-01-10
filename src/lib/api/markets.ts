export interface MarketData {
  bitcoin: number | null;
  sp500: number | null;
}

/**
 * Fetch Bitcoin price from CoinGecko API (free, no key required)
 */
async function fetchBitcoinPrice(): Promise<number | null> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.bitcoin?.usd ?? null;
  } catch (error) {
    console.error('Failed to fetch Bitcoin price:', error);
    return null;
  }
}

/**
 * Fetch S&P 500 price using Alpha Vantage demo or fallback
 * Note: For production, you'd use your own API key
 */
async function fetchSP500Price(): Promise<number | null> {
  try {
    // Try using a free stock quote API
    // Using Twelve Data free tier (no CORS issues)
    const response = await fetch(
      'https://api.twelvedata.com/price?symbol=SPX&apikey=demo'
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.price) {
      return parseFloat(data.price);
    }
    
    // Fallback: return null if demo key is rate limited
    return null;
  } catch (error) {
    console.error('Failed to fetch S&P 500 price:', error);
    return null;
  }
}

/**
 * Fetch all market data
 */
export async function fetchMarketData(): Promise<MarketData> {
  const [bitcoin, sp500] = await Promise.all([
    fetchBitcoinPrice(),
    fetchSP500Price(),
  ]);
  
  return { bitcoin, sp500 };
}

/**
 * Format price with appropriate precision
 */
export function formatPrice(price: number | null, symbol: string = '$'): string {
  if (price === null) return '--';
  
  if (price >= 1000) {
    return `${symbol}${price.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  }
  
  return `${symbol}${price.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
}


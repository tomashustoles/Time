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
 * Fetch S&P 500 price using Yahoo Finance via CORS proxy
 * Uses the SPY ETF as a proxy for S&P 500 index
 */
async function fetchSP500Price(): Promise<number | null> {
  try {
    // Use Yahoo Finance through AllOrigins CORS proxy
    const yahooUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=1d';
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const price = data.chart?.result?.[0]?.meta?.regularMarketPrice;
    
    if (price && price > 0) {
      // SPY is approximately 1/10th of S&P 500 index value
      // Multiply by 10 to approximate the actual S&P 500 index
      return Math.round(price * 10);
    }
    
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


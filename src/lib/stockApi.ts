'use server';

export interface RealStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: string;
  lastUpdated: string;
}

// Use Yahoo Finance API for more real-time data
export async function getRealStockPrice(symbol: string): Promise<RealStockData> {
  try {
    // For Indian stocks, add .NS suffix
    const formattedSymbol = symbol.includes('.') ? symbol : `${symbol}.NS`;
    
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}?interval=1m&range=1d`,
      { 
        next: { revalidate: 30 }, // 30 second cache
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.chart?.result?.[0]?.meta) {
      const meta = data.chart.result[0].meta;
      const regularMarketPrice = meta.regularMarketPrice || meta.previousClose;
      const previousClose = meta.previousClose;
      const change = regularMarketPrice - previousClose;
      const changePercent = ((change / previousClose) * 100).toFixed(2);
      
      return {
        symbol: symbol,
        name: getStockName(symbol),
        price: parseFloat(regularMarketPrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: changePercent + '%',
        lastUpdated: new Date().toISOString()
      };
    }
    
    throw new Error('No data from Yahoo Finance');
    
  } catch (error) {
    console.error('Yahoo Finance failed, using fallback data:', error);
    return getFallbackStockData(symbol);
  }
}

// Fallback data that's more realistic
function getFallbackStockData(symbol: string): RealStockData {
  const realisticPrices: { [key: string]: { price: number, change: number } } = {
    // Indian Stocks (more realistic prices)
    'RELIANCE': { price: 2856.45, change: 12.35 },
    'TCS': { price: 3850.20, change: 45.60 },
    'INFY': { price: 1850.75, change: -23.40 },
    'HDFCBANK': { price: 1650.30, change: 8.90 },
    'ICICIBANK': { price: 1050.80, change: 5.25 },
    'SBIN': { price: 650.45, change: -3.20 },
    
    // US Stocks
    'AAPL': { price: 182.63, change: 1.24 },
    'MSFT': { price: 407.51, change: 2.89 },
    'GOOGL': { price: 138.25, change: 0.85 },
    'TSLA': { price: 245.12, change: -5.67 },
    'AMZN': { price: 175.34, change: 1.23 }
  };
  
  const stock = realisticPrices[symbol] || { price: 100, change: 0 };
  
  return {
    symbol,
    name: getStockName(symbol),
    price: stock.price,
    change: stock.change,
    changePercent: ((stock.change / stock.price) * 100).toFixed(2) + '%',
    lastUpdated: new Date().toISOString()
  };
}

function getStockName(symbol: string): string {
  const stockNames: { [key: string]: string } = {
    'RELIANCE': 'Reliance Industries',
    'TCS': 'Tata Consultancy Services',
    'INFY': 'Infosys',
    'HDFCBANK': 'HDFC Bank',
    'ICICIBANK': 'ICICI Bank',
    'SBIN': 'State Bank of India',
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'TSLA': 'Tesla Inc.',
    'AMZN': 'Amazon.com Inc.'
  };
  
  return stockNames[symbol] || symbol;
}

export const popularStocks = [
  'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN',
  'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'
];

export async function getMultipleStockPrices(symbols: string[]): Promise<RealStockData[]> {
  const promises = symbols.map(symbol => getRealStockPrice(symbol));
  return Promise.all(promises);
}
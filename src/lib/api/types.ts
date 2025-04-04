
export interface MarketStatus {
  market: string;
  serverTime: string;
  exchanges: {
    [key: string]: {
      name: string;
      status: string;
      sessionOpen: string;
      sessionClose: string;
    };
  };
  currencies: {
    [key: string]: {
      name: string;
      status: string;
      currencySymbol: string;
    };
  };
}

export interface MarketIndex {
  ticker: string;
  name: string; 
  market: string;
  locale: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface StockQuote {
  ticker: string;
  todaysChange: number;
  todaysChangePerc: number;
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  volume: number;
}

export interface SectorPerformance {
  sector: string;
  performance: number;
  change: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface PolygonMarketStatusResponse {
  market: string;
  serverTime: string;
  exchanges: {
    [key: string]: {
      name: string;
      status: string;
      sessionOpen: string;
      sessionClose: string;
    };
  };
  currencies: {
    [key: string]: {
      name: string;
      status: string;
      currencySymbol: string;
    };
  };
}

export interface PolygonSnapshotResponse {
  status: string;
  request_id: string;
  tickers: Array<{
    day: {
      c: number;
      h: number;
      l: number;
      o: number;
      v: number;
      vw: number;
    };
    lastQuote: {
      P: number;
      S: number;
      p: number;
      s: number;
      t: number;
    };
    lastTrade: {
      c: number[];
      i: string;
      p: number;
      s: number;
      t: number;
      x: number;
    };
    min: {
      av: number;
      c: number;
      h: number;
      l: number;
      o: number;
      v: number;
      vw: number;
    };
    prevDay: {
      c: number;
      h: number;
      l: number;
      o: number;
      v: number;
      vw: number;
    };
    ticker: string;
    todaysChange: number;
    todaysChangePerc: number;
    updated: number;
  }>
}


// Re-export everything from the individual modules
export * from './types';
export * from './config';
export * from './market';
export * from './watchlist';
export * from './volume';

// Create a default export with all commonly used functions
import { getApiKey, setApiKey } from './config';
import { fetchMarketStatus, fetchMarketIndices, fetchSectorPerformance } from './market';
import { fetchWatchlistData } from './watchlist';
import { fetchAggregateData, generateVolumeProfile, findSignificantLevels } from './volume';

export default {
  getApiKey,
  setApiKey,
  fetchMarketStatus,
  fetchMarketIndices,
  fetchSectorPerformance,
  fetchWatchlistData,
  fetchAggregateData,
  generateVolumeProfile,
  findSignificantLevels,
};

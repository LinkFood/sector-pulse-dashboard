
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchWatchlistData, WatchlistItem } from '@/lib/api';
import { toast } from 'sonner';

export interface WatchlistGroup {
  id: string;
  name: string;
  symbols: string[];
  expanded?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

interface WatchlistContextType {
  watchlistGroups: WatchlistGroup[];
  watchlistData: Record<string, WatchlistItem[]>;
  isLoading: boolean;
  activeWatchlist: string | null;
  setActiveWatchlist: (id: string | null) => void;
  addWatchlistGroup: (name: string) => void;
  removeWatchlistGroup: (id: string) => void;
  updateWatchlistGroup: (group: WatchlistGroup) => void;
  addSymbolToWatchlist: (id: string, symbol: string) => void;
  removeSymbolFromWatchlist: (id: string, symbol: string) => void;
  reorderWatchlist: (id: string, startIndex: number, endIndex: number) => void;
  reorderWatchlistGroups: (startIndex: number, endIndex: number) => void;
  toggleWatchlistExpanded: (id: string) => void;
  sortWatchlist: (id: string, sortBy: string, direction: 'asc' | 'desc') => void;
  refreshWatchlistData: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlistGroups, setWatchlistGroups] = useState<WatchlistGroup[]>([]);
  const [watchlistData, setWatchlistData] = useState<Record<string, WatchlistItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeWatchlist, setActiveWatchlist] = useState<string | null>(null);

  // Load watchlists from localStorage on component mount
  useEffect(() => {
    const storedWatchlists = localStorage.getItem('watchlist_groups');
    if (storedWatchlists) {
      try {
        const parsedGroups = JSON.parse(storedWatchlists) as WatchlistGroup[];
        setWatchlistGroups(parsedGroups);
        
        // Set the first watchlist as active if there's no active watchlist
        if (parsedGroups.length > 0 && !activeWatchlist) {
          setActiveWatchlist(parsedGroups[0].id);
        }
      } catch (error) {
        console.error('Error parsing watchlist groups from localStorage:', error);
        // Initialize with a default watchlist
        initializeDefaultWatchlist();
      }
    } else {
      // Initialize with a default watchlist
      initializeDefaultWatchlist();
    }
  }, []);

  // Initialize with a default watchlist
  const initializeDefaultWatchlist = () => {
    const defaultGroup: WatchlistGroup = {
      id: 'default',
      name: 'My Watchlist',
      symbols: ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"],
      expanded: true,
    };
    setWatchlistGroups([defaultGroup]);
    setActiveWatchlist('default');
    localStorage.setItem('watchlist_groups', JSON.stringify([defaultGroup]));
  };

  // Load watchlist data whenever the groups change
  useEffect(() => {
    refreshWatchlistData();
  }, [watchlistGroups]);

  // Save watchlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('watchlist_groups', JSON.stringify(watchlistGroups));
  }, [watchlistGroups]);

  const refreshWatchlistData = async () => {
    setIsLoading(true);
    const allData: Record<string, WatchlistItem[]> = {};
    
    try {
      // Process each watchlist group
      for (const group of watchlistGroups) {
        if (group.symbols.length > 0) {
          const data = await fetchWatchlistData(group.symbols);
          
          // Apply sorting if specified
          let sortedData = [...data];
          if (group.sortBy && group.sortDirection) {
            sortedData = sortWatchlistData(sortedData, group.sortBy, group.sortDirection);
          }
          
          allData[group.id] = sortedData;
        } else {
          allData[group.id] = [];
        }
      }
      
      setWatchlistData(allData);
    } catch (error) {
      console.error('Error fetching watchlist data:', error);
      toast.error('Failed to fetch watchlist data');
    } finally {
      setIsLoading(false);
    }
  };

  const addWatchlistGroup = (name: string) => {
    const newGroup: WatchlistGroup = {
      id: `watchlist-${Date.now()}`,
      name: name || 'New Watchlist',
      symbols: [],
      expanded: true,
    };
    
    setWatchlistGroups(prev => [...prev, newGroup]);
    setActiveWatchlist(newGroup.id);
  };

  const removeWatchlistGroup = (id: string) => {
    setWatchlistGroups(prev => prev.filter(group => group.id !== id));
    
    if (activeWatchlist === id) {
      const remaining = watchlistGroups.filter(group => group.id !== id);
      setActiveWatchlist(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateWatchlistGroup = (group: WatchlistGroup) => {
    setWatchlistGroups(prev => 
      prev.map(g => g.id === group.id ? { ...g, ...group } : g)
    );
  };

  const addSymbolToWatchlist = (id: string, symbol: string) => {
    const formattedSymbol = symbol.toUpperCase().trim();
    
    setWatchlistGroups(prev => 
      prev.map(group => {
        if (group.id === id) {
          // Check if symbol already exists
          if (group.symbols.includes(formattedSymbol)) {
            return group;
          }
          return {
            ...group,
            symbols: [...group.symbols, formattedSymbol]
          };
        }
        return group;
      })
    );
  };

  const removeSymbolFromWatchlist = (id: string, symbol: string) => {
    setWatchlistGroups(prev => 
      prev.map(group => {
        if (group.id === id) {
          return {
            ...group,
            symbols: group.symbols.filter(s => s !== symbol)
          };
        }
        return group;
      })
    );
  };

  const reorderWatchlist = (id: string, startIndex: number, endIndex: number) => {
    setWatchlistGroups(prev => {
      const updated = [...prev];
      const group = updated.find(g => g.id === id);
      if (group) {
        const newSymbols = [...group.symbols];
        const [movedSymbol] = newSymbols.splice(startIndex, 1);
        newSymbols.splice(endIndex, 0, movedSymbol);
        
        group.symbols = newSymbols;
      }
      return updated;
    });
  };

  const reorderWatchlistGroups = (startIndex: number, endIndex: number) => {
    setWatchlistGroups(prev => {
      const updated = [...prev];
      const [movedGroup] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, movedGroup);
      return updated;
    });
  };

  const toggleWatchlistExpanded = (id: string) => {
    setWatchlistGroups(prev => 
      prev.map(group => {
        if (group.id === id) {
          return {
            ...group,
            expanded: !group.expanded
          };
        }
        return group;
      })
    );
  };

  const sortWatchlistData = (data: WatchlistItem[], sortBy: string, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change':
          comparison = a.change - b.change;
          break;
        case 'changePercent':
          comparison = a.changePercent - b.changePercent;
          break;
        default:
          comparison = 0;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  const sortWatchlist = (id: string, sortBy: string, direction: 'asc' | 'desc') => {
    // Update the sorting preference in the watchlist group
    setWatchlistGroups(prev => 
      prev.map(group => {
        if (group.id === id) {
          return {
            ...group,
            sortBy,
            sortDirection: direction
          };
        }
        return group;
      })
    );
    
    // Sort the current data
    if (watchlistData[id]) {
      const sortedData = sortWatchlistData(watchlistData[id], sortBy, direction);
      setWatchlistData(prev => ({
        ...prev,
        [id]: sortedData
      }));
    }
  };

  const value = {
    watchlistGroups,
    watchlistData,
    isLoading,
    activeWatchlist,
    setActiveWatchlist,
    addWatchlistGroup,
    removeWatchlistGroup,
    updateWatchlistGroup,
    addSymbolToWatchlist,
    removeSymbolFromWatchlist,
    reorderWatchlist,
    reorderWatchlistGroups,
    toggleWatchlistExpanded,
    sortWatchlist,
    refreshWatchlistData
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export default WatchlistProvider;

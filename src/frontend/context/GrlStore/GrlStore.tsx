import { create } from 'zustand';
import logger from '@irdashies/utils/logger';
import { useDashboard } from '../DashboardContext/DashboardContext';

interface GrlDriver {
  name: string;
  rating: number;
}

interface GrlSeriesDriver {
  driverIRacingName: string;
  competition: {
    class: string;
  };
}

interface GrlSeriesData {
  classes: Record<string, GrlSeriesDriver[]>;
}

interface GrlState {
  drivers: Map<string, GrlDriver>;
  classes: Map<string, string>;
  fetchedSeries: Set<string>;
  isLoading: boolean;
  isSeriesLoading: boolean;
  error: string | null;
  fetchDrivers: () => Promise<void>;
  fetchSeriesData: (seriesNames: string[]) => Promise<void>;
  clearCache: () => void;
}

export const useGrlStore = create<GrlState>((set, get) => ({
  drivers: new Map(),
  classes: new Map(),
  fetchedSeries: new Set(),
  isLoading: false,
  isSeriesLoading: false,
  error: null,

  clearCache: () => {
    set({
      drivers: new Map(),
      classes: new Map(),
      fetchedSeries: new Set(),
      error: null,
    });
  },

  fetchDrivers: async () => {
    // Only fetch if we don't have data yet to avoid redundant calls
    if (get().isLoading || get().drivers.size > 0) return;
    set({ isLoading: true, error: null });
    try {
      const url = 'https://grl.taproom.us/drivers';
      logger.info(`[GRL_API] Fetching drivers: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch GRL drivers: ${response.statusText}`);
      }
      const data: GrlDriver[] = await response.json();
      const driversMap = new Map(data.map((d) => [d.name, d]));
      set({ drivers: driversMap, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchSeriesData: async (seriesNames: string[]) => {
    const { fetchedSeries, isSeriesLoading, classes } = get();
    const newSeriesToFetch = seriesNames.filter((s) => !fetchedSeries.has(s));

    if (newSeriesToFetch.length === 0 || isSeriesLoading) return;

    set({ isSeriesLoading: true });

    try {
      const newClassesMap = new Map(classes);
      const newFetchedSeries = new Set(fetchedSeries);

      for (const series of newSeriesToFetch) {
        const url = `https://grl.taproom.us/series/${series}`;
        logger.info(`[GRL_API] Fetching series data: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          // Still mark as fetched even if it failed to avoid retrying every frame
          newFetchedSeries.add(series);
          continue;
        }

        const data: GrlSeriesData = await response.json();
        if (data.classes) {
          Object.values(data.classes).forEach((drivers) => {
            drivers.forEach((d) => {
              if (d.driverIRacingName && d.competition?.class) {
                newClassesMap.set(d.driverIRacingName, d.competition.class);
              }
            });
          });
        }
        newFetchedSeries.add(series);
      }

      set({
        classes: newClassesMap,
        fetchedSeries: newFetchedSeries,
        isSeriesLoading: false,
      });
    } catch (err) {
      logger.error('Failed to fetch GRL series data', err);
      set({ isSeriesLoading: false });
    }
  },
}));

export const useGrlDriverRating = (name: string | undefined) => {
  const drivers = useGrlStore((state) => state.drivers);
  const { isDemoMode } = useDashboard();

  if (!name) return 0;

  if (isDemoMode) {
    // Deterministic mock rating between 1000 and 2500 based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    return 1000 + (seed % 1501); // 1000 to 2500
  }

  const driver = drivers.get(name);
  return driver ? Math.round(driver.rating) : 0;
};

export const useGrlDriverClass = (name: string | undefined) => {
  const classes = useGrlStore((state) => state.classes);
  const { isDemoMode } = useDashboard();

  if (!name) return undefined;

  if (isDemoMode) {
    // Deterministic mock class based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 2 === 0 ? 'Pro' : 'Am';
  }

  return classes.get(name);
};

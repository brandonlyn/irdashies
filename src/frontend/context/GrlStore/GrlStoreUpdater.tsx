import { useEffect, useMemo } from 'react';
import { GRL_LEAGUE_ID } from '@irdashies/types';
import { useGrlStore } from './GrlStore';
import {
  useSessionStore,
  useSessionDrivers,
} from '../SessionStore/SessionStore';
import { useDashboard } from '../DashboardContext/DashboardContext';

const CAR_TO_SERIES: Record<string, string[]> = {
  mx5: ['mx5-gt4'],
  mx52016: ['mx5-gt4'],
  amvantagegt4: ['mx5-gt4'],
  bmwm4evogt4: ['mx5-gt4'],
  fordmustanggt4: ['mx5-gt4'],
  mclaren570sgt4: ['mx5-gt4'],
  mercedesamggt4: ['mx5-gt4'],
  porsche718gt4: ['mx5-gt4'],
  formulair04: ['f4'],
  jettatdi: ['jetta-eu'],
  porsche9922cup: ['pcup-na', 'pcup-eu'],
};

/**
 * Hook that automatically fetches GRL driver data when a new session is detected.
 * This ensures GRL ratings and competition classes are up-to-date for each session.
 */
export const useGrlStoreUpdater = () => {
  const fetchDrivers = useGrlStore((state) => state.fetchDrivers);
  const fetchSeriesData = useGrlStore((state) => state.fetchSeriesData);
  const clearCache = useGrlStore((state) => state.clearCache);
  const subSessionId = useSessionStore(
    (state) => state.session?.WeekendInfo?.SubSessionID
  );
  const leagueId = useSessionStore(
    (state) => state.session?.WeekendInfo?.LeagueID
  );
  const drivers = useSessionDrivers();
  const { isDemoMode } = useDashboard();

  const shouldFetch = !isDemoMode && leagueId === GRL_LEAGUE_ID;

  // Clear cache when joining a new session
  useEffect(() => {
    if (subSessionId !== undefined) {
      clearCache();
    }
  }, [subSessionId, clearCache]);

  // Determine which GRL series to fetch based on cars in session
  const detectedSeries = useMemo(() => {
    if (!drivers || !shouldFetch) return [];

    const seriesSet = new Set<string>();
    drivers.forEach((driver) => {
      if (!driver.CarPath) return;

      // CarPath can sometimes be a space-separated list of names (e.g. "mx5 mx52016")
      const carNames = driver.CarPath.split(' ');
      carNames.forEach((carName) => {
        const series = CAR_TO_SERIES[carName];
        if (series) {
          series.forEach((s) => seriesSet.add(s));
        }
      });
    });

    return Array.from(seriesSet);
  }, [drivers, shouldFetch]);

  useEffect(() => {
    if (subSessionId !== undefined && shouldFetch) {
      fetchDrivers();
    }
  }, [subSessionId, fetchDrivers, shouldFetch]);

  useEffect(() => {
    if (
      subSessionId !== undefined &&
      detectedSeries.length > 0 &&
      shouldFetch
    ) {
      fetchSeriesData(detectedSeries);
    }
  }, [subSessionId, detectedSeries, fetchSeriesData, shouldFetch]);
};

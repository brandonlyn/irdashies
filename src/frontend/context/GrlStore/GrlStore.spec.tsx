import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGrlStore, useGrlDriverRating, useGrlDriverClass } from './GrlStore';
import * as DashboardContext from '../DashboardContext/DashboardContext';

vi.mock('../DashboardContext/DashboardContext', () => ({
  useDashboard: vi.fn(),
}));

describe('GrlStore', () => {
  beforeEach(() => {
    useGrlStore.getState().clearCache();
    vi.mocked(DashboardContext.useDashboard).mockReturnValue({
      isDemoMode: false,
    } as unknown as ReturnType<typeof DashboardContext.useDashboard>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have initial state', () => {
    const state = useGrlStore.getState();
    expect(state.drivers.size).toBe(0);
    expect(state.classes.size).toBe(0);
    expect(state.fetchedSeries.size).toBe(0);
    expect(state.isLoading).toBe(false);
    expect(state.isSeriesLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should fetch drivers successfully when API returns an array', async () => {
    const mockDrivers = [
      { name: 'Driver One', rating: 1500.5 },
      { name: 'Driver Two', rating: 2200 },
    ];

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockDrivers,
    } as Response);

    await useGrlStore.getState().fetchDrivers();

    const state = useGrlStore.getState();
    expect(state.drivers.size).toBe(2);
    expect(state.drivers.get('Driver One')).toEqual({
      name: 'Driver One',
      rating: 1500.5,
    });
    expect(state.drivers.get('Driver Two')).toEqual({
      name: 'Driver Two',
      rating: 2200,
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(fetchSpy).toHaveBeenCalledWith('https://grl.taproom.us/drivers');
  });

  it('should fetch drivers successfully when API returns wrapped _embedded structure', async () => {
    const mockEmbeddedResponse = {
      _links: { self: { href: '/drivers' } },
      count: 2,
      _embedded: {
        drivers: [
          { name: 'Driver Three', rating: 1800 },
          { name: 'Driver Four', rating: 2500.25 },
        ],
      },
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockEmbeddedResponse,
    } as Response);

    await useGrlStore.getState().fetchDrivers();

    const state = useGrlStore.getState();
    expect(state.drivers.size).toBe(2);
    expect(state.drivers.get('Driver Three')).toEqual({
      name: 'Driver Three',
      rating: 1800,
    });
    expect(state.drivers.get('Driver Four')).toEqual({
      name: 'Driver Four',
      rating: 2500.25,
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(fetchSpy).toHaveBeenCalledWith('https://grl.taproom.us/drivers');
  });

  it('should handle driver fetch error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    } as Response);

    await useGrlStore.getState().fetchDrivers();

    const state = useGrlStore.getState();
    expect(state.drivers.size).toBe(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Failed to fetch GRL drivers');
  });

  it('should handle fetch exception', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new Error('Network failure')
    );

    await useGrlStore.getState().fetchDrivers();

    const state = useGrlStore.getState();
    expect(state.drivers.size).toBe(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network failure');
  });

  it('should fetch series data successfully', async () => {
    const mockSeriesResponse = {
      name: 'Porsche Cup',
      classes: {
        Overall: [
          {
            driverIRacingName: 'Driver One',
            competition: { class: 'Pro' },
          },
          {
            driverIRacingName: 'Driver Two',
            competition: { class: 'Am' },
          },
        ],
      },
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockSeriesResponse,
    } as Response);

    await useGrlStore.getState().fetchSeriesData(['pcup-na']);

    const state = useGrlStore.getState();
    expect(state.classes.get('Driver One')).toBe('Pro');
    expect(state.classes.get('Driver Two')).toBe('Am');
    expect(state.fetchedSeries.has('pcup-na')).toBe(true);
    expect(state.isSeriesLoading).toBe(false);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://grl.taproom.us/series/pcup-na'
    );
  });

  it('should get ratings and classes via hooks', () => {
    // Populate store manually
    useGrlStore.setState({
      drivers: new Map([
        ['Alice', { name: 'Alice', rating: 1950.8 }],
        ['Bob', { name: 'Bob', rating: 1200.2 }],
      ]),
      classes: new Map([
        ['Alice', 'Pro'],
        ['Bob', 'Am'],
      ]),
    });

    const { result: aliceRating } = renderHook(() =>
      useGrlDriverRating('Alice')
    );
    const { result: aliceClass } = renderHook(() => useGrlDriverClass('Alice'));
    expect(aliceRating.current).toBe(1951); // rounded
    expect(aliceClass.current).toBe('Pro');

    const { result: unknownRating } = renderHook(() =>
      useGrlDriverRating('Unknown')
    );
    const { result: unknownClass } = renderHook(() =>
      useGrlDriverClass('Unknown')
    );
    expect(unknownRating.current).toBe(0);
    expect(unknownClass.current).toBeUndefined();

    // Test with undefined name
    const { result: undefinedRating } = renderHook(() =>
      useGrlDriverRating(undefined)
    );
    const { result: undefinedClass } = renderHook(() =>
      useGrlDriverClass(undefined)
    );
    expect(undefinedRating.current).toBe(0);
    expect(undefinedClass.current).toBeUndefined();
  });

  it('should return mock values in demo mode', () => {
    vi.mocked(DashboardContext.useDashboard).mockReturnValue({
      isDemoMode: true,
    } as unknown as ReturnType<typeof DashboardContext.useDashboard>);

    const { result: rating } = renderHook(() =>
      useGrlDriverRating('Demo Driver')
    );
    const { result: grlClass } = renderHook(() =>
      useGrlDriverClass('Demo Driver')
    );

    expect(rating.current).toBeGreaterThanOrEqual(1000);
    expect(rating.current).toBeLessThanOrEqual(2500);
    expect(['Pro', 'Am']).toContain(grlClass.current);
  });
});

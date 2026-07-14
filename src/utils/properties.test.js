import { describe, expect, it } from 'vitest';
import {
  buildWatchlistComparison,
  pruneUnavailableWatchlistIds,
  toggleWatchlistId,
} from './properties';

describe('toggleWatchlistId', () => {
  it('adds a property that is not saved', () => {
    expect(toggleWatchlistId([1], 2)).toEqual([1, 2]);
  });

  it('removes a property that is already saved', () => {
    expect(toggleWatchlistId([1, 2], 1)).toEqual([2]);
  });
});

describe('pruneUnavailableWatchlistIds', () => {
  const properties = [{ id: 1 }, { id: 2 }];

  it('removes ids that no longer exist in the catalog', () => {
    expect(pruneUnavailableWatchlistIds([1, 3], properties)).toEqual([1]);
  });

  it('preserves the existing array when every id is valid', () => {
    const watchlistIds = [1, 2];

    expect(pruneUnavailableWatchlistIds(watchlistIds, properties)).toBe(watchlistIds);
  });
});

describe('buildWatchlistComparison', () => {
  const properties = [
    { id: 1, apy: 8, value: 100000 },
    { id: 2, apy: 10, value: 200000 },
  ];

  it('calculates income and fractional ownership for saved properties', () => {
    const [comparison] = buildWatchlistComparison(properties, [1], 1200);

    expect(comparison.annualIncome).toBe(96);
    expect(comparison.monthlyIncome).toBe(8);
    expect(comparison.ownershipPercent).toBeCloseTo(1.2);
  });

  it('preserves watchlist order and identifies the yield leader', () => {
    const comparison = buildWatchlistComparison(properties, [2, 1], 1000);

    expect(comparison.map(property => property.id)).toEqual([2, 1]);
    expect(comparison[0].isYieldLeader).toBe(true);
    expect(comparison[1].isYieldLeader).toBe(false);
  });

  it('ignores unavailable ids and clamps negative investment amounts', () => {
    const comparison = buildWatchlistComparison(properties, [3, 1], -50);

    expect(comparison).toHaveLength(1);
    expect(comparison[0].annualIncome).toBe(0);
  });
});

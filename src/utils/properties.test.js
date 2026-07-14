import { describe, expect, it } from 'vitest';
import { pruneUnavailableWatchlistIds, toggleWatchlistId } from './properties';

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

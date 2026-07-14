export const findPropertyById = (properties, propertyId) => (
  properties.find(property => property.id === Number(propertyId))
);

export const toggleWatchlistId = (watchlistIds, propertyId) => (
  watchlistIds.includes(propertyId)
    ? watchlistIds.filter(id => id !== propertyId)
    : [...watchlistIds, propertyId]
);

export const pruneUnavailableWatchlistIds = (watchlistIds, properties) => {
  const availableIds = new Set(properties.map(property => property.id));
  const validIds = watchlistIds.filter(id => availableIds.has(id));

  return validIds.length === watchlistIds.length ? watchlistIds : validIds;
};

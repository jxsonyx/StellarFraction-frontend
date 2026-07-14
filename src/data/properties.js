const createProperty = (property) => ({
  userShares: 0,
  ...property,
});

export const INITIAL_PROPERTIES = [
  createProperty({
    id: 1,
    name: 'The Horizon Tower',
    location: 'Austin, TX',
    tokenCode: 'HORZ',
    issuer: 'GA2XHORIZONTOWERISSUE3567890XYZTOWER1',
    description: 'Class-A commercial office skyscraper with long-term tech tenants. Stable occupancy and high rental yield.',
    apy: 8.5,
    value: 12500000,
    image: '/horizon_tower.png'
  }),
  createProperty({
    id: 2,
    name: 'Oakridge Tech Hub',
    location: 'Seattle, WA',
    tokenCode: 'OAKT',
    issuer: 'GB5ROAKRIDGETECHISSUE4567890XYZOAK2',
    description: 'Modern R&D flex-space laboratory. Strong tenants in green tech and artificial intelligence industries.',
    apy: 9.1,
    value: 8200000,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)'
  }),
  createProperty({
    id: 3,
    name: 'Omni Retail Center',
    location: 'Miami, FL',
    tokenCode: 'OMNI',
    issuer: 'GC8KOMNIRETAILISSUE5678901XYZOMNI3',
    description: 'High-traffic, grocery-anchored neighborhood retail shopping plaza with long lease structures.',
    apy: 8.9,
    value: 6400000,
    gradient: 'linear-gradient(135deg, #070e1c 0%, #1e1b4b 100%)'
  })
];

import { useState } from 'react';
import { GitCompareArrows, MapPin, Trophy } from 'lucide-react';
import { formatPercent, formatUSD } from '../utils/format';
import { buildWatchlistComparison } from '../utils/properties';

export default function WatchlistComparison({
  properties,
  watchlistIds,
}) {
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const comparison = buildWatchlistComparison(properties, watchlistIds, investmentAmount);

  if (comparison.length < 2) return null;

  return (
    <section className="glass-card" style={{ marginBottom: '48px' }} aria-labelledby="watchlist-comparison-title">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <GitCompareArrows size={22} color="var(--primary-cyan)" aria-hidden="true" />
        <h2 id="watchlist-comparison-title" style={{ fontSize: '1.5rem' }}>
          Saved Property Comparison
        </h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Compare projected income from a {formatUSD(investmentAmount)} investment in each saved asset.
      </p>

      <div className="watchlist-comparison-control">
        <label htmlFor="comparison-amount">Investment per property</label>
        <strong>{formatUSD(investmentAmount)} USDC</strong>
        <input
          id="comparison-amount"
          type="range"
          min="100"
          max="10000"
          step="100"
          value={investmentAmount}
          onChange={event => setInvestmentAmount(Number(event.target.value))}
        />
      </div>

      <div className="watchlist-comparison-grid">
        {comparison.map(property => (
          <article
            key={property.id}
            className={`watchlist-comparison-card${property.isYieldLeader ? ' is-leader' : ''}`}
          >
            <div>
              <div className="watchlist-comparison-badges">
                <span className="badge-stellar">{property.tokenCode}</span>
                {property.isYieldLeader && (
                  <span className="comparison-leader-badge">
                    <Trophy size={12} aria-hidden="true" /> Best yield
                  </span>
                )}
              </div>
              <h3>{property.name}</h3>
              <p><MapPin size={13} aria-hidden="true" /> {property.location}</p>
            </div>
            <dl>
              <div><dt>APY</dt><dd>{property.apy}%</dd></div>
              <div><dt>Property value</dt><dd>{formatUSD(property.value)}</dd></div>
              <div><dt>Monthly income</dt><dd>{formatUSD(property.monthlyIncome)}</dd></div>
              <div><dt>Annual income</dt><dd>{formatUSD(property.annualIncome)}</dd></div>
              <div><dt>Est. ownership</dt><dd>{formatPercent(property.ownershipPercent, 3)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

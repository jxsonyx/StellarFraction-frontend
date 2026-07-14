import React, { useState } from 'react';
import { MapPin, Building, ArrowRight, DollarSign, Percent, TrendingUp } from 'lucide-react';

export default function PropertyCard({
  properties,
  wallet,
  watchlistIds,
  onToggleWatchlist,
  onClearWatchlist,
  onInvest,
  onWithdrawShares,
}) {
  void watchlistIds;
  void onToggleWatchlist;
  void onClearWatchlist;
  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Building color="var(--primary-cyan)" /> Active Real Estate Assets
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
        Browse premium commercial properties tokenized as Stellar Assets. Invest starting at just $1.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '28px'
      }}>
        {properties.map((prop) => {
          return (
            <PropertyItem 
              key={prop.id} 
              prop={prop} 
              wallet={wallet}
              onInvest={onInvest}
              onWithdrawShares={onWithdrawShares}
            />
          );
        })}
      </div>
    </div>
  );
}

function PropertyItem({ prop, wallet, onInvest, onWithdrawShares }) {
  const [investAmount, setInvestAmount] = useState(100);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const annualYield = (investAmount * (prop.apy / 100)).toFixed(2);
  const monthlyYield = (annualYield / 12).toFixed(2);

  const handleInvest = () => {
    setIsStaking(true);
    setTimeout(() => {
      onInvest(prop.id, investAmount);
      setIsStaking(false);
    }, 800);
  };

  const handleWithdraw = () => {
    setIsUnstaking(true);
    setTimeout(() => {
      onWithdrawShares(prop.id, prop.userShares);
      setIsUnstaking(false);
    }, 800);
  };

  return (
    <div className="glass-card glow-card-purple" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Property Image Header */}
      <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {prop.image ? (
          <img 
            src={prop.image} 
            alt={prop.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: prop.gradient || 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building size={48} color="rgba(255,255,255,0.2)" />
          </div>
        )}
        <div style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px',
          background: 'rgba(5, 7, 12, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '20px',
          padding: '4px 12px',
          border: '1px solid var(--border-light)'
        }}>
          <span style={{ color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.85rem' }}>
            {prop.tokenCode}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>{prop.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="var(--primary-purple)" /> {prop.location}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--accent-green)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Percent size={14} /> {prop.apy}% APY
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Projected Yield</span>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: 1.4 }}>
          {prop.description}
        </p>

        {/* Technical Stellar Specs */}
        <div style={{ 
          background: 'rgba(0,0,0,0.2)', 
          borderRadius: '12px', 
          padding: '12px', 
          border: '1px solid var(--border-light)',
          fontSize: '0.8rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px 16px',
          marginBottom: '20px'
        }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Asset Code:</span> <code style={{ color: '#fff' }}>{prop.tokenCode}</code>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Price:</span> <span style={{ color: '#fff' }}>$1.00 USDC</span>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Issuer Key:</span> <code style={{ color: '#818cf8', fontSize: '0.7rem' }}>{prop.issuer}</code>
          </div>
        </div>

        {/* Yield Calculator Slider */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Simulate Investment</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>${investAmount.toLocaleString()} USDC</span>
          </div>
          
          <input 
            type="range" 
            min="10" 
            max="10000" 
            step="10" 
            value={investAmount}
            onChange={(e) => setInvestAmount(Number(e.target.value))}
            style={{ marginBottom: '12px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2px', fontSize: '0.7rem' }}>Monthly Dividends</p>
              <p style={{ color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.9rem' }}>+${monthlyYield} USDC</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2px', fontSize: '0.7rem' }}>Annual Dividends</p>
              <p style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.9rem' }}>+${annualYield} USDC</p>
            </div>
          </div>
        </div>

        {/* Staking State / Action */}
        <div style={{ marginTop: 'auto' }}>
          {prop.userShares > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              padding: '10px 14px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Your Staked Shares:</span>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{prop.userShares.toLocaleString()} {prop.tokenCode}</p>
              </div>
              <button 
                onClick={handleWithdraw}
                disabled={isUnstaking}
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--accent-red)', border: '1px solid rgba(239, 68, 68, 0.15)' }}
              >
                {isUnstaking ? 'Unstaking...' : 'Unstake Shares'}
              </button>
            </div>
          )}

          {wallet.connected ? (
            <button 
              onClick={handleInvest}
              disabled={isStaking || wallet.balanceUSDC < investAmount}
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isStaking ? 'Executing Soroban Staking...' : wallet.balanceUSDC < investAmount ? 'Insufficient USDC Balance' : `Buy & Stake $${investAmount.toLocaleString()} Shares`}
              <ArrowRight size={16} />
            </button>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '12px', border: '1px dotted var(--border-light)', borderRadius: '12px' }}>
              Connect your Stellar wallet to buy & stake.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

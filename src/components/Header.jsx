import React, { useState } from 'react';
import { Globe, Wallet, Github, ShieldAlert, Cpu } from 'lucide-react';
import { formatCurrency } from '../utils/format';

export default function Header({ wallet, setWallet, onResetSimulation }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      // Generate a mock Stellar address
      setWallet({
        address: 'GC3X4O...5H2W7P',
        balanceUSDC: 5000,
        balanceShares: 0,
        connected: true
      });
      setIsConnecting(false);
    }, 1000);
  };

  const disconnectWallet = () => {
    setWallet({
      address: '',
      balanceUSDC: 0,
      balanceShares: 0,
      connected: false
    });
  };

  return (
    <header className="glass-card" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none', padding: '16px 24px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--primary-gradient)',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
          }}>
            <Cpu size={22} color="#030712" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Stellar<span className="cyan-purple-text">Fraction</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              Yield-Bearing Real Estate
            </p>
          </div>
        </div>

        {/* Network & Info Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="nav-desktop">
          <span className="badge-stellar">
            <Globe size={12} />
            Stellar Testnet
          </span>
          <span className="badge-reward">
            <ShieldAlert size={12} />
            Soroban Enabled
          </span>
        </div>

        {/* Wallet & Github Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn-secondary"
            onClick={onResetSimulation}
            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Reset simulation variables to default"
          >
            Reset Demo
          </button>
          
          <a 
            href="https://github.com/stellarfraction/drips" 
            target="_blank" 
            rel="noreferrer"
            className="btn-secondary"
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Github size={18} />
          </a>

          {wallet.connected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{wallet.address}</span>
                <span style={{ color: 'var(--accent-green)' }}>{formatCurrency(wallet.balanceUSDC)} USDC</span>
              </div>
              <button 
                onClick={disconnectWallet}
                className="btn-secondary" 
                style={{ padding: '8px 14px', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)' }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="btn-primary" 
              style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              disabled={isConnecting}
            >
              <Wallet size={16} />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

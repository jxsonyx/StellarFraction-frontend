import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Stats from './components/Stats';
import PropertyCard from './components/PropertyCard';
import InvestmentCalculator from './components/InvestmentCalculator';
import StellarWorkflow from './components/StellarWorkflow';
import SorobanPlayground from './components/SorobanPlayground';
import { INITIAL_PROPERTIES } from './data/properties';
import { DEFAULT_WATCHLIST, WATCHLIST_STORAGE_KEY } from './constants/watchlist';
import { usePersistentState } from './hooks/usePersistentState';
import { toggleWatchlistId } from './utils/properties';
import { Cpu, Terminal, BookOpen, Users, GitFork, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [wallet, setWallet] = useState({
    address: '',
    balanceUSDC: 0,
    balanceShares: 0,
    connected: false
  });

  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [watchlistIds, setWatchlistIds] = usePersistentState(
    WATCHLIST_STORAGE_KEY,
    DEFAULT_WATCHLIST,
  );

  const handleToggleWatchlist = (propertyId) => {
    setWatchlistIds(currentIds => toggleWatchlistId(currentIds, propertyId));
  };

  const handleClearWatchlist = () => setWatchlistIds(DEFAULT_WATCHLIST);

  // Soroban Playground State Variables (Synchronized with App)
  const [stakers, setStakers] = useState([]);
  const [accRewardPerShare, setAccRewardPerShare] = useState(0); // scaled by 1e12
  const [totalShares, setTotalShares] = useState(4000); // 1000 Alice + 3000 Bob initial
  const [contractUSDC, setContractUSDC] = useState(0);
  const [totalDividends, setTotalDividends] = useState(0);

  const SCALE_FACTOR = 1_000_000_000_000;

  // Initialize stakers list
  useEffect(() => {
    resetSimulationState();
  }, []);

  const resetSimulationState = () => {
    setProperties(INITIAL_PROPERTIES.map(p => ({ ...p, userShares: 0 })));
    setStakers([
      { id: 1, name: 'Alice (Investor A)', shares: 1000, debt: 0, usdcBalance: 0, deedBalance: 5000 },
      { id: 2, name: 'Bob (Investor B)', shares: 3000, debt: 0, usdcBalance: 0, deedBalance: 5000 },
      { id: 3, name: 'You (GC3X4O...)', shares: 0, debt: 0, usdcBalance: 0, deedBalance: 5000 }
    ]);
    setAccRewardPerShare(0);
    setTotalShares(4000);
    setContractUSDC(0);
    setTotalDividends(0);
    setWallet(prev => {
      if (prev.connected) {
        return {
          ...prev,
          balanceUSDC: 5000,
          balanceShares: 0
        };
      }
      return prev;
    });
  };

  // Synchronize wallet state with "You" in stakers list
  useEffect(() => {
    if (wallet.connected) {
      const youStaker = stakers.find(s => s.id === 3);
      if (youStaker) {
        // If "You" has accumulated balance in the contract simulator, synchronize it to wallet
        setWallet(prev => ({
          ...prev,
          balanceShares: youStaker.shares
        }));
      }
    }
  }, [stakers, wallet.connected]);

  // Unified Invest/Staking handler
  const handleInvest = (propertyId, amount) => {
    if (!wallet.connected) return;

    // 1. Update Property list userShares
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, userShares: p.userShares + amount };
      }
      return p;
    }));

    // 2. Update wallet USDC balance
    setWallet(prev => ({
      ...prev,
      balanceUSDC: Math.max(0, prev.balanceUSDC - amount)
    }));

    // 3. Update stakers list for Soroban simulation
    setStakers(prevStakers => {
      return prevStakers.map(s => {
        if (s.id === 3) { // 3 represents "You"
          // Calculate pending reward up to this point
          let pending = 0;
          if (s.shares > 0) {
            const accumulated = (s.shares * accRewardPerShare) / SCALE_FACTOR;
            pending = accumulated - s.debt;
          }
          
          const newShares = s.shares + amount;
          const newUSDCBalance = s.usdcBalance + pending;
          // Set new debt
          const newDebt = (newShares * accRewardPerShare) / SCALE_FACTOR;

          return {
            ...s,
            shares: newShares,
            debt: newDebt,
            usdcBalance: newUSDCBalance,
            deedBalance: Math.max(0, s.deedBalance - amount)
          };
        }
        return s;
      });
    });

    setTotalShares(prev => prev + amount);
  };

  // Unified Unstake/Withdraw handler
  const handleWithdrawShares = (propertyId, amount) => {
    if (!wallet.connected) return;

    // 1. Update Property list userShares
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, userShares: Math.max(0, p.userShares - amount) };
      }
      return p;
    }));

    // 2. Return shares/USDC to wallet (in this flow, unstaking returns the USDC to the investor)
    setWallet(prev => ({
      ...prev,
      balanceUSDC: prev.balanceUSDC + amount
    }));

    // 3. Update stakers list
    setStakers(prevStakers => {
      return prevStakers.map(s => {
        if (s.id === 3) {
          let pending = 0;
          if (s.shares > 0) {
            const accumulated = (s.shares * accRewardPerShare) / SCALE_FACTOR;
            pending = accumulated - s.debt;
          }

          const newShares = Math.max(0, s.shares - amount);
          const newUSDCBalance = s.usdcBalance + pending;
          
          let newDebt = 0;
          if (newShares > 0) {
            newDebt = (newShares * accRewardPerShare) / SCALE_FACTOR;
          }

          return {
            ...s,
            shares: newShares,
            debt: newDebt,
            usdcBalance: newUSDCBalance,
            deedBalance: s.deedBalance + amount
          };
        }
        return s;
      });
    });

    setTotalShares(prev => Math.max(0, prev - amount));
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Navbar Header */}
      <Header 
        wallet={wallet} 
        setWallet={setWallet} 
        onResetSimulation={resetSimulationState}
      />

      <div className="container">
        {/* Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '16px' }}>
          <h1 className="gradient-text" style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
            Tokenized Yield-Bearing Real Estate
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            StellarFraction empowers retail investors to buy fractional shares of physical property deeds starting at just $1. 
            Earn automated USDC rental income distributions powered by Soroban smart contracts.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <a href="#calculator" className="btn-primary" style={{ textDecoration: 'none' }}>
              Calculate Returns
            </a>
            <a href="#workflow" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Explore SDK Workflows
            </a>
          </div>
        </section>

        {/* High Level Stats */}
        <Stats totalDividends={totalDividends} totalStaked={totalShares} />

        {/* Active Property Cards */}
        <PropertyCard 
          properties={properties} 
          wallet={wallet}
          watchlistIds={watchlistIds}
          onToggleWatchlist={handleToggleWatchlist}
          onClearWatchlist={handleClearWatchlist}
          onInvest={handleInvest}
          onWithdrawShares={handleWithdrawShares}
        />

        {/* ROI Calculator */}
        <InvestmentCalculator properties={properties} />

        {/* Medium Task: Stellar SDK Workflows */}
        <StellarWorkflow />

        {/* High Task: Soroban Distribution contract Simulation */}
        <SorobanPlayground 
          stakers={stakers}
          setStakers={setStakers}
          accRewardPerShare={accRewardPerShare}
          setAccRewardPerShare={setAccRewardPerShare}
          totalShares={totalShares}
          setTotalShares={setTotalShares}
          contractUSDC={contractUSDC}
          setContractUSDC={setContractUSDC}
          totalDividends={totalDividends}
          setTotalDividends={setTotalDividends}
        />

        {/* Open Source / Contributor Guide Section */}
        <section className="glass-card" style={{ padding: '32px', marginTop: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BookOpen size={24} color="var(--primary-cyan)" />
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Open Source Contributor Guide</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            StellarFraction is fully open-source and structured for community participation. We invite developers, auditors, and designers to contribute to our Stellar-based architecture.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Terminal size={18} color="var(--primary-cyan)" />
                <h4 style={{ margin: 0, fontWeight: 700 }}>Rust Contract Dev</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                Work on extending the Soroban smart contracts. Add landlord fees, dynamic staking locks, or compound auto-reinvestment options.
              </p>
              <code style={{ fontSize: '0.75rem', color: '#818cf8', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                cargo build --target wasm32-unknown-unknown --release
              </code>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Cpu size={18} color="var(--primary-purple)" />
                <h4 style={{ margin: 0, fontWeight: 700 }}>Stellar SDK Integration</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                Help connect the web interface to actual Stellar wallets (Freighter, Albedo, Hana) and implement live Testnet transaction broadcasting.
              </p>
              <code style={{ fontSize: '0.75rem', color: '#818cf8', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', display: 'block' }}>
                npm run dev
              </code>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <GitFork size={18} color="var(--accent-green)" />
                <h4 style={{ margin: 0, fontWeight: 700 }}>Contribute Flow</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                Fork the repo, create a branch, write unit tests for your features, verify code style, and submit a detailed Pull Request.
              </p>
              <a href="https://github.com/stellarfraction/drips/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                Read CONTRIBUTING.md <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>© 2026 StellarFraction Project. Released under the MIT License.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Documentation</a>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Terminal, Shield } from 'lucide-react';
import { calculatePendingReward } from '../utils/math';

export default function SorobanPlayground({
  stakers,
  setStakers,
  accRewardPerShare,
  setAccRewardPerShare,
  totalShares,
  setTotalShares,
  contractUSDC,
  setContractUSDC,
  setTotalDividends
}) {
  const [rentAmount, setRentAmount] = useState(1200);
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation', 'rust', 'complexity'
  const [logs, setLogs] = useState([
    { text: 'Soroban contract initialized with Share Token (HORZ) and Reward Token (USDC).', type: 'system' }
  ]);

  const SCALE_FACTOR = 1_000_000_000_000; // 1e12

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { text, type }]);
  };

  // Helper: calculate pending rewards for a staker
  const calculatePending = (staker) => calculatePendingReward(staker.shares, accRewardPerShare, staker.debt, SCALE_FACTOR);

  // Deposit/Stake function
  const handleStake = (stakerId, amount) => {
    if (amount <= 0) return;
    
    setStakers(prevStakers => {
      return prevStakers.map(s => {
        if (s.id === stakerId) {
          // 1. Calculate pending rewards based on CURRENT AccRewardPerShare
          const pending = calculatePending(s);
          const newShares = s.shares + amount;
          
          // 2. Add pending to staker's claimable/claimed USDC (auto-claim during stake)
          const newUSDCBalance = s.usdcBalance + pending;
          
          // 3. Calculate new debt based on new shares and AccRewardPerShare
          const newDebt = (newShares * accRewardPerShare) / SCALE_FACTOR;
          
          addLog(`📥 ${s.name} staked +${amount} HORZ shares. Auto-claimed $${pending.toFixed(2)} USDC in pending dividends.`, 'deposit');
          
          return {
            ...s,
            shares: newShares,
            debt: newDebt,
            usdcBalance: newUSDCBalance,
            deedBalance: s.deedBalance - amount
          };
        }
        return s;
      });
    });

    setTotalShares(prev => prev + amount);
  };

  // Withdraw/Unstake function
  const handleUnstake = (stakerId, amount) => {
    const staker = stakers.find(s => s.id === stakerId);
    if (!staker || staker.shares < amount || amount <= 0) return;

    setStakers(prevStakers => {
      return prevStakers.map(s => {
        if (s.id === stakerId) {
          const pending = calculatePending(s);
          const newShares = s.shares - amount;
          const newUSDCBalance = s.usdcBalance + pending;
          
          let newDebt = 0;
          if (newShares > 0) {
            newDebt = (newShares * accRewardPerShare) / SCALE_FACTOR;
          }

          addLog(`📤 ${s.name} unstaked ${amount} HORZ shares. Auto-claimed $${pending.toFixed(2)} USDC.`, 'withdraw');

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

    setTotalShares(prev => prev - amount);
  };

  // Distribute Dividends (USDC) from rent
  const handleDistribute = () => {
    if (totalShares === 0) {
      addLog('❌ Cannot distribute dividends: No shares are currently staked in the contract.', 'error');
      return;
    }
    if (rentAmount <= 0) return;

    // 1. Calculate how much reward increases per share
    // In Rust contract: reward_increase = (amount * SCALE_FACTOR) / total_shares;
    const rewardIncrease = (rentAmount * SCALE_FACTOR) / totalShares;
    
    // 2. Update global AccRewardPerShare
    const newAccReward = accRewardPerShare + Math.round(rewardIncrease);
    
    setAccRewardPerShare(newAccReward);
    setContractUSDC(prev => prev + rentAmount);
    setTotalDividends(prev => prev + rentAmount);

    addLog(`💰 Rental Income of $${rentAmount.toLocaleString()} USDC received and distributed proportionally.`, 'dividend');
    addLog(`📈 AccRewardPerShare updated to ${(newAccReward / SCALE_FACTOR).toFixed(6)} USDC/Share (Total Staked: ${totalShares} Shares).`, 'system');
  };

  // Claim Dividends
  const handleClaim = (stakerId) => {
    const staker = stakers.find(s => s.id === stakerId);
    if (!staker) return;

    const pending = calculatePending(staker);
    if (pending <= 0) {
      addLog(`⚠️ ${staker.name} has no pending dividends to claim.`, 'warning');
      return;
    }

    setStakers(prevStakers => {
      return prevStakers.map(s => {
        if (s.id === stakerId) {
          // Reset debt based on current shares and AccRewardPerShare
          const newDebt = (s.shares * accRewardPerShare) / SCALE_FACTOR;
          return {
            ...s,
            debt: newDebt,
            usdcBalance: s.usdcBalance + pending
          };
        }
        return s;
      });
    });

    setContractUSDC(prev => Math.max(0, prev - pending));
    addLog(`🎉 ${staker.name} claimed $${pending.toFixed(2)} USDC dividends.`, 'success');
  };

  return (
    <div className="glass-card" style={{ marginBottom: '48px' }} id="playground">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={18} color="var(--accent-green)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Soroban Rust Contract Playground</h2>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-light)' }}>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`btn-secondary ${activeTab === 'simulation' ? 'active-tab' : ''}`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '0.8rem', 
              border: 'none', 
              background: activeTab === 'simulation' ? 'rgba(255,255,255,0.07)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'simulation' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Live Simulator
          </button>
          <button 
            onClick={() => setActiveTab('rust')}
            className={`btn-secondary ${activeTab === 'rust' ? 'active-tab' : ''}`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '0.8rem', 
              border: 'none', 
              background: activeTab === 'rust' ? 'rgba(255,255,255,0.07)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'rust' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Rust Contract Code
          </button>
          <button 
            onClick={() => setActiveTab('complexity')}
            className={`btn-secondary ${activeTab === 'complexity' ? 'active-tab' : ''}`}
            style={{ 
              padding: '6px 12px', 
              fontSize: '0.8rem', 
              border: 'none', 
              background: activeTab === 'complexity' ? 'rgba(255,255,255,0.07)' : 'none',
              borderRadius: '8px',
              color: activeTab === 'complexity' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            O(1) vs O(N) Payouts
          </button>
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Interact directly with a simulator built on the exact mathematical logic of our Soroban Rust smart contract.
      </p>

      {activeTab === 'simulation' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          
          {/* Simulation Dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Global Contract State */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Contract State Variables
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.85rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2px', fontSize: '0.75rem' }}>Total Staked (TotalShares)</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{totalShares.toLocaleString()} Shares</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2px', fontSize: '0.75rem' }}>AccRewardPerShare (Scaled)</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-cyan)' }}>{(accRewardPerShare / SCALE_FACTOR).toFixed(6)}</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2px', fontSize: '0.75rem' }}>USDC Pool (In Contract)</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-green)' }}>${contractUSDC.toLocaleString()} USDC</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2px', fontSize: '0.75rem' }}>Scale Precision Factor</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-purple)' }}>10^12 (i128)</p>
                </div>
              </div>
            </div>

            {/* Distribution Trigger */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
                Simulate Tenant Rent Distribution
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Distribute a lump sum of rent to all stakers. The contract will divide it proportionally and instantly update staker shares in O(1) complexity.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative', flexGrow: 1 }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>$</span>
                  <input 
                    type="number" 
                    value={rentAmount} 
                    onChange={(e) => setRentAmount(Math.max(0, Number(e.target.value)))}
                    style={{
                      width: '100%',
                      background: 'rgba(5,7,12,0.8)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '10px',
                      padding: '12px 12px 12px 28px',
                      color: '#fff',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <button onClick={handleDistribute} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Distribute Rent
                </button>
              </div>
            </div>

          </div>

          {/* Stakers & Console Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Stakers Grid */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>
                Stakers List (Simulated Ledgers)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {stakers.map(s => {
                  const pending = calculatePending(s);
                  return (
                    <div key={s.id} style={{ 
                      background: 'rgba(0,0,0,0.15)', 
                      borderRadius: '12px', 
                      padding: '12px 16px',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{s.name}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleStake(s.id, 500)}
                            style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '4px' }}
                            className="btn-secondary"
                            title="Stake 500 more property shares"
                          >
                            +500 Stake
                          </button>
                          {s.shares >= 500 && (
                            <button 
                              onClick={() => handleUnstake(s.id, 500)}
                              style={{ padding: '4px 8px', fontSize: '0.7rem', borderRadius: '4px', color: 'var(--accent-red)' }}
                              className="btn-secondary"
                              title="Withdraw 500 shares"
                            >
                              -500 Unstake
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Staked Shares:</span>
                          <p style={{ color: '#fff', fontWeight: 600 }}>{s.shares.toLocaleString()} HORZ</p>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Unclaimed Rent:</span>
                          <p style={{ color: 'var(--accent-green)', fontWeight: 700 }}>${pending.toFixed(2)} USDC</p>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-secondary)' }}>Claimed Dividends:</span>
                          <p style={{ color: '#fff', fontWeight: 600 }}>${s.usdcBalance.toFixed(2)} USDC</p>
                        </div>
                      </div>

                      {pending > 0 && (
                        <button 
                          onClick={() => handleClaim(s.id)}
                          className="btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', marginTop: '4px' }}
                        >
                          Claim ${pending.toFixed(2)} USDC
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Console Log */}
            <div className="glass-card" style={{ padding: '16px', background: 'rgba(5,7,12,0.9)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', height: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '8px' }}>
                <Terminal size={14} color="var(--accent-green)" />
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>Soroban Event Stream</span>
              </div>
              
              <div style={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                fontFamily: 'monospace', 
                fontSize: '0.75rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px' 
              }}>
                {logs.map((l, index) => (
                  <div key={index} style={{
                    color: l.type === 'error' ? 'var(--accent-red)' :
                           l.type === 'success' ? 'var(--accent-green)' :
                           l.type === 'dividend' ? '#fbbf24' :
                           l.type === 'deposit' ? 'var(--primary-cyan)' :
                           l.type === 'withdraw' ? 'var(--primary-purple)' : '#94a3b8'
                  }}>
                    &gt; {l.text}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'rust' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Below is the reward accumulator math implemented in Rust. It utilizes instance storage for global constants and persistent storage for user-specific stakings.
          </p>
          <pre className="code-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <code>
              <span className="code-keyword">const</span> SCALE_FACTOR: <span className="code-type">i128</span> = <span className="code-string">1_000_000_000_000</span>; <span className="code-comment">// 1e12 for precision scaling</span>{'\n\n'}
              <span className="code-comment">/// Calculates the pending USDC rewards for a user staker</span>{'\n'}
              <span className="code-keyword">fn</span> <span className="code-fn">calculate_pending</span>(env: &Env, user: &Address) -&gt; <span className="code-type">i128</span> {'{'}{'\n'}
              {'  '}<span className="code-keyword">let</span> shares = env.storage().persistent().get(&DataKey::UserShare(user.clone())).unwrap_or(<span className="code-string">0i128</span>);{'\n'}
              {'  '}<span className="code-keyword">if</span> shares == <span className="code-string">0</span> {'{'} <span className="code-keyword">return</span> <span className="code-string">0</span>; {'}'}{'\n'}
              {'  '}<span className="code-keyword">let</span> acc_reward_per_share = env.storage().instance().get(&DataKey::AccRewardPerShare).unwrap_or(<span className="code-string">0i128</span>);{'\n'}
              {'  '}<span className="code-keyword">let</span> debt = env.storage().persistent().get(&DataKey::UserDebt(user.clone())).unwrap_or(<span className="code-string">0i128</span>);{'\n\n'}
              {'  '}<span className="code-comment">// Core Math Formula: pending = (shares * acc_reward) / SCALE - debt</span>{'\n'}
              {'  '}<span className="code-keyword">let</span> accumulated = (shares * acc_reward_per_share) / SCALE_FACTOR;{'\n'}
              {'  '}accumulated - debt{'\n'}
              {'}'}{'\n\n'}
              <span className="code-comment">/// Distribute rental USDC: O(1) time complexity</span>{'\n'}
              <span className="code-keyword">pub fn</span> <span className="code-fn">distribute</span>(env: Env, sender: Address, amount: <span className="code-type">i128</span>) -&gt; Result&lt;(), Error&gt; {'{'}{'\n'}
              {'  '}sender.require_auth();{'\n'}
              {'  '}<span className="code-keyword">let</span> total_shares: <span className="code-type">i128</span> = env.storage().instance().get(&DataKey::TotalShares).unwrap();{'\n'}
              {'  '}<span className="code-keyword">if</span> total_shares == <span className="code-string">0</span> {'{'} <span className="code-keyword">return</span> Err(Error::NoSharesStaked); {'}'}{'\n\n'}
              {'  '}<span className="code-keyword">let</span> reward_client = token::Client::new(&env, &reward_token_addr);{'\n'}
              {'  '}reward_client.transfer(&sender, &env.current_contract_address(), &amount);{'\n\n'}
              {'  '}<span className="code-comment">// Add to the global accumulator: increases reward density for all shares</span>{'\n'}
              {'  '}<span className="code-keyword">let</span> acc_reward_per_share = env.storage().instance().get(&DataKey::AccRewardPerShare).unwrap_or(<span className="code-string">0</span>);{'\n'}
              {'  '}<span className="code-keyword">let</span> reward_increase = (amount * SCALE_FACTOR) / total_shares;{'\n'}
              {'  '}env.storage().instance().set(&DataKey::AccRewardPerShare, &(acc_reward_per_share + reward_increase));{'\n'}
              {'  '}Ok(()){'\n'}
              {'}'}
            </code>
          </pre>
        </div>
      )}

      {activeTab === 'complexity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* O(N) Box */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-red)', background: 'rgba(239, 68, 68, 0.03)' }}>
              <h4 style={{ color: 'var(--accent-red)', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>
                ❌ Naive O(N) Looping Method
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                When rental dividends arrive, the contract loops through every single investor account in a list, calculates their payout, and transfers it to them directly.
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>⛔ <strong>Unbounded gas cost:</strong> If there are 1,000+ investors, the transaction will exceed Soroban's CPU instruction/size limits.</li>
                <li>⛔ <strong>Security risks:</strong> Contract can easily lock up forever if the loop fails on one corrupted account address.</li>
                <li>⛔ <strong>Higher fees:</strong> Expensive execution for the tenant/admin distributing rent.</li>
              </ul>
            </div>

            {/* O(1) Box */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-green)', background: 'rgba(16, 185, 129, 0.03)' }}>
              <h4 style={{ color: 'var(--accent-green)', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>
                ✅ Scalable O(1) Accumulator Method
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                Dividends are pooled, updating a single global accumulator (`AccRewardPerShare`). Users claim their dividends individually when they choose.
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>⭐ <strong>Constant gas cost:</strong> Distribute operations take the exact same gas whether there are 10 or 1,000,000 stakers.</li>
                <li>⭐ <strong>Un-lockable structure:</strong> No loops. Stakers only execute code relevant to their own wallets.</li>
                <li>⭐ <strong>High precision:</strong> Scale factor of 1e12 ensures no fractional USDC is lost due to division rounding.</li>
              </ul>
            </div>

          </div>

          <div style={{ 
            background: 'rgba(0, 240, 255, 0.03)', 
            border: '1px solid rgba(0, 240, 255, 0.1)', 
            padding: '16px', 
            borderRadius: '12px',
            fontSize: '0.85rem',
            lineHeight: 1.5
          }}>
            <strong>Open-Source Note:</strong> This accumulator pattern is based on the famous scalable distribution algorithm originally described by Batog et al. (the staking reward pool pattern). It is the standard production approach for high-performance DeFi yield pools.
          </div>
        </div>
      )}

    </div>
  );
}

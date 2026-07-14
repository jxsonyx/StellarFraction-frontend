import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { findPropertyById } from '../utils/properties';

export default function InvestmentCalculator({ properties }) {
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || 1);
  const [principal, setPrincipal] = useState(1000);
  const [years, setYears] = useState(10);
  const [reinvest, setReinvest] = useState(true);

  const selectedProp = findPropertyById(properties, selectedPropId) || properties[0];

  const apy = selectedProp.apy;
  const appreciationRate = 0.045; // 4.5% annual property appreciation

  // Calculation logic
  let totalYield = 0;
  let currentPrincipal = principal;
  let yieldsArray = [];
  let appreciationArray = [];

  for (let year = 1; year <= years; year++) {
    // Rental Yield for this year
    const yearlyYield = currentPrincipal * (apy / 100);
    totalYield += yearlyYield;
    
    // If reinvesting, add yield to principal for next year
    if (reinvest) {
      currentPrincipal += yearlyYield;
    }
    
    // Asset appreciation
    const appreciatedVal = principal * Math.pow(1 + appreciationRate, year);
    const appreciationProfit = appreciatedVal - principal;

    if (year === 1 || year === 3 || year === 5 || year === 10 || year === 20 || year === 30 || year === years) {
      yieldsArray.push({ year, value: Math.round(totalYield) });
      appreciationArray.push({ year, value: Math.round(appreciationProfit) });
    }
  }

  // Final values
  const finalAppreciationProfit = principal * Math.pow(1 + appreciationRate, years) - principal;
  const finalTotalValue = principal + totalYield + finalAppreciationProfit;
  const totalGain = finalTotalValue - principal;
  const roiPercentage = ((totalGain / principal) * 100).toFixed(0);

  // Generate steps for rendering CSS chart
  const chartIntervals = [1, Math.max(2, Math.floor(years / 2)), years];
  const chartData = chartIntervals.map(yr => {
    let tYield = 0;
    let currP = principal;
    for (let i = 1; i <= yr; i++) {
      const yYield = currP * (apy / 100);
      tYield += yYield;
      if (reinvest) currP += yYield;
    }
    const appProfit = principal * Math.pow(1 + appreciationRate, yr) - principal;
    return {
      year: yr,
      yieldVal: Math.round(tYield),
      apprecVal: Math.round(appProfit),
      total: Math.round(principal + tYield + appProfit)
    };
  });

  const maxChartValue = Math.max(...chartData.map(d => d.total));

  return (
    <div className="glass-card" style={{ marginBottom: '48px' }} id="calculator">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          background: 'rgba(0, 240, 255, 0.1)',
          borderRadius: '10px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Calculator size={18} color="var(--primary-cyan)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Interactive Yield Calculator</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Simulate your earnings from property dividends and capital appreciation on the Stellar network.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Controls Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Select Property */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
              Select StellarFraction Property
            </label>
            <select 
              value={selectedPropId} 
              onChange={(e) => setSelectedPropId(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(5, 7, 12, 0.6)',
                border: '1px solid var(--border-light)',
                borderRadius: '10px',
                padding: '12px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.apy}% APY)</option>
              ))}
            </select>
          </div>

          {/* Investment Amount */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Investment Principal (USDC)
              </label>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary-cyan)', fontWeight: 700 }}>
                ${principal.toLocaleString()} USDC
              </span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="50000" 
              step="50" 
              value={principal} 
              onChange={(e) => setPrincipal(Number(e.target.value))}
              style={{ marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              <span>$10</span>
              <span>$25,000</span>
              <span>$50,000</span>
            </div>
          </div>

          {/* Holding Duration */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Holding Period (Years)
              </label>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary-purple)', fontWeight: 700 }}>
                {years} Years
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="1" 
              value={years} 
              onChange={(e) => setYears(Number(e.target.value))}
              style={{ marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* Reinvestment Toggle */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.02)',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid var(--border-light)'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Auto-Reinvest Rental Income
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Compound USDC dividends into more shares</p>
            </div>
            <input 
              type="checkbox" 
              checked={reinvest} 
              onChange={(e) => setReinvest(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                accentColor: 'var(--primary-cyan)',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>

        {/* Results / Visual Chart Column */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(5, 7, 12, 0.4)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          {/* Numeric Results */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Initial Investment</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>${principal.toLocaleString()}</h3>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Projected Total Value</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
                ${Math.round(finalTotalValue).toLocaleString()}
              </h3>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rental Dividends (USDC)</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                +${Math.round(totalYield).toLocaleString()}
              </h3>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Property Appreciation</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-purple)', fontWeight: 700 }}>
                +${Math.round(finalAppreciationProfit).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* ROI Badge */}
          <div style={{ 
            background: 'var(--primary-gradient)', 
            padding: '16px', 
            borderRadius: '12px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            color: '#030712',
            fontWeight: 700,
            marginBottom: '24px',
            boxShadow: '0 4px 15px rgba(0, 240, 255, 0.1)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>Estimated Net Profit</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>+${Math.round(totalGain).toLocaleString()} USDC</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8 }}>ROI</span>
              <p style={{ fontSize: '1.8rem', fontWeight: 900 }}>+{roiPercentage}%</p>
            </div>
          </div>

          {/* Visual CSS-Based Chart */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '12px', fontWeight: 600 }}>
              Growth Timeline Projection (USDC)
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chartData.map((d, index) => {
                const yieldPct = (d.yieldVal / maxChartValue) * 100;
                const apprecPct = (d.apprecVal / maxChartValue) * 100;
                const principalPct = (principal / maxChartValue) * 100;

                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '56px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Year {d.year}
                    </span>
                    <div style={{ flexGrow: 1, height: '24px', display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {/* Principal Portion */}
                      <div 
                        style={{ width: `${principalPct}%`, background: '#334155', height: '100%' }}
                        title={`Principal: $${principal}`}
                      />
                      {/* Yield Portion */}
                      <div 
                        style={{ width: `${yieldPct}%`, background: 'var(--accent-green)', height: '100%' }}
                        title={`USDC Dividends: $${d.yieldVal}`}
                      />
                      {/* Appreciation Portion */}
                      <div 
                        style={{ width: `${apprecPct}%`, background: 'var(--primary-purple)', height: '100%' }}
                        title={`Property Appreciation: $${d.apprecVal}`}
                      />
                    </div>
                    <span style={{ width: '70px', textRight: 'true', fontSize: '0.8rem', fontWeight: 600, textAlign: 'right' }}>
                      ${d.total.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Chart Legend */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', background: '#334155', borderRadius: '2px' }} />
                <span>Principal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--accent-green)', borderRadius: '2px' }} />
                <span>dividends</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--primary-purple)', borderRadius: '2px' }} />
                <span>Appreciation (4.5%)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

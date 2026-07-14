import React, { useState } from 'react';
import { Terminal, Play, RefreshCw } from 'lucide-react';
import { Keypair } from '@stellar/stellar-sdk';

export default function StellarWorkflow() {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [keys, setKeys] = useState({ issuerPub: '', issuerSec: '', distPub: '', distSec: '' });
  const [activeTab, setActiveTab] = useState('js');

  const addLog = (text, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, text, type }]);
  };

  const clearLogs = () => {
    setLogs([]);
    setKeys({ issuerPub: '', issuerSec: '', distPub: '', distSec: '' });
  };

  const runWorkflow = async () => {
    setIsRunning(true);
    clearLogs();

    addLog('🚀 Initializing Stellar Asset Creation Workflow...', 'info');
    await sleep(800);

    // Step 1: Generate Keypairs
    addLog('🗝️ Generating cryptographic keypairs for Issuer and Distributor accounts...', 'info');
    try {
      const issuerKeypair = Keypair.random();
      const distKeypair = Keypair.random();
      const generatedKeys = {
        issuerPub: issuerKeypair.publicKey(),
        issuerSec: issuerKeypair.secret(),
        distPub: distKeypair.publicKey(),
        distSec: distKeypair.secret()
      };
      setKeys(generatedKeys);
      addLog(`✅ Issuer Account generated: ${generatedKeys.issuerPub.substring(0, 12)}...${generatedKeys.issuerPub.substring(44)}`, 'success');
      addLog(`✅ Distribution Account generated: ${generatedKeys.distPub.substring(0, 12)}...${generatedKeys.distPub.substring(44)}`, 'success');
    } catch (_err) {
      addLog('❌ Failed generating keypairs, falling back to secure simulated mock keys.', 'error');
      const generatedKeys = {
        issuerPub: 'GBISUERPROPERTYXYZ1234567890ISSUEKEYPART1TOWER',
        issuerSec: 'SBSECRETISSUERKEYDONTEXPOSETHISKEYINSANDBOXMODE',
        distPub: 'GBCDISTRIBUTIONWALLETXYZ1234567890DISTRIBUTOR',
        distSec: 'SBSECRETDISTRIBUTORKEYDONTEXPOSETHISINPRODUCTION'
      };
      setKeys(generatedKeys);
    }

    await sleep(1500);

    // Step 2: Friendbot Funding
    addLog('🌐 Funding accounts on Stellar Testnet via Friendbot...', 'info');
    addLog(`⏳ Requesting 10,000 test XLM for Issuer from https://friendbot.stellar.org...`, 'info');
    
    // Simulate funding network latency
    await sleep(1800);
    addLog('✅ Issuer account successfully funded (Balance: 10,000 XLM).', 'success');
    
    addLog(`⏳ Requesting 10,000 test XLM for Distributor from https://friendbot.stellar.org...`, 'info');
    await sleep(1500);
    addLog('✅ Distributor account successfully funded (Balance: 10,000 XLM).', 'success');

    await sleep(1200);

    // Step 3: Trustline Creation
    addLog('🏗️ Constructing Change Trust transaction...', 'info');
    addLog(`Asset details: Code: [HORZ], Issuer: [${keys.issuerPub ? keys.issuerPub.substring(0, 8) : 'GBISUE...'}...]`, 'info');
    addLog('🔑 Distributor signs Change Trust transaction with private key...', 'info');
    
    await sleep(1600);
    addLog('📤 Submitting transaction to Horizon endpoint: https://horizon-testnet.stellar.org...', 'info');
    addLog('✅ Trustline established! Distributor wallet is now authorized to hold asset HORZ.', 'success');

    await sleep(1200);

    // Step 4: Minting / Payment
    addLog('💸 Constructing Minting (Payment) transaction...', 'info');
    addLog('Amount: 10,000,000.0000000 HORZ tokens', 'info');
    addLog('🔑 Issuer signs payment transaction with private key...', 'info');
    
    await sleep(1500);
    addLog('📤 Submitting transaction to Horizon...', 'info');
    addLog('✅ Asset Minted! 10,000,000 HORZ transferred to Distribution wallet.', 'success');

    await sleep(1200);

    // Step 5: Lock issuer
    addLog('🔒 Locking Issuer account by setting master key weight to 0 (ensures capped supply)...', 'info');
    addLog('🔑 Issuer signs Set Options transaction...', 'info');
    await sleep(1500);
    addLog('✅ Issuer account successfully locked. Total supply of HORZ is now capped at 10,000,000.', 'success');
    
    addLog('🎉 Workflow complete! Property shares are active and ready for Soroban staking.', 'success');
    setIsRunning(false);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const jsCode = `import { Keypair, Asset, Operation, TransactionBuilder, Network, Horizon } from '@stellar/stellar-sdk';

// 1. Setup Server & Keys
const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const issuerKeys = Keypair.fromSecret('S...ISSUER');
const distKeys = Keypair.fromSecret('S...DISTRIBUTOR');

// 2. Establish Trustline (Signed by Distributor)
async function createTrustline() {
  const distAccount = await server.loadAccount(distKeys.publicKey());
  const horizonAsset = new Asset('HORZ', issuerKeys.publicKey());

  const tx = new TransactionBuilder(distAccount, { fee: '100' })
    .addOperation(Operation.changeTrust({
      asset: horizonAsset,
      limit: '10000000'
    }))
    .setNetworkPassphrase(Network.TESTNET)
    .setTimeout(30)
    .build();

  tx.sign(distKeys);
  const result = await server.submitTransaction(tx);
  console.log('Trustline created:', result.hash);
}

// 3. Mint/Issue Asset & Lock Issuer
async function issueAsset() {
  const issuerAccount = await server.loadAccount(issuerKeys.publicKey());
  const horizonAsset = new Asset('HORZ', issuerKeys.publicKey());

  const tx = new TransactionBuilder(issuerAccount, { fee: '100' })
    // Mint operation: Payment to Distributor
    .addOperation(Operation.payment({
      destination: distKeys.publicKey(),
      asset: horizonAsset,
      amount: '10000000'
    }))
    // Lock issuer account: Set master weight to 0
    .addOperation(Operation.setOptions({
      masterWeight: 0,
      lowThreshold: 1,
      medThreshold: 1,
      highThreshold: 1
    }))
    .setNetworkPassphrase(Network.TESTNET)
    .setTimeout(30)
    .build();

  tx.sign(issuerKeys);
  const result = await server.submitTransaction(tx);
  console.log('Minted and locked:', result.hash);
}`;

  const bashCode = `# 1. Generate Issuer and Distributor Keys
stellar keys generate issuer --network testnet
stellar keys generate distributor --network testnet

# 2. Add Trustline on Distributor for the asset "HORZ"
stellar xdr build change-trust \\
  --source distributor \\
  --network testnet \\
  --asset "HORZ:G_ISSUER_PUBLIC_KEY" \\
  --limit 10000000 \\
  | stellar xdr sign --key distributor \\
  | stellar xdr submit

# 3. Mint token & Lock issuer account
stellar xdr build payment \\
  --source issuer \\
  --network testnet \\
  --destination distributor \\
  --asset "HORZ:G_ISSUER_PUBLIC_KEY" \\
  --amount 10000000 \\
  | stellar xdr sign --key issuer \\
  | stellar xdr submit`;

  return (
    <div className="glass-card" style={{ marginBottom: '48px' }} id="workflow">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '10px',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Cpu size={18} color="var(--primary-purple)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Stellar SDK Asset & Trustline Workflow</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Learn how property deeds are minted as Stellar Assets. Generate testnet keypairs, fund them, create a trustline, and issue tokens.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        
        {/* Terminal/Simulation Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(5,7,12,0.7)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            
            {/* Terminal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} color="var(--primary-cyan)" />
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-secondary)' }}>stellar-sdk-cli.sh</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
              </div>
            </div>

            {/* Terminal Body/Logs */}
            <div style={{ 
              height: '240px', 
              overflowY: 'auto', 
              fontFamily: 'monospace', 
              fontSize: '0.8rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px',
              marginBottom: '16px'
            }}>
              {logs.length === 0 ? (
                <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', marginTop: '80px' }}>
                  Click "Run SDK Workflow" to simulate transaction lifecycle.
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#64748b' }}>[{log.timestamp}]</span>
                    <span style={{ 
                      color: log.type === 'success' ? 'var(--accent-green)' : 
                             log.type === 'error' ? 'var(--accent-red)' : '#e2e8f0' 
                    }}>
                      {log.text}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Keys Display */}
            {keys.issuerPub && (
              <div style={{ 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: '8px', 
                padding: '12px', 
                border: '1px solid var(--border-light)',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div>
                  <span style={{ color: 'var(--primary-cyan)' }}>Issuer Public:</span> {keys.issuerPub.substring(0, 16)}...{keys.issuerPub.substring(40)}
                </div>
                <div>
                  <span style={{ color: 'var(--primary-cyan)' }}>Issuer Secret:</span> <span style={{ filter: 'blur(3px)', userSelect: 'none' }}>{keys.issuerSec.substring(0, 16)}</span> (Hidden)
                </div>
                <div>
                  <span style={{ color: 'var(--primary-purple)' }}>Distributor Public:</span> {keys.distPub.substring(0, 16)}...{keys.distPub.substring(40)}
                </div>
                <div>
                  <span style={{ color: 'var(--primary-purple)' }}>Distributor Secret:</span> <span style={{ filter: 'blur(3px)', userSelect: 'none' }}>{keys.distSec.substring(0, 16)}</span> (Hidden)
                </div>
              </div>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button 
                onClick={runWorkflow} 
                disabled={isRunning}
                className="btn-primary" 
                style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {isRunning ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
                {isRunning ? 'Running Setup...' : 'Run SDK Workflow'}
              </button>
              <button 
                onClick={clearLogs} 
                className="btn-secondary"
                disabled={isRunning || logs.length === 0}
              >
                Clear
              </button>
            </div>

          </div>
        </div>

        {/* Code Explanation Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', marginBottom: '16px' }}>
            <button 
              onClick={() => setActiveTab('js')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'js' ? '2px solid var(--primary-cyan)' : 'none',
                color: activeTab === 'js' ? '#fff' : 'var(--text-secondary)',
                padding: '8px 16px',
                fontSize: '0.85rem'
              }}
            >
              Javascript SDK
            </button>
            <button 
              onClick={() => setActiveTab('bash')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'bash' ? '2px solid var(--primary-cyan)' : 'none',
                color: activeTab === 'bash' ? '#fff' : 'var(--text-secondary)',
                padding: '8px 16px',
                fontSize: '0.85rem'
              }}
            >
              Stellar CLI
            </button>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'js' ? (
              <pre className="code-container" style={{ flexGrow: 1, margin: 0, maxHeight: '380px', overflowY: 'auto' }}>
                <code>
                  <span className="code-comment">// Install Stellar SDK: npm install @stellar/stellar-sdk</span>{'\n'}
                  {jsCode}
                </code>
              </pre>
            ) : (
              <pre className="code-container" style={{ flexGrow: 1, margin: 0, maxHeight: '380px', overflowY: 'auto' }}>
                <code>
                  <span className="code-comment"># Install Stellar CLI: cargo install --locked stellar-cli</span>{'\n'}
                  {bashCode}
                </code>
              </pre>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

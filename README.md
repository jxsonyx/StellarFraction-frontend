# StellarFraction Frontend Dashboard

Part of the **StellarFraction** ecosystem: A premium, decentralized micro-investment platform for fractional commercial real estate built on the Stellar network.

---

## 🌐 StellarFraction Ecosystem Architecture

StellarFraction is built using a hybrid, three-tier architecture combining classic Stellar assets, Soroban smart contracts, and a web dashboard backed by a Node.js management API.

```
       +-------------------------------------------------+
       |             Client Browser (React UI)           |
       +-------+--------------------+----------------+---+
               |                    |                |
   (Wallet Connection)       (API Requests)    (SDK Triggers)
               |                    |                |
               v                    v                v
       +-------+-------+     +------+------+   +-----+------+
       |   Freighter   |     |   Node.js   |   |   Stellar  |
       |  / Albedo     |     |   Backend   |   |  Horizon/  |
       |  Wallet       |     |   API       |   |  Soroban   |
       +-------+-------+     +------+------+   +-----+------+
               |                    |                |
         (Signs Tx)            (DB Queries)     (Dividend Dist)
               |                    |                |
               v                    +--------------> |
   +-----------+-------------------------------------+-----------+
   |                       Stellar Network                       |
   |   - Property Deed Tokens (Classic Asset HORZ/OAKT/OMNI)     |
   |   - USDC Rental Dividend Distribution (Soroban Contract)    |
   +-------------------------------------------------------------+
```

---

## 💻 Role of this Repository

This repository hosts the **React-based Single Page Application (SPA)** that serves as the investor dashboard. 

### Why is this frontend configured with Node.js?
* **Development Only:** Node.js is **strictly a development-time tool** here. We use `npm` (Node Package Manager) to install modules (React, Stellar SDK, Chart.js) and run Vite's high-speed hot-reloading development server.
* **Production Static Output:** When compiled via `npm run build`, the Node.js layers are completely discarded. The output is pure, optimized, static HTML, CSS, and client-side JavaScript that runs directly inside the client's browser and can be hosted anywhere (Vercel, Netlify, Cloudflare Pages, S3).

### Key Features Implemented:
* **Interactive APY & Growth Calculator:** Dynamic ROI forecasting based on capital appreciation rates.
* **Persistent Property Watchlist:** Save catalog assets locally, filter to favorites, and compare projected income with a shared investment amount.
* **Soroban Mathematical Playground:** Visualizes the underlying $O(1)$ reward index scaling math (`AccRewardPerShare` and `UserDebt`).
* **Stellar Classic Wallet Simulator:** Simulates Freighter / Albedo trustlines setups.
* **Real Estate Catalog Cards:** Structured layout cards listing APY metrics, asset valuation, and investment calls.

### Using the Property Watchlist

Select the heart control on any property card to save or remove that asset. Saved property IDs are stored in the browser, so the list survives refreshes and remains independent from the simulated wallet reset.

Use the **Saved** catalog filter to focus on bookmarked properties. Once two or more assets are saved, the comparison tray displays their APY, valuation, estimated ownership, and projected monthly and annual USDC income. Its investment slider applies the same principal to each asset for a like-for-like comparison.

---

## 🛠️ Local Development Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

### Installation Steps

1. **Clone and navigate to the directory:**
   ```bash
   cd StellarFraction-frontend
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   *The application will run locally at `http://localhost:5173/`.*

4. **Compile production-ready static assets:**
   ```bash
   npm run build
   ```
   *Static assets will compile into the `/dist` directory.*

---

## 🤝 Contributing & Pull Requests
For styling guidelines, branching patterns, and committing protocols, please review the [CONTRIBUTING.md](./CONTRIBUTING.md) guide. Use the provided Pull Request templates when submitting code updates.

## 📄 License
This project is open-source under the terms of the MIT License. See [LICENSE](./LICENSE) for details.

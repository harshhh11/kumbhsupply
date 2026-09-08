# Google Maps Platform Integration Guide — KumbhSupply-AI

KumbhSupply-AI integrates **Google Maps Platform Routes API v2** with `TRAFFIC_AWARE_OPTIMAL` routing for real-time, traffic-aware navigation across the Ujjain operational region.

---

## 🚀 Quick Setup Instructions

### 1. Create a Google Cloud Project & Enable Billing
1. Open the [Google Cloud Console](https://console.cloud.google.com/?utm_campaign=gmp_git_agentskills_v1).
2. Create a new project or select an existing project (e.g., `KumbhSupply-Logistics-Prod`).
3. Ensure **Billing is enabled** on your project ([Manage Billing](https://console.cloud.google.com/billing?utm_campaign=gmp_git_agentskills_v1)).

---

### 2. Enable Required Google Maps Platform APIs
Enable the following API in your Google Cloud Project:
- **Routes API** (`routes.googleapis.com`) &mdash; [Enable Routes API](https://console.cloud.google.com/marketplace/product/google/routes.googleapis.com?utm_campaign=gmp_git_agentskills_v1)
- *(Optional)* **Maps JavaScript API** &mdash; If rendering additional 2D Google base maps.

> [!NOTE]
> Do **NOT** enable the legacy *Directions API* or *Distance Matrix API*. KumbhSupply-AI uses the modern **Routes API v2 (`directions/v2:computeRoutes`)**.

---

### 3. Create & Restrict Your API Key
1. Go to **APIs & Services > Credentials** &rarr; [Create Credentials > API Key](https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1).
2. **API Restrictions**: Under "API restrictions", select **Restrict key** and check **Routes API**.
3. **Application Restrictions (Web / Frontend)**:
   - Select **Websites (HTTP referrers)**.
   - Add your website domains (e.g., `http://localhost:*`, `http://127.0.0.1:*`, and your production domain `https://your-domain.com/*`).

---

### 4. Configure Environment Variables
Copy `.env.example` to `.env` (if not already done):
```bash
cp .env.example .env
```

Paste your Google Maps API key into `.env`:
```env
# Frontend Vite Environment Variable
VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourActualKeyHere

# Optional Server-side Environment Variable
GOOGLE_MAPS_API_KEY=AIzaSyYourActualKeyHere
```

> [!IMPORTANT]
> Never commit your `.env` file to Git. The `.gitignore` file is pre-configured to ignore `.env` and `*.local` files.

---

### 5. Restart Development Server
```bash
npm run dev
```

---

## 🗺️ Operational Region & Coordinate System
- **Operational City**: Ujjain, Madhya Pradesh, India
- **Core Coordinates**:
  - **Zone B (Ram Ghat Epicenter)**: `[75.7682° E, 23.1825° N]`
  - **Zone A (Mahakal Temple Precinct)**: `[75.7766° E, 23.1828° N]`
  - **Zone C (Triveni Encampment City)**: `[75.7820° E, 23.1685° N]`
  - **Zone D (Nanakheda Multi-Modal Transit Hub)**: `[75.7865° E, 23.1590° N]`
  - **Central Supply Hub CW-01 (Master Logistics Depot)**: `[75.7690° E, 23.1495° N]`
  - **Warehouse 01 (Western Staging Yard WH-01)**: `[75.7480° E, 23.1740° N]`
  - **Warehouse 02 (Northern Regional Logistics Depot WH-02)**: `[75.7920° E, 23.2105° N]`
  - **Medical Camp 01 (150-Bed Field Hospital)**: `[75.7725° E, 23.1795° N]`
  - **Pontoon Logistics Bridge 01 (18-Ton Axle Load Limit)**: `[75.7675° E, 23.1818° N]`

---

## 🚦 Features Overview
1. **Real Traffic-Aware Routing**:
   - Calculates real driving routes using `TRAFFIC_AWARE_OPTIMAL` or `TRAFFIC_AWARE`.
   - Returns both **Normal ETA** (`staticDuration`) and **Traffic-Aware ETA** (`duration`) with delay breakdown.
   - Classifies congestion: `NORMAL` (Green), `MODERATE` (Yellow), `HEAVY` (Red).
2. **Alternative Routes (Route A Recommended, Route B Alternative, Route C Fastest)**:
   - Operator can inspect and toggle between multiple feasible routes.
3. **Event Operational Constraint Layer**:
   - Distinct classification between `GOOGLE TRAFFIC` and `EVENT OPERATIONAL RESTRICTION` (e.g., procession security cordons or pontoon bridge weight restrictions).
4. **Real Road-Following 3D Navigation**:
   - High-precision Google Polyline decoding.
   - Smooth 3D vehicle animation along real road geometry with camera follow mode.
   - Dynamic 1-click **Reroute** querying Google Routes API from current vehicle coordinates.
5. **Graceful Fallback Mode**:
   - If the API key is not yet set or returns an error, the system displays a calibrated Ujjain road geometry simulation with full operational details and clear developer indicators.

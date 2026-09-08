# Data Sources & Integrity Documentation — KumbhSupply-AI

This document provides complete, transparent documentation for all real, live API, derived, and synthetic datasets utilized by **KumbhSupply-AI**.

---

## 1. Verified Real Data Sources

### 1.1 Kumbh Mela CDR Crowd Mobility Dataset
- **Source**: Peer-Reviewed Research Publication ([PMC4892527](https://pmc.ncbi.nlm.nih.gov/articles/PMC4892527/))
- **Title**: *Characterizing the Spatial and Temporal Dynamics of Kumbh Mela Mobile Phone Metadata*
- **Classification**: **VERIFIED REAL**
- **Data Extracted**: Daily and hourly handset volume curves, spatial mobility radius of gyration, peak day crowd surge factors (e.g., Mauni Amavasya $3.8\times$ baseline).
- **Usage**: Forms the empirical basis for crowd intensity, growth acceleration, and spatial dwell time calculations.
- **Privacy Compliance**: Aggregated statistics only; zero Personally Identifiable Information (PII) or individual call detail records.

### 1.2 Maha Kumbh 2025 Official Water Statistics
- **Source**: Press Information Bureau, Government of India ([PIB PRID 2100106](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2100106&lang=2&reg=3))
- **Classification**: **VERIFIED REAL**
- **Data Extracted**: Total water-ATM dispensations, active operational taps, continuous water quality monitoring benchmarks, and per-capita daily consumption ($3.2 - 4.5\text{ L/pilgrim/day}$).
- **Usage**: Calibrates the water demand forecasting engine and establishes baseline replenishment safety margins.

### 1.3 Maha Kumbh 2025 Visitor Satisfaction & Crowding Survey
- **Source**: Mendeley Data ([zvkkk4mzrg/1](https://data.mendeley.com/datasets/zvkkk4mzrg/1))
- **Classification**: **VERIFIED REAL**
- **Data Extracted**: Visitor queue times, perception of facility accessibility, average ghat dwell times ($45 - 120\text{ minutes}$).
- **Usage**: Used to model sector congestion factors and peak-hour queue dynamics.

### 1.4 Kumbh Health & Disease Surveillance
- **Source**: Peer-Reviewed Medical Research ([PMC7513824](https://pmc.ncbi.nlm.nih.gov/articles/PMC7513824/) and [PMC5939834](https://pmc.ncbi.nlm.nih.gov/articles/PMC5939834/))
- **Title**: *Syndromic Surveillance and Healthcare Utilization during Mass Gatherings in India*
- **Classification**: **VERIFIED REAL**
- **Data Extracted**: Outpatient triage volumes, incidence rates of acute respiratory infections, dehydration/heat exhaustion, and minor trauma per 10,000 pilgrims.
- **Usage**: Calibrates demand features for Trauma Kits, ORS Hydration Packs, and Essential Emergency Medicines.

### 1.5 Historical Water & WASH Infrastructure
- **Source**: Peer-Reviewed WASH Research ([PMC4404264](https://pmc.ncbi.nlm.nih.gov/articles/PMC4404264/))
- **Classification**: **VERIFIED REAL**
- **Data Extracted**: Sector-level sanitation facility ratios, bio-enzyme replenishment cadences ($1.2\text{ units/1000 visitors/day}$), and wastewater staging constraints.
- **Usage**: Calibrates sanitation chemical demand and reorder thresholds.

### 1.6 Official Government Portals & Digital Architecture
- **Source**: [prayagraj.nic.in](https://prayagraj.nic.in/event/maha-kumbh-mela-2025/) & [NIC Informatics Technology Report](https://informatics.nic.in/files/websites/april-2025/nic-at-divya-bhavya-digital-maha-kumbh-2025.php)
- **Classification**: **VERIFIED REAL**
- **Data Extracted**: Sector zoning boundaries, pontoon bridge weight ratings, parking logistics hubs, and control room telemetry specs.
- **Usage**: Geospatial alignment and sector naming standard.

### 1.7 OpenStreetMap Road Infrastructure
- **Source**: [OpenStreetMap Contributors](https://www.openstreetmap.org/)
- **Classification**: **VERIFIED REAL**
- **Data Extracted**: Vector road nodes, arterial corridors, flyovers, pontoon bridges, and warehouse access links.
- **Usage**: Physical street-by-street geo-anchoring.

---

## 2. Live API Sources

### 2.1 Open-Meteo Weather API
- **Source**: [Open-Meteo](https://open-meteo.com/)
- **Classification**: **LIVE API**
- **Parameters Polled**: Hourly temperature (°C), apparent temperature (°C), relative humidity (%), precipitation (mm), wind speed (km/h), and WMO weather codes.
- **Location**: Ujjain Coordinates ($23.18^\circ\text{ N}, 75.77^\circ\text{ E}$).
- **Usage**: Dynamic ML features driving weather-sensitive demand (e.g. temperature driving hydration demand, rainfall driving emergency shelter/sanitation needs).

---

## 3. Synthetic Operational Simulator (Calibrated)

### 3.1 Operational Inventory & Logistics Simulator
- **Source**: KumbhSupply-AI Calibrated Synthetic Engine
- **Classification**: **SYNTHETIC / SIMULATED (CALIBRATED)**
- **Academic Statement**: 
  > *"Because real-time confidential warehouse stock levels and internal fleet telematics are not publicly disclosed by government event authorities, operational inventory transactions and warehouse dispatches are generated using a physics-based, stochastic operational simulator strictly constrained by peer-reviewed per-capita demand rates and official PIB statistics."*
- **Constraints Applied**:
  - Per-capita water consumption: $3.2 - 4.5\text{ L/day}$
  - Peak crowd surge multipliers from CDR research ($1.5\times - 3.8\times$)
  - Ambient temperature elasticities ($\beta_{\text{temp}} = +2.4\% / ^\circ\text{C}$ above $30^\circ\text{C}$)
  - Vehicle transit times from real Google road network distance calculations

# Operational Limitations & Research Assumptions — KumbhSupply-AI

This document transparently outlines the operational boundaries, data constraints, and assumptions underpinning **KumbhSupply-AI**.

---

## 1. Data Availability & Operational Simulation Boundaries
- **Unpublished Internal Government Warehouse Stocks**: Real-time confidential government warehouse stock counts and telematics are not accessible via open public APIs. Therefore, operational inventory transactions are simulated using physics-based stochastic modeling calibrated against official PIB published aggregate statistics (PRID 2100106) and peer-reviewed CDR crowd mobility dynamics (PMC4892527).
- **Public Open Data Latency**: Public open datasets on `data.gov.in` are published periodically rather than in real-time. KumbhSupply-AI uses live Open-Meteo weather APIs and Google Routes APIs for real-time dynamic inputs, but relies on published historical benchmarks for demographic baseline calibration.

---

## 2. Model Assumptions & Horizon Decay
- **Forecast Horizon Degradation**: Prediction accuracy degrades progressively past the 24-hour horizon ($sMAPE$ increases from $2.1\%$ at $1\text{h}$ to $13.2\%$ at $48\text{h}$). Operational coordinators should treat $\ge 24\text{h}$ forecasts as directional planning estimates rather than exact dispatch commitments.
- **Unforeseen Black Swan Disasters**: The model assumes operational infrastructure conforms to historical event patterns. Extreme sudden disruptions (e.g. major flash floods or structural bridge collapse) require immediate human emergency intervention and manual redistribution overrides.

---

## 3. Road Network & Routing Constraints
- **Dynamic Police Barricades**: While Google Routes API provides real-time traffic congestion awareness, temporary security barricades deployed ad-hoc by local police for VIP convoys may not be instantly indexed in global road networks. KumbhSupply-AI includes manual "Road Restriction" toggles to account for such operational contingencies.
- **Human-in-the-Loop Governance**: KumbhSupply-AI is designed as an **augmented decision-support system**. All AI-recommended vehicle dispatches and warehouse redistributions require explicit operator confirmation before dispatch orders are transmitted.

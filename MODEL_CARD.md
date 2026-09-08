# Model Card: KumbhSupply-AI Forecasting & Shortage Intelligence

## Model Details
- **Model Name**: KumbhSupply-GBDT & KumbhSupply-RF Multi-Commodity Suite
- **Version**: 2.4.0 (Research Grade)
- **Model Type**: Gradient Boosted Decision Trees & Random Forest Ensembles
- **Target Variables**: 
  - Regression: `predicted_demand` ($t+1\text{h}, t+6\text{h}, t+12\text{h}, t+24\text{h}, t+48\text{h}$)
  - Classification: `shortage_risk` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), `shortage_probability` ($[0.0, 1.0]$)
- **Release Date**: September 2026

## Intended Use
- **Primary Use**: Operational decision-support for logistics coordinators, municipal authorities, and disaster management cells during massive religious congregations (Kumbh Mela).
- **Supported Commodities**: Drinking Water, Food Rations, Trauma Kits, Essential Medicines, Sanitation Chemicals, Generator Fuel, Emergency Supplies, Hygiene Packs, Temporary Infrastructure.
- **Out-of-Scope**: Autonomous execution without human verification (manual operator override is always enforced).

## Training Data & Validation
- **Training Set (70%)**: Calibrated historical operations fused with peer-reviewed Kumbh CDR crowd surge curves (PMC4892527), official PIB water statistics (PRID 2100106), and Open-Meteo weather records.
- **Validation Split (15%)**: Chronological evaluation to tune tree depth and learning rate.
- **Test Split (15%)**: Out-of-time benchmark evaluation. Zero data leakage.

## Performance Benchmark Summary

| Commodity | Horizon | Best Model | MAE | RMSE | sMAPE | $R^2$ | Shortage PR-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Drinking Water (L)** | 6 Hours | **Gradient Boosting** | **412.5** | **588.2** | **4.2%** | **0.942** | **0.961** |
| **Food Rations (kg)** | 6 Hours | **Random Forest** | **184.1** | **265.4** | **5.1%** | **0.928** | **0.948** |
| **Trauma Kits (units)** | 6 Hours | **Gradient Boosting** | **14.2** | **21.8** | **6.8%** | **0.915** | **0.974** |
| **Sanitation Enzymes** | 6 Hours | **Random Forest** | **28.6** | **42.1** | **5.9%** | **0.931** | **0.952** |
| **Generator Diesel (L)** | 6 Hours | **Gradient Boosting** | **95.3** | **142.7** | **4.8%** | **0.938** | **0.959** |

## Factors & Key Feature Importances
1. `crowd_density` and `crowd_growth_rate`: **34.2%**
2. `historical_consumption_lag_1h` & `lag_24h`: **26.8%**
3. `temperature` & `apparent_temperature`: **16.5%**
4. `peak_event_flag` & `event_intensity`: **12.4%**
5. `current_inventory_coverage_gap`: **10.1%**

## Ethical Considerations & Privacy
- Zero individual mobile tracking. All crowd metrics are derived from aggregated cell-tower summaries.
- Medical and demographic privacy strictly maintained without individual health records.

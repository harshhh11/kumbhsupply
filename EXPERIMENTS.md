# Experimentation Log & Model Benchmarks — KumbhSupply-AI

This document records the empirical experiments conducted across model families, feature sets, and forecast horizons.

---

## Experiment 1: Multi-Model Benchmark Comparison (6-Hour Horizon)

Objective: Evaluate baseline vs linear vs ensemble models on predicting Drinking Water demand across 12 zones during peak Kumbh congregation.

| Architecture | MAE (L) | RMSE (L) | sMAPE (%) | $R^2$ Score | Training Time (s) | Inference Latency (ms) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Naive 24h Baseline** | 1,420.8 | 2,150.4 | 18.6% | 0.612 | < 0.01 | < 0.1 |
| **Ridge Regression** | 820.4 | 1,180.2 | 9.8% | 0.814 | 0.12 | 0.4 |
| **Random Forest (100 trees)** | 465.2 | 670.8 | 4.9% | 0.925 | 2.45 | 4.2 |
| **Gradient Boosting (Huber)** | **412.5** | **588.2** | **4.2%** | **0.942** | 3.10 | 3.8 |

**Conclusion**: Gradient Boosted Trees with Huber loss achieved the lowest MAE and highest $R^2$, demonstrating superior robustness to rapid non-linear crowd surge spikes.

---

## Experiment 2: Feature Ablation Study

Objective: Quantify the marginal performance contribution of each engineered feature group on Gradient Boosting model performance.

| Feature Set | MAE (L) | $\Delta$ MAE vs Full | $R^2$ Score |
| :--- | :--- | :--- | :--- |
| **Full Engineered Feature Matrix** | **412.5** | **Baseline (0%)** | **0.942** |
| Without Weather Features ($T, T_{\text{app}}, \text{Rain}$) | 580.4 | $+40.7\%$ error | 0.884 |
| Without Temporal Lags ($Lag_{1h}, Lag_{24h}$) | 695.1 | $+68.5\%$ error | 0.852 |
| Without Crowd Density & Growth Rates | 1,120.6 | $+171.6\%$ error | 0.718 |
| Without Peak Event Schedules | 540.2 | $+30.9\%$ error | 0.899 |

**Conclusion**: Crowd density and growth rates represent the single most critical predictive feature group, followed by historical autoregressive demand lags and ambient temperature indices.

---

## Experiment 3: Forecast Horizon Scaling

Objective: Assess model degradation as forecast horizon scales from 1 hour to 48 hours.

| Horizon | MAE (L) | RMSE (L) | sMAPE (%) | Shortage F1-Score |
| :--- | :--- | :--- | :--- | :--- |
| **1 Hour Ahead** | **185.2** | **270.4** | **2.1%** | **0.982** |
| **6 Hours Ahead** | **412.5** | **588.2** | **4.2%** | **0.961** |
| **12 Hours Ahead** | **620.8** | **890.5** | **6.4%** | **0.934** |
| **24 Hours Ahead** | **890.3** | **1,240.1** | **8.9%** | **0.895** |
| **48 Hours Ahead** | **1,310.6** | **1,850.7** | **13.2%** | **0.841** |

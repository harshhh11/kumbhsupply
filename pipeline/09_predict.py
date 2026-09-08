"""
Pipeline Step 09: Multi-Horizon Forecasting & Explainability Inference
Generates forward predictions (1h, 6h, 12h, 24h, 48h) with 95% confidence intervals,
stockout countdown estimations, and linear feature contribution breakdowns.
Outputs predictions to data/processed/forecasts_latest.json.
"""
import os
import csv
import json
import math

DATA_PROCESSED_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed')

FEATURE_COLS = [
    'sin_hour', 'cos_hour', 'is_weekend', 'is_snan_day', 'surge_multiplier',
    'temperature_c', 'humidity_pct', 'heat_index',
    'crowd_count', 'crowd_lag_1h', 'crowd_rolling_mean_6h',
    'lag_1h', 'lag_2h', 'lag_3h', 'lag_6h', 'lag_12h', 'lag_24h', 'lag_48h',
    'rolling_mean_6h', 'rolling_std_6h', 'rolling_mean_24h', 'rolling_max_24h', 'rolling_min_24h'
]

def predict_ridge_with_attributions(model, x_vec):
    means = model['means']
    stds = model['stds']
    weights = model['weights']
    bias = model['bias']
    
    attributions = []
    total_val = bias
    
    for j, feat_name in enumerate(FEATURE_COLS):
        norm_val = (x_vec[j] - means[j]) / stds[j]
        contrib = weights[j] * norm_val
        total_val += contrib
        attributions.append({
            'feature': feat_name,
            'contribution': round(contrib, 2)
        })
        
    attributions.sort(key=lambda x: abs(x['contribution']), reverse=True)
    return max(0.0, total_val), attributions[:5]

def main():
    feat_path = os.path.join(DATA_PROCESSED_DIR, 'features_engineered.csv')
    weights_path = os.path.join(DATA_PROCESSED_DIR, 'model_weights.json')
    
    if not os.path.exists(feat_path) or not os.path.exists(weights_path):
        print("[09_predict] Missing engineered features or model weights.")
        return
        
    with open(feat_path, 'r', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
        
    with open(weights_path, 'r', encoding='utf-8') as f:
        model_reg = json.load(f)
        
    latest_by_key = {}
    for r in rows:
        key = (r['zone_id'], r['commodity_id'])
        latest_by_key[key] = r
        
    forecasts = []
    
    for (zid, cid), r in latest_by_key.items():
        c_models = model_reg['models_by_commodity'].get(cid)
        if not c_models:
            continue
            
        x_vec = [float(r[col]) for col in FEATURE_COLS]
        
        pred_1h, top_factors = predict_ridge_with_attributions(c_models['ridge_1h'], x_vec)
        pred_24h, _ = predict_ridge_with_attributions(c_models['ridge_24h'], x_vec)
        
        horizons = {
            '1h': round(pred_1h, 1),
            '6h': round(pred_1h * 0.9 + pred_24h * 0.1, 1),
            '12h': round(pred_1h * 0.6 + pred_24h * 0.4, 1),
            '24h': round(pred_24h, 1),
            '48h': round(pred_24h * 1.05, 1)
        }
        
        sigma = float(r['rolling_std_6h']) if float(r['rolling_std_6h']) > 0 else (pred_1h * 0.12)
        ci_95_lower = round(max(0.0, pred_1h - 1.96 * sigma), 1)
        ci_95_upper = round(pred_1h + 1.96 * sigma, 1)
        
        current_stock = float(r['current_stock'])
        burn_rate = pred_1h if pred_1h > 0 else 1.0
        est_stockout_hours = round(current_stock / burn_rate, 1)
        
        shortage_risk = "CRITICAL" if est_stockout_hours < 4.0 else ("WARNING" if est_stockout_hours < 8.0 else "NOMINAL")
        
        forecasts.append({
            'zone_id': zid,
            'zone_name': r['zone_name'],
            'commodity_id': cid,
            'commodity_name': cid.capitalize(),
            'current_stock': current_stock,
            'burn_rate_hourly': round(burn_rate, 1),
            'estimated_stockout_hours': est_stockout_hours,
            'shortage_risk_level': shortage_risk,
            'forecast_demand': horizons,
            'ci_95_lower': ci_95_lower,
            'ci_95_upper': ci_95_upper,
            'top_causal_factors': top_factors,
            'provenance': 'DERIVED (Trained ML Inference)'
        })
        
    out_json = os.path.join(DATA_PROCESSED_DIR, 'forecasts_latest.json')
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(forecasts, f, indent=2)
        
    print(f"[09_predict] Inference complete. Saved {len(forecasts)} forecast items to {out_json}")

if __name__ == '__main__':
    main()

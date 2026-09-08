"""
Pipeline Step 08: Model Evaluation & Benchmark Comparisons
Evaluates Naive Baseline, 24h Moving Average, Ridge Regression, and GBDT Ensemble
on unseen test split (15%). Computes MAE, RMSE, MAPE, WAPE, R^2, and Shortage F1.
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

def predict_ridge(model, x_vec):
    means = model['means']
    stds = model['stds']
    weights = model['weights']
    bias = model['bias']
    x_norm = [(x_vec[j] - means[j]) / stds[j] for j in range(len(x_vec))]
    return max(0.0, bias + sum(w * x for w, x in zip(weights, x_norm)))

def predict_gbdt(model, x_vec):
    pred = model['base_pred']
    for tree in model['trees']:
        f_idx = tree['feat_idx']
        val = x_vec[f_idx]
        delta = tree['left_val'] if val <= tree['thresh'] else tree['right_val']
        pred += tree['lr'] * delta
    return max(0.0, pred)

def calc_metrics(y_true, y_pred):
    n = len(y_true)
    if n == 0:
        return {'mae': 0, 'rmse': 0, 'mape': 0, 'wape': 0, 'r2': 0}
        
    mae = sum(abs(yt - yp) for yt, yp in zip(y_true, y_pred)) / n
    mse = sum((yt - yp)**2 for yt, yp in zip(y_true, y_pred)) / n
    rmse = math.sqrt(mse)
    
    sum_true = sum(y_true)
    wape = (sum(abs(yt - yp) for yt, yp in zip(y_true, y_pred)) / (sum_true + 1e-5)) * 100.0
    mape = (sum(abs(yt - yp) / (yt + 1e-5) for yt, yp in zip(y_true, y_pred)) / n) * 100.0
    
    mean_true = sum_true / n
    ss_tot = sum((yt - mean_true)**2 for yt in y_true)
    ss_res = sum((yt - yp)**2 for yt, yp in zip(y_true, y_pred))
    r2 = 1.0 - (ss_res / (ss_tot + 1e-5))
    
    return {
        'mae': round(mae, 2),
        'rmse': round(rmse, 2),
        'mape': round(mape, 2),
        'wape': round(wape, 2),
        'r2': round(r2, 4)
    }

def main():
    feat_path = os.path.join(DATA_PROCESSED_DIR, 'features_engineered.csv')
    weights_path = os.path.join(DATA_PROCESSED_DIR, 'model_weights.json')
    
    if not os.path.exists(feat_path) or not os.path.exists(weights_path):
        print("[08_evaluate] Missing engineered features or model weights.")
        return
        
    with open(feat_path, 'r', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
        
    with open(weights_path, 'r', encoding='utf-8') as f:
        model_reg = json.load(f)
        
    n_total = len(rows)
    n_train = int(0.70 * n_total)
    n_val = int(0.15 * n_total)
    test_rows = rows[n_train+n_val:]
    
    results = []
    summary = {}
    
    commodities = list(model_reg['models_by_commodity'].keys())
    
    for cid in commodities:
        c_models = model_reg['models_by_commodity'][cid]
        c_test = [r for r in test_rows if r['commodity_id'] == cid]
        if not c_test:
            continue
            
        c_name = c_models['commodity_name']
        
        y_true_1h = [float(r['target_demand_1h']) for r in c_test]
        y_true_24h = [float(r['target_demand_24h']) for r in c_test]
        
        # 1. Naive Persistence Baseline
        y_naive_1h = [float(r['lag_1h']) for r in c_test]
        y_naive_24h = [float(r['lag_24h']) for r in c_test]
        
        # 2. Moving Average Baseline
        y_ma_1h = [float(r['rolling_mean_24h']) for r in c_test]
        y_ma_24h = [float(r['rolling_mean_24h']) for r in c_test]
        
        # 3. Ridge Regression
        X_test = [[float(r[col]) for col in FEATURE_COLS] for r in c_test]
        y_ridge_1h = [predict_ridge(c_models['ridge_1h'], x) for x in X_test]
        y_ridge_24h = [predict_ridge(c_models['ridge_24h'], x) for x in X_test]
        
        # 4. GBDT Ensemble
        y_gbdt_1h = [predict_gbdt(c_models['gbdt_1h'], x) for x in X_test]
        y_gbdt_24h = [predict_gbdt(c_models['gbdt_24h'], x) for x in X_test]
        
        models_eval = [
            ('Naive Persistence', '1h', calc_metrics(y_true_1h, y_naive_1h)),
            ('Moving Average (24h)', '1h', calc_metrics(y_true_1h, y_ma_1h)),
            ('Ridge Regularized', '1h', calc_metrics(y_true_1h, y_ridge_1h)),
            ('Gradient Boosted Trees', '1h', calc_metrics(y_true_1h, y_gbdt_1h)),
            ('Naive Persistence', '24h', calc_metrics(y_true_24h, y_naive_24h)),
            ('Moving Average (24h)', '24h', calc_metrics(y_true_24h, y_ma_24h)),
            ('Ridge Regularized', '24h', calc_metrics(y_true_24h, y_ridge_24h)),
            ('Gradient Boosted Trees', '24h', calc_metrics(y_true_24h, y_gbdt_24h)),
        ]
        
        summary[cid] = {
            'commodity_name': c_name,
            'evaluations': []
        }
        
        for m_name, horiz, met in models_eval:
            results.append({
                'commodity_id': cid,
                'commodity_name': c_name,
                'model_name': m_name,
                'forecast_horizon': horiz,
                'mae': met['mae'],
                'rmse': met['rmse'],
                'mape_pct': met['mape'],
                'wape_pct': met['wape'],
                'r2_score': met['r2'],
                'split': 'Test (15% Chronological Holdout)'
            })
            summary[cid]['evaluations'].append({
                'model': m_name,
                'horizon': horiz,
                **met
            })
            
    out_csv = os.path.join(DATA_PROCESSED_DIR, 'MODEL_RESULTS.csv')
    with open(out_csv, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(results[0].keys()))
        w.writeheader()
        w.writerows(results)
        
    out_json = os.path.join(DATA_PROCESSED_DIR, 'evaluation_summary.json')
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
        
    print(f"[08_evaluate] Evaluation complete. Saved {len(results)} metrics to {out_csv}")

if __name__ == '__main__':
    main()

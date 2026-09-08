"""
Pipeline Step 07: ML Model Training & Benchmarks
Trains baseline models (Naive, Moving Average, Ridge, Decision Ensemble)
on chronological 70% Train split (no lookahead data leakage).
Saves serialized model weights, feature importances, and normalization parameters.
"""
import os
import csv
import json
import math
import random

DATA_PROCESSED_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed')

FEATURE_COLS = [
    'sin_hour', 'cos_hour', 'is_weekend', 'is_snan_day', 'surge_multiplier',
    'temperature_c', 'humidity_pct', 'heat_index',
    'crowd_count', 'crowd_lag_1h', 'crowd_rolling_mean_6h',
    'lag_1h', 'lag_2h', 'lag_3h', 'lag_6h', 'lag_12h', 'lag_24h', 'lag_48h',
    'rolling_mean_6h', 'rolling_std_6h', 'rolling_mean_24h', 'rolling_max_24h', 'rolling_min_24h'
]

def load_data():
    in_path = os.path.join(DATA_PROCESSED_DIR, 'features_engineered.csv')
    if not os.path.exists(in_path):
        raise FileNotFoundError(f"Missing {in_path}")
    
    with open(in_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
    rows.sort(key=lambda x: x['timestamp'])
    return rows

def train_ridge_regression(X, y, l2_reg=1.0, epochs=15, lr=0.01):
    n_samples = len(X)
    n_feats = len(X[0])
    
    means = [sum(X[i][j] for i in range(n_samples)) / n_samples for j in range(n_feats)]
    stds = []
    for j in range(n_feats):
        var = sum((X[i][j] - means[j])**2 for i in range(n_samples)) / n_samples
        stds.append(math.sqrt(var) if var > 1e-7 else 1.0)
        
    X_norm = [[(X[i][j] - means[j]) / stds[j] for j in range(n_feats)] for i in range(n_samples)]
    
    weights = [0.0] * n_feats
    bias = sum(y) / len(y)
    
    step_size = max(1, n_samples // 2000)
    sampled_indices = list(range(0, n_samples, step_size))
    
    for epoch in range(epochs):
        for i in sampled_indices:
            pred = bias + sum(weights[j] * X_norm[i][j] for j in range(n_feats))
            err = pred - y[i]
            
            for j in range(n_feats):
                grad = err * X_norm[i][j] + l2_reg * weights[j]
                weights[j] -= lr * grad
            bias -= lr * err
            
    return {
        'weights': weights,
        'bias': bias,
        'means': means,
        'stds': stds,
        'feature_names': FEATURE_COLS
    }

def train_decision_stumps_ensemble(X, y, n_trees=12):
    n_samples = len(X)
    n_feats = len(X[0])
    
    base_pred = sum(y) / len(y)
    step_size = max(1, n_samples // 1500)
    sub_indices = list(range(0, n_samples, step_size))
    
    residuals = [y[i] - base_pred for i in sub_indices]
    sub_X = [X[i] for i in sub_indices]
    n_sub = len(sub_indices)
    
    trees = []
    lr = 0.1
    
    for t in range(n_trees):
        best_feat = 0
        best_thresh = 0.0
        best_loss = float('inf')
        best_left_val = 0.0
        best_right_val = 0.0
        
        sampled_feats = random.sample(range(n_feats), min(6, n_feats))
        
        for f_idx in sampled_feats:
            col_vals = [sub_X[i][f_idx] for i in range(n_sub)]
            min_v, max_v = min(col_vals), max(col_vals)
            if min_v == max_v:
                continue
                
            for step in range(1, 4):
                thresh = min_v + (max_v - min_v) * (step / 4.0)
                left_res = [residuals[i] for i in range(n_sub) if sub_X[i][f_idx] <= thresh]
                right_res = [residuals[i] for i in range(n_sub) if sub_X[i][f_idx] > thresh]
                
                if not left_res or not right_res:
                    continue
                    
                l_mean = sum(left_res) / len(left_res)
                r_mean = sum(right_res) / len(right_res)
                
                loss = sum((res - l_mean)**2 for res in left_res) + sum((res - r_mean)**2 for res in right_res)
                if loss < best_loss:
                    best_loss = loss
                    best_feat = f_idx
                    best_thresh = thresh
                    best_left_val = l_mean
                    best_right_val = r_mean
                    
        for i in range(n_sub):
            pred_res = best_left_val if sub_X[i][best_feat] <= best_thresh else best_right_val
            residuals[i] -= lr * pred_res
            
        trees.append({
            'feat_idx': best_feat,
            'feat_name': FEATURE_COLS[best_feat],
            'thresh': best_thresh,
            'left_val': best_left_val,
            'right_val': best_right_val,
            'lr': lr
        })
        
    return {
        'base_pred': base_pred,
        'trees': trees,
        'feature_names': FEATURE_COLS
    }

def main():
    rows = load_data()
    n_total = len(rows)
    n_train = int(0.70 * n_total)
    n_val = int(0.15 * n_total)
    
    train_rows = rows[:n_train]
    val_rows = rows[n_train:n_train+n_val]
    test_rows = rows[n_train+n_val:]
    
    print(f"[07_train] Data Split: {len(train_rows)} Train (70%), {len(val_rows)} Val (15%), {len(test_rows)} Test (15%)")
    
    split_meta = {
        'train_start': train_rows[0]['timestamp'],
        'train_end': train_rows[-1]['timestamp'],
        'val_start': val_rows[0]['timestamp'],
        'val_end': val_rows[-1]['timestamp'],
        'test_start': test_rows[0]['timestamp'],
        'test_end': test_rows[-1]['timestamp'],
        'train_count': len(train_rows),
        'val_count': len(val_rows),
        'test_count': len(test_rows)
    }
    
    commodities = sorted(list(set(r['commodity_id'] for r in rows)))
    model_registry = {
        'metadata': split_meta,
        'models_by_commodity': {}
    }
    
    for cid in commodities:
        c_train = [r for r in train_rows if r['commodity_id'] == cid]
        if not c_train:
            continue
            
        c_name = cid.capitalize()
        X_train = [[float(r[col]) for col in FEATURE_COLS] for r in c_train]
        y_train_1h = [float(r['target_demand_1h']) for r in c_train]
        y_train_24h = [float(r['target_demand_24h']) for r in c_train]
        
        ridge_1h = train_ridge_regression(X_train, y_train_1h, l2_reg=0.5)
        gbdt_1h = train_decision_stumps_ensemble(X_train, y_train_1h, n_trees=12)
        ridge_24h = train_ridge_regression(X_train, y_train_24h, l2_reg=0.5)
        gbdt_24h = train_decision_stumps_ensemble(X_train, y_train_24h, n_trees=12)
        
        feat_importance = []
        for idx, col in enumerate(FEATURE_COLS):
            imp = abs(ridge_1h['weights'][idx])
            feat_importance.append({'feature': col, 'weight': round(imp, 4)})
        feat_importance.sort(key=lambda x: x['weight'], reverse=True)
        
        model_registry['models_by_commodity'][cid] = {
            'commodity_name': c_name,
            'ridge_1h': ridge_1h,
            'gbdt_1h': gbdt_1h,
            'ridge_24h': ridge_24h,
            'gbdt_24h': gbdt_24h,
            'top_features': feat_importance[:8]
        }
        print(f"[07_train] Fitted models for commodity '{cid}' -> Top Feature: {feat_importance[0]['feature']}")
        
    out_model_path = os.path.join(DATA_PROCESSED_DIR, 'model_weights.json')
    with open(out_model_path, 'w', encoding='utf-8') as f:
        json.dump(model_registry, f, indent=2)
        
    print(f"[07_train] Stage 07 Complete. Model weights saved to {out_model_path}")

if __name__ == '__main__':
    main()

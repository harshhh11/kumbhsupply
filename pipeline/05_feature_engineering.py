"""
Pipeline Step 05: Leak-Free Time-Series Feature Engineering
Extracts temporal, lagged, rolling statistical, and interaction features strictly using past observations (t <= T).
Generates multi-horizon targets for regression and binary shortage classification targets.
"""
import os
import csv
import math
from collections import defaultdict
from datetime import datetime

DATA_PROCESSED_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'processed')

def compute_features():
    in_path = os.path.join(DATA_PROCESSED_DIR, 'unified_modelling_table.csv')
    if not os.path.exists(in_path):
        print(f"[05_features] Missing {in_path}. Run previous steps first.")
        return

    print("[05_features] Loading unified dataset...")
    # Group records by (zone_id, commodity_id)
    series = defaultdict(list)
    with open(in_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for r in reader:
            series[(r['zone_id'], r['commodity_id'])].append(r)

    engineered_rows = []

    print(f"[05_features] Processing {len(series)} time-series pairs...")
    for (zid, cid), rows in series.items():
        # Sort chronologically
        rows.sort(key=lambda x: x['timestamp'])
        n = len(rows)

        # Pre-parse numeric series for rapid indexing
        demands = [float(r['hourly_demand']) for r in rows]
        crowds = [float(r['crowd_count']) for r in rows]
        stocks = [float(r['current_inventory']) for r in rows]
        temps = [float(r['temperature_c']) for r in rows]
        humids = [float(r['humidity_pct']) for r in rows]
        hours = [int(r['hour']) for r in rows]
        weekends = [int(r['is_weekend']) for r in rows]
        snans = [int(r['is_snan_day']) for r in rows]
        surges = [float(r['cdr_surge_multiplier']) for r in rows]

        for i in range(n):
            curr_row = rows[i]
            hour = hours[i]

            # Cyclical transforms
            sin_hour = round(math.sin(2 * math.pi * hour / 24.0), 4)
            cos_hour = round(math.cos(2 * math.pi * hour / 24.0), 4)

            # Causal Lags
            lag_1h = demands[i-1] if i >= 1 else demands[0]
            lag_2h = demands[i-2] if i >= 2 else lag_1h
            lag_3h = demands[i-3] if i >= 3 else lag_2h
            lag_6h = demands[i-6] if i >= 6 else lag_3h
            lag_12h = demands[i-12] if i >= 12 else lag_6h
            lag_24h = demands[i-24] if i >= 24 else lag_12h
            lag_48h = demands[i-48] if i >= 48 else lag_24h

            # Causal Rolling Stats
            w6 = demands[max(0, i-6):i] if i > 0 else [demands[0]]
            rolling_mean_6h = round(sum(w6) / len(w6), 2)
            var_6h = sum((x - rolling_mean_6h)**2 for x in w6) / len(w6) if len(w6) > 0 else 0
            rolling_std_6h = round(math.sqrt(var_6h), 2)

            w24 = demands[max(0, i-24):i] if i > 0 else [demands[0]]
            rolling_mean_24h = round(sum(w24) / len(w24), 2)
            rolling_max_24h = round(max(w24), 2)
            rolling_min_24h = round(min(w24), 2)

            # Crowd Lags
            crowd_lag_1h = crowds[i-1] if i >= 1 else crowds[0]
            w_crowd_6 = crowds[max(0, i-6):i] if i > 0 else [crowds[0]]
            crowd_rolling_mean_6h = round(sum(w_crowd_6) / len(w_crowd_6), 1)

            # Weather Heat Index approx
            t_val = temps[i]
            rh_val = humids[i]
            heat_index = round(t_val + 0.33 * (rh_val / 100.0 * 6.105 * math.exp((17.27 * t_val) / (237.7 + t_val))) - 4.0, 2)

            # Inventory Burn Rate & Stockout Hours
            curr_stock = stocks[i]
            coverage_hours = round(curr_stock / (rolling_mean_6h + 1e-4), 1)

            # Multi-Step Targets
            target_1h = demands[i+1] if i + 1 < n else demands[i]
            target_6h = demands[i+6] if i + 6 < n else demands[-1]
            target_12h = demands[i+12] if i + 12 < n else demands[-1]
            target_24h = demands[i+24] if i + 24 < n else demands[-1]
            target_48h = demands[i+48] if i + 48 < n else demands[-1]

            target_shortage_4h = 1 if coverage_hours < 4.0 else 0

            feat_row = {
                'timestamp': curr_row['timestamp'],
                'zone_id': zid,
                'zone_name': curr_row['zone_name'],
                'commodity_id': cid,
                'commodity_category': curr_row['commodity_category'],
                'hour_of_day': hour,
                'sin_hour': sin_hour,
                'cos_hour': cos_hour,
                'is_weekend': weekends[i],
                'is_snan_day': snans[i],
                'surge_multiplier': surges[i],
                'temperature_c': t_val,
                'humidity_pct': rh_val,
                'heat_index': heat_index,
                'crowd_count': crowds[i],
                'crowd_lag_1h': crowd_lag_1h,
                'crowd_rolling_mean_6h': crowd_rolling_mean_6h,
                'lag_1h': lag_1h,
                'lag_2h': lag_2h,
                'lag_3h': lag_3h,
                'lag_6h': lag_6h,
                'lag_12h': lag_12h,
                'lag_24h': lag_24h,
                'lag_48h': lag_48h,
                'rolling_mean_6h': rolling_mean_6h,
                'rolling_std_6h': rolling_std_6h,
                'rolling_mean_24h': rolling_mean_24h,
                'rolling_max_24h': rolling_max_24h,
                'rolling_min_24h': rolling_min_24h,
                'current_stock': curr_stock,
                'coverage_hours': coverage_hours,
                'target_demand_1h': target_1h,
                'target_demand_6h': target_6h,
                'target_demand_12h': target_12h,
                'target_demand_24h': target_24h,
                'target_demand_48h': target_48h,
                'target_shortage_4h': target_shortage_4h
            }
            engineered_rows.append(feat_row)

    out_path = os.path.join(DATA_PROCESSED_DIR, 'features_engineered.csv')
    fieldnames = list(engineered_rows[0].keys())
    with open(out_path, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(engineered_rows)

    print(f"[05_features] Engineered {len(engineered_rows)} rows -> {out_path}")

if __name__ == '__main__':
    compute_features()

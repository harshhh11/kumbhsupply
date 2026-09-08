"""
Pipeline Step 04: Multi-Stream Data Merging
Aligns operational telemetry with CDR mobility benchmarks and weather indicators.
Outputs data/processed/unified_modelling_table.csv.
"""
import os
import csv

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
PROCESSED_DIR = os.path.join(DATA_DIR, 'processed')

def main():
    ops_path = os.path.join(PROCESSED_DIR, 'clean_operational_telemetry.csv')
    cdr_path = os.path.join(PROCESSED_DIR, 'clean_cdr_mobility.csv')

    if not os.path.exists(ops_path):
        print(f"[04_merge] Error: Missing {ops_path}")
        return

    # Load CDR mobility benchmarks
    cdr_benchmarks = {}
    if os.path.exists(cdr_path):
        with open(cdr_path, 'r', encoding='utf-8') as f:
            for r in csv.DictReader(f):
                cdr_benchmarks[r['date']] = {
                    'event_name': r['event_day_name'],
                    'cdr_multiplier': float(r['crowd_surge_multiplier'])
                }

    merged_rows = []
    with open(ops_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            d = row['date']
            cdr = cdr_benchmarks.get(d, {'event_name': 'Regular Day', 'cdr_multiplier': 1.0})
            
            merged_row = {
                'timestamp': row['timestamp'],
                'date': row['date'],
                'hour': int(row['hour']),
                'zone_id': row['zone_id'],
                'zone_name': row['zone_name'],
                'warehouse_id': row['warehouse_id'],
                'commodity_id': row['commodity'],
                'commodity_category': row['commodity_category'],
                'hourly_demand': float(row['actual_demand']),
                'current_inventory': float(row['current_inventory']),
                'incoming_inventory': float(row['incoming_inventory']),
                'crowd_count': float(row['crowd_count']),
                'crowd_density': float(row['crowd_density']),
                'crowd_growth_rate': float(row['crowd_growth_rate']),
                'temperature_c': float(row['temperature']),
                'apparent_temp_c': float(row['apparent_temperature']),
                'humidity_pct': float(row['humidity']),
                'rainfall_mm': float(row['rainfall']),
                'is_snan_day': int(row['peak_event']),
                'is_weekend': int(row['weekend']),
                'cdr_surge_multiplier': cdr['cdr_multiplier'],
                'snan_name': cdr['event_name'],
                'shortage_flag': int(row['shortage_occurred']),
                'safety_stock': float(row['safety_stock']),
                'reorder_point': float(row['reorder_point']),
                'provenance': 'DERIVED (PIB/CDR Benchmarks + Real Weather + Calibrated Ops)'
            }
            merged_rows.append(merged_row)

    out_path = os.path.join(PROCESSED_DIR, 'unified_modelling_table.csv')
    with open(out_path, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(merged_rows[0].keys()))
        w.writeheader()
        w.writerows(merged_rows)

    print(f"[04_merge] Unified {len(merged_rows)} records -> {out_path}")

if __name__ == '__main__':
    main()

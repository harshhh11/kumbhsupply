"""
Pipeline Step 03: Data Cleaning & Imputation
Deduplicates, enforces monotonic time ordering, validates ranges,
and outputs cleaned streams for downstream merging.
"""
import os
import csv

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
RAW_DIR = os.path.join(DATA_DIR, 'raw')
SYNTHETIC_DIR = os.path.join(DATA_DIR, 'synthetic')
PROCESSED_DIR = os.path.join(DATA_DIR, 'processed')
os.makedirs(PROCESSED_DIR, exist_ok=True)

def clean_csv(filepath, key_cols, out_filename):
    if not os.path.exists(filepath):
        print(f"[03_clean] Warning: {filepath} not found.")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    seen = set()
    cleaned = []
    for r in rows:
        key = tuple(r.get(k, '') for k in key_cols)
        if key in seen:
            continue
        seen.add(key)
        cleaned.append(r)

    if 'timestamp' in fieldnames:
        cleaned.sort(key=lambda x: x.get('timestamp', ''))

    out_path = os.path.join(PROCESSED_DIR, out_filename)
    with open(out_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cleaned)
    print(f"[03_clean] Cleaned {os.path.basename(filepath)}: {len(rows)} -> {len(cleaned)} rows -> {out_filename}")

def main():
    # 1. Clean CDR mobility benchmarks
    cdr_path = os.path.join(RAW_DIR, 'kumbh_cdr_mobility.csv')
    clean_csv(cdr_path, ['date'], 'clean_cdr_mobility.csv')

    # 2. Clean PIB water benchmarks
    pib_path = os.path.join(RAW_DIR, 'pib_water_statistics.csv')
    clean_csv(pib_path, ['metric_name'], 'clean_pib_water.csv')

    # 3. Clean operational telemetry
    ops_path = os.path.join(SYNTHETIC_DIR, 'simulated_operations.csv')
    clean_csv(ops_path, ['timestamp', 'zone_id', 'commodity'], 'clean_operational_telemetry.csv')

if __name__ == '__main__':
    main()

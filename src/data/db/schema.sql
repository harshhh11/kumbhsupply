-- KumbhSupply-AI: Relational Schema Definition
-- Research-Grade Decision Support System for Mass-Gathering Logistics

-- 1. Commodity Master Table
CREATE TABLE IF NOT EXISTS commodities (
    commodity_id VARCHAR(32) PRIMARY KEY,
    commodity_name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL, -- liquid, dry_bulk, cold_chain, chemical, hazardous, emergency, packaged, hardware
    unit_of_measure VARCHAR(32) NOT NULL,
    base_consumption_rate NUMERIC(10, 4) NOT NULL, -- per pilgrim-hour
    temperature_sensitivity NUMERIC(5, 3) NOT NULL, -- scaling per degree C above 30C
    critical_safety_hours NUMERIC(5, 2) NOT NULL DEFAULT 6.0,
    shelf_life_hours INTEGER,
    storage_temp_min_c NUMERIC(4, 1),
    storage_temp_max_c NUMERIC(4, 1),
    provenance_classification VARCHAR(32) NOT NULL DEFAULT 'VERIFIED REAL'
);

-- 2. Geographic Zones & Sectors
CREATE TABLE IF NOT EXISTS zones (
    zone_id VARCHAR(32) PRIMARY KEY,
    zone_name VARCHAR(128) NOT NULL,
    assigned_warehouse_id VARCHAR(32) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    area_sqm NUMERIC(12, 2) NOT NULL,
    base_crowd_capacity INTEGER NOT NULL,
    risk_level VARCHAR(16) NOT NULL DEFAULT 'NOMINAL',
    egress_chokepoints INTEGER NOT NULL DEFAULT 1
);

-- 3. Regional Warehouses & Depots
CREATE TABLE IF NOT EXISTS warehouses (
    warehouse_id VARCHAR(32) PRIMARY KEY,
    warehouse_name VARCHAR(128) NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    total_capacity_sqm NUMERIC(10, 2) NOT NULL,
    available_fleet_heavy INTEGER NOT NULL DEFAULT 10,
    available_fleet_light INTEGER NOT NULL DEFAULT 25,
    dispatch_throughput_per_hr INTEGER NOT NULL DEFAULT 120
);

-- 4. Hourly Operational Inventory Ledger (Time-Series)
CREATE TABLE IF NOT EXISTS inventory_telemetry (
    telemetry_id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    zone_id VARCHAR(32) REFERENCES zones(zone_id),
    commodity_id VARCHAR(32) REFERENCES commodities(commodity_id),
    current_inventory NUMERIC(12, 2) NOT NULL,
    incoming_in_transit NUMERIC(12, 2) NOT NULL DEFAULT 0.0,
    consumption_rate_hourly NUMERIC(10, 2) NOT NULL,
    actual_demand NUMERIC(10, 2) NOT NULL,
    safety_stock_level NUMERIC(10, 2) NOT NULL,
    reorder_point NUMERIC(10, 2) NOT NULL,
    shortage_flag SMALLINT NOT NULL DEFAULT 0,
    hours_to_stockout NUMERIC(6, 2) NOT NULL,
    data_provenance VARCHAR(64) NOT NULL
);

-- 5. ML Demand Forecasts & Explainability Attributions
CREATE TABLE IF NOT EXISTS ml_demand_forecasts (
    forecast_id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    forecast_timestamp TIMESTAMPTZ NOT NULL,
    zone_id VARCHAR(32) REFERENCES zones(zone_id),
    commodity_id VARCHAR(32) REFERENCES commodities(commodity_id),
    model_version VARCHAR(32) NOT NULL,
    forecast_horizon_hours INTEGER NOT NULL,
    predicted_demand NUMERIC(10, 2) NOT NULL,
    ci_95_lower NUMERIC(10, 2) NOT NULL,
    ci_95_upper NUMERIC(10, 2) NOT NULL,
    top_causal_factors JSONB,
    shortage_risk_category VARCHAR(16) NOT NULL -- NOMINAL, WARNING, CRITICAL
);

-- 6. AI Optimization Redistribution Plans & Executions
CREATE TABLE IF NOT EXISTS redistribution_dispatches (
    dispatch_id VARCHAR(64) PRIMARY KEY,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_type VARCHAR(16) NOT NULL, -- WAREHOUSE or ZONE_SURPLUS
    source_id VARCHAR(32) NOT NULL,
    destination_zone_id VARCHAR(32) REFERENCES zones(zone_id),
    commodity_id VARCHAR(32) REFERENCES commodities(commodity_id),
    allocated_quantity NUMERIC(10, 2) NOT NULL,
    vehicle_type VARCHAR(32) NOT NULL,
    assigned_vehicle_id VARCHAR(32) NOT NULL,
    estimated_transit_minutes NUMERIC(6, 2) NOT NULL,
    risk_score_mitigated NUMERIC(5, 2) NOT NULL,
    approval_status VARCHAR(16) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, IN_TRANSIT, COMPLETED, REJECTED
    reviewed_by VARCHAR(64),
    reviewed_at TIMESTAMPTZ,
    google_routes_distance_meters INTEGER,
    google_routes_duration_seconds INTEGER,
    route_polyline_encoded TEXT
);

-- Indexes for lightning fast time-series analytical queries
CREATE INDEX IF NOT EXISTS idx_inv_zone_comm_ts ON inventory_telemetry(zone_id, commodity_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_fcst_zone_comm ON ml_demand_forecasts(zone_id, commodity_id, forecast_timestamp);
CREATE INDEX IF NOT EXISTS idx_dispatches_status ON redistribution_dispatches(approval_status, generated_at DESC);

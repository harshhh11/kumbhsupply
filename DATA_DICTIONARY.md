# Data Dictionary — KumbhSupply-AI Schema

This document defines all 48 schema fields across the unified modelling table and synthetic operational datasets.

| Field Name | Type | Unit / Format | Classification | Description |
| :--- | :--- | :--- | :--- | :--- |
| `timestamp` | String | ISO 8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`) | DERIVED | Primary observation timestamp |
| `date` | String | `YYYY-MM-DD` | DERIVED | Calendar date |
| `hour` | Integer | `0 - 23` | DERIVED | Hour of the day (local IST) |
| `zone_id` | String | Categorical (`zone-a`, `zone-b`, etc.) | VERIFIED REAL | Unique identifier for the operational zone |
| `zone_name` | String | Text | VERIFIED REAL | Human-readable zone designation |
| `warehouse_id` | String | Categorical (`wh-central`, `wh-1`, etc.) | VERIFIED REAL | Assigned replenishing warehouse identifier |
| `supply_hub_id` | String | Categorical (`hub-water-01`, etc.) | VERIFIED REAL | Designated local supply buffer hub |
| `commodity` | String | Categorical (`water`, `food`, `medical`, etc.) | VERIFIED REAL | Commodity name |
| `commodity_category` | String | Categorical (`liquid`, `dry_bulk`, `cold_chain`, etc.) | VERIFIED REAL | Logistics handling category |
| `crowd_count` | Integer | Persons | DERIFIED/REAL | Estimated active crowd inside zone boundaries |
| `crowd_density` | Float | Persons / $\text{m}^2$ | DERIVED | Real-time crowd concentration |
| `crowd_growth_rate` | Float | $\Delta \% / \text{hour}$ | DERIVED | Rate of crowd accumulation |
| `crowd_change_1h` | Integer | $\Delta \text{persons}$ | DERIVED | Net crowd change over previous 1 hour |
| `crowd_change_6h` | Integer | $\Delta \text{persons}$ | DERIVED | Net crowd change over previous 6 hours |
| `crowd_change_24h` | Integer | $\Delta \text{persons}$ | DERIVED | Net crowd change over previous 24 hours |
| `temperature` | Float | $^\circ\text{C}$ | LIVE API | Ambient 2m air temperature |
| `apparent_temperature`| Float | $^\circ\text{C}$ | LIVE API | Heat index / feels-like temperature |
| `humidity` | Float | $\%$ | LIVE API | Relative air humidity |
| `rainfall` | Float | $\text{mm / hour}$ | LIVE API | Hourly precipitation volume |
| `wind_speed` | Float | $\text{km / h}$ | LIVE API | Surface wind velocity |
| `weather_code` | Integer | WMO code (`0 - 99`) | LIVE API | Standard meteorological condition code |
| `event_type` | String | Categorical (`normal`, `shahi_snan`, etc.) | VERIFIED REAL | Event calendar classification |
| `event_intensity` | Float | Index `1.0 - 5.0` | DERIVED | Operational surge weight factor |
| `peak_event` | Boolean | `0 / 1` | VERIFIED REAL | Binary indicator for major royal bath days |
| `weekend` | Boolean | `0 / 1` | DERIVED | Binary indicator for Saturday/Sunday |
| `hour_of_day` | Integer | `0 - 23` | DERIVED | Diurnal cycle feature |
| `day_of_week` | Integer | `0 (Mon) - 6 (Sun)` | DERIVED | Weekly pattern feature |
| `road_congestion` | Float | Index `0.0 - 1.0` | LIVE/DERIVED | Road travel delay ratio ($T_{\text{traffic}} / T_{\text{freeflow}}$) |
| `road_restriction` | Boolean | `0 / 1` | VERIFIED REAL | Binary flag for procession-related road closures |
| `estimated_travel_time`| Float | Minutes | LIVE API | Google Routes traffic-aware transit duration |
| `current_inventory` | Float | Commodity units | SYNTHETIC | Instantaneous physical stock on hand |
| `incoming_inventory` | Float | Commodity units | SYNTHETIC | In-transit stock scheduled to arrive $< 2\text{h}$ |
| `outgoing_inventory` | Float | Commodity units | SYNTHETIC | Dispatched/allocated stock leaving zone |
| `historical_consumption`| Float | Units / hour | SYNTHETIC | Moving average consumption rate |
| `consumption_rate` | Float | Units / hour | SYNTHETIC | Active hourly depletion velocity |
| `consumption_change` | Float | $\Delta \% / \text{hour}$ | DERIVED | Acceleration in demand depletion |
| `safety_stock` | Float | Commodity units | DERIVED | Statistically calculated reserve buffer ($Z \cdot \sigma_L$) |
| `reorder_point` | Float | Commodity units | DERIVED | Threshold triggering replenishment recommendation |
| `lead_time` | Float | Hours | DERIVED | Transit plus staging dispatch latency |
| `predicted_demand` | Float | Commodity units | DERIVED (ML) | Machine learning demand forecast for target horizon |
| `shortage_risk` | String | Categorical (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) | DERIVED (ML) | Multi-factor operational risk classification |
| `shortage_probability`| Float | `0.00 - 1.00` | DERIVED (ML) | Calibrated probability of stockout before lead time |
| `recommended_transfer_quantity` | Float | Commodity units | DERIVED (OPT)| Recommended surplus quantity to dispatch |
| `target_inventory` | Float | Commodity units | DERIVED | Desired post-replenishment stock level |
| `post_transfer_inventory` | Float | Commodity units | DERIVED | Projected inventory after replenishment |
| `distance_to_supply_hub` | Float | Kilometers | VERIFIED REAL | Road network distance to nearest warehouse |
| `estimated_delivery_time` | Float | Minutes | LIVE API | Real-time traffic-aware delivery ETA |
| `data_source` | String | Provenance tag | METADATA | Primary source attribution for the record |
| `data_quality` | String | `EXCELLENT`, `GOOD`, `ESTIMATED` | METADATA | Automated validation quality score |
| `real_or_synthetic` | String | `VERIFIED REAL`, `LIVE API`, `SYNTHETIC` | METADATA | Transparency indicator |

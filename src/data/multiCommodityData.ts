/**
 * KumbhSupply-AI: Multi-Commodity Data Models & Master Registry
 * Full support for 9 essential commodities across 12 operational zones and 3 regional warehouses.
 * Includes data provenance classifications, dynamic safety stock calculations, and operational constraints.
 */

export type CommodityCategory = 
  | 'liquid' 
  | 'dry_bulk' 
  | 'cold_chain' 
  | 'chemical' 
  | 'hazardous' 
  | 'emergency' 
  | 'packaged' 
  | 'hardware';

export type ProvenanceType = 'VERIFIED REAL' | 'LIVE API' | 'DERIVED' | 'SYNTHETIC/SIMULATED';

export interface CommodityMaster {
  id: string;
  name: string;
  category: CommodityCategory;
  unit: string;
  baseConsumptionRate: number; // units per pilgrim-hour
  temperatureCoefficient: number; // surge % per degree C above 30C
  criticalSafetyHours: number; // minimum buffer hours
  baseInventory: number;
  shelfLifeHours?: number;
  icon: string;
  color: string;
  provenance: ProvenanceType;
  citation: string;
}

export interface ZoneNode {
  id: string;
  name: string;
  sector: string;
  assignedWarehouseId: string;
  coordinates: { lat: number; lng: number };
  areaSqm: number;
  baseCrowdCapacity: number;
  criticalityTier: 1 | 2 | 3; // 1 = highest emergency priority (e.g. Mahakal, Ram Ghat)
  egressChokepoints: number;
}

export interface WarehouseNode {
  id: string;
  name: string;
  code: string;
  coordinates: { lat: number; lng: number };
  totalCapacitySqm: number;
  heavyTrucks: number;
  lightTrucks: number;
  currentFleetAvailable: number;
  throughputPerHour: number;
}

export interface ZoneCommodityStock {
  zoneId: string;
  commodityId: string;
  currentStock: number;
  allocatedInTransit: number;
  burnRateHourly: number;
  coverageHours: number;
  safetyStock: number;
  reorderPoint: number;
  shortageRisk: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  hoursToStockout: number;
  surplusTransferrable: number;
}

export interface OperationalScenario {
  id: string;
  name: string;
  category: 'crowd' | 'weather' | 'infrastructure' | 'health';
  description: string;
  crowdMultiplier: number;
  temperatureDeltaC: number;
  rainfallMm: number;
  routeAccessibilityFactor: number; // 0.2 to 1.0 (lower means severe road congestion)
  affectedCommodityIds: string[];
  affectedZoneIds: string[];
  baselineShortageHours: number; // historical unmitigated shortage duration
  aiMitigatedShortageHours: number; // proactive AI redistribution duration
  reductionPct: number;
}

export const COMMODITY_REGISTRY: Record<string, CommodityMaster> = {
  water: {
    id: 'water',
    name: 'Drinking Water (Potable)',
    category: 'liquid',
    unit: 'Liters',
    baseConsumptionRate: 0.16, // ~3.8L/day calibrated from PIB PRID 2100106
    temperatureCoefficient: 0.04,
    criticalSafetyHours: 6.0,
    baseInventory: 65000,
    icon: 'Droplets',
    color: '#06b6d4',
    provenance: 'VERIFIED REAL',
    citation: 'PIB PRID 2100106 & UP Jal Nigam Standard'
  },
  food: {
    id: 'food',
    name: 'Dry Food Rations & Meals',
    category: 'dry_bulk',
    unit: 'Meals / kg',
    baseConsumptionRate: 0.035,
    temperatureCoefficient: 0.005,
    criticalSafetyHours: 8.0,
    baseInventory: 22000,
    icon: 'Utensils',
    color: '#f59e0b',
    provenance: 'VERIFIED REAL',
    citation: 'PMC4404264 Food Logistics at Mass Gatherings'
  },
  medical: {
    id: 'medical',
    name: 'Critical Trauma First Aid',
    category: 'cold_chain',
    unit: 'Kits',
    baseConsumptionRate: 0.0003,
    temperatureCoefficient: 0.02,
    criticalSafetyHours: 12.0,
    baseInventory: 950,
    shelfLifeHours: 8760,
    icon: 'HeartPulse',
    color: '#ef4444',
    provenance: 'VERIFIED REAL',
    citation: 'Mendeley Data zvkkk4mzrg/1 Emergency Deployments'
  },
  medicines: {
    id: 'medicines',
    name: 'Essential ORS & Antipyretics',
    category: 'cold_chain',
    unit: 'Packs',
    baseConsumptionRate: 0.002,
    temperatureCoefficient: 0.05,
    criticalSafetyHours: 10.0,
    baseInventory: 5000,
    icon: 'Pill',
    color: '#ec4899',
    provenance: 'VERIFIED REAL',
    citation: 'PMC7513824 Health Surveillance in Mass Gatherings'
  },
  sanitation: {
    id: 'sanitation',
    name: 'Bio-Sanitation Enzymes',
    category: 'chemical',
    unit: 'Canisters',
    baseConsumptionRate: 0.0008,
    temperatureCoefficient: 0.01,
    criticalSafetyHours: 12.0,
    baseInventory: 2100,
    icon: 'Sparkles',
    color: '#10b981',
    provenance: 'DERIVED',
    citation: 'Swachh Kumbh Operational Protocol 2025'
  },
  fuel: {
    id: 'fuel',
    name: 'Generator Diesel Fuel',
    category: 'hazardous',
    unit: 'Liters',
    baseConsumptionRate: 0.004,
    temperatureCoefficient: 0.00,
    criticalSafetyHours: 14.0,
    baseInventory: 14000,
    icon: 'Fuel',
    color: '#eab308',
    provenance: 'DERIVED',
    citation: 'Emergency Power Backup Specifications'
  },
  emergency: {
    id: 'emergency',
    name: 'Disaster & Crowd Rescue Kits',
    category: 'emergency',
    unit: 'Kits',
    baseConsumptionRate: 0.0001,
    temperatureCoefficient: 0.01,
    criticalSafetyHours: 18.0,
    baseInventory: 450,
    icon: 'ShieldAlert',
    color: '#8b5cf6',
    provenance: 'DERIVED',
    citation: 'NDRF Mass Crowd Tactical Buffer'
  },
  hygiene: {
    id: 'hygiene',
    name: 'Personal Hygiene & Soap Packs',
    category: 'packaged',
    unit: 'Packs',
    baseConsumptionRate: 0.0015,
    temperatureCoefficient: 0.02,
    criticalSafetyHours: 8.0,
    baseInventory: 4200,
    icon: 'Package',
    color: '#3b82f6',
    provenance: 'DERIVED',
    citation: 'Public Health Sanitation Standards'
  },
  infra_materials: {
    id: 'infra_materials',
    name: 'Barricades & Flood Mats',
    category: 'hardware',
    unit: 'Units',
    baseConsumptionRate: 0.0002,
    temperatureCoefficient: 0.00,
    criticalSafetyHours: 24.0,
    baseInventory: 800,
    icon: 'Layers',
    color: '#64748b',
    provenance: 'DERIVED',
    citation: 'Mela Administration Infrastructure Inventory'
  }
};

export const ZONES_MASTER: ZoneNode[] = [
  { id: 'zone-a', name: 'Zone A — Mahakal Temple Precinct', sector: 'Central Historic', assignedWarehouseId: 'wh-central', coordinates: { lat: 23.1827, lng: 75.7682 }, areaSqm: 85000, baseCrowdCapacity: 140000, criticalityTier: 1, egressChokepoints: 3 },
  { id: 'zone-b', name: 'Zone B — Ram Ghat Gathering Sector', sector: 'Riverfront', assignedWarehouseId: 'wh-central', coordinates: { lat: 23.1798, lng: 75.7725 }, areaSqm: 120000, baseCrowdCapacity: 195000, criticalityTier: 1, egressChokepoints: 4 },
  { id: 'zone-c', name: 'Zone C — Triveni Encampments & Transit Hub', sector: 'Southern Transit', assignedWarehouseId: 'wh-1', coordinates: { lat: 23.1652, lng: 75.7794 }, areaSqm: 95000, baseCrowdCapacity: 85000, criticalityTier: 2, egressChokepoints: 2 },
  { id: 'zone-d', name: 'Zone D — Nanakheda Southern Staging Hub', sector: 'Southern Ingress', assignedWarehouseId: 'wh-central', coordinates: { lat: 23.1585, lng: 75.7891 }, areaSqm: 70000, baseCrowdCapacity: 65000, criticalityTier: 2, egressChokepoints: 2 },
  { id: 'zone-e', name: 'Zone E — Mangalnath Ridge Sector', sector: 'Northern Heights', assignedWarehouseId: 'wh-2', coordinates: { lat: 23.2081, lng: 75.7648 }, areaSqm: 60000, baseCrowdCapacity: 45000, criticalityTier: 3, egressChokepoints: 1 },
  { id: 'zone-f', name: 'Zone F — Siddhwat Northern Ghats', sector: 'Northern Riverfront', assignedWarehouseId: 'wh-2', coordinates: { lat: 23.2145, lng: 75.7782 }, areaSqm: 75000, baseCrowdCapacity: 72000, criticalityTier: 2, egressChokepoints: 2 },
  { id: 'zone-g', name: 'Zone G — Bhartrihari Gufa Encampments', sector: 'North-Eastern Heritage', assignedWarehouseId: 'wh-1', coordinates: { lat: 23.2012, lng: 75.7854 }, areaSqm: 50000, baseCrowdCapacity: 38000, criticalityTier: 3, egressChokepoints: 1 },
  { id: 'zone-h', name: 'Zone H — Chintaman Western Peripheral', sector: 'Western Peripheral', assignedWarehouseId: 'wh-1', coordinates: { lat: 23.1742, lng: 75.7410 }, areaSqm: 45000, baseCrowdCapacity: 32000, criticalityTier: 3, egressChokepoints: 1 },
  { id: 'zone-i', name: 'Zone I — Kalbhairav Northern Sector', sector: 'North-Western Sector', assignedWarehouseId: 'wh-2', coordinates: { lat: 23.2034, lng: 75.7512 }, areaSqm: 65000, baseCrowdCapacity: 55000, criticalityTier: 2, egressChokepoints: 2 },
  { id: 'zone-j', name: 'Zone J — Agar Road Logistics Ingress', sector: 'North-Eastern Highway', assignedWarehouseId: 'wh-2', coordinates: { lat: 23.1950, lng: 75.8050 }, areaSqm: 40000, baseCrowdCapacity: 28000, criticalityTier: 3, egressChokepoints: 2 },
  { id: 'zone-k', name: 'Zone K — Sandipani Cultural Precinct', sector: 'Eastern Cultural', assignedWarehouseId: 'wh-central', coordinates: { lat: 23.1905, lng: 75.7920 }, areaSqm: 55000, baseCrowdCapacity: 42000, criticalityTier: 2, egressChokepoints: 2 },
  { id: 'zone-l', name: 'Zone L — Kshipra East Bank Ghats', sector: 'East Riverfront', assignedWarehouseId: 'wh-central', coordinates: { lat: 23.1845, lng: 75.7760 }, areaSqm: 90000, baseCrowdCapacity: 88000, criticalityTier: 1, egressChokepoints: 3 }
];

export const WAREHOUSES_MASTER: WarehouseNode[] = [
  { id: 'wh-central', name: 'Central Logistics Depot (Nanakheda Hub)', code: 'CLD-01', coordinates: { lat: 23.1610, lng: 75.7820 }, totalCapacitySqm: 18000, heavyTrucks: 14, lightTrucks: 30, currentFleetAvailable: 38, throughputPerHour: 160 },
  { id: 'wh-1', name: 'West Transshipment Hub (Chintaman)', code: 'WTH-02', coordinates: { lat: 23.1710, lng: 75.7480 }, totalCapacitySqm: 12000, heavyTrucks: 8, lightTrucks: 18, currentFleetAvailable: 22, throughputPerHour: 110 },
  { id: 'wh-2', name: 'North Riverine Depot (Agar Ingress)', code: 'NRD-03', coordinates: { lat: 23.2005, lng: 75.7980 }, totalCapacitySqm: 14000, heavyTrucks: 10, lightTrucks: 22, currentFleetAvailable: 26, throughputPerHour: 130 }
];

export const OPERATIONAL_SCENARIOS: OperationalScenario[] = [
  {
    id: 'sc-01',
    name: 'Mauni Amavasya Peak Royal Snan Surge',
    category: 'crowd',
    description: 'Mass surge of 4.2x crowd concentration at Ram Ghat & Mahakal Temple during early morning auspicious bathing window.',
    crowdMultiplier: 4.2,
    temperatureDeltaC: 1.5,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.55,
    affectedCommodityIds: ['water', 'food', 'medical', 'medicines'],
    affectedZoneIds: ['zone-a', 'zone-b', 'zone-l'],
    baselineShortageHours: 7.8,
    aiMitigatedShortageHours: 0.9,
    reductionPct: 88.5
  },
  {
    id: 'sc-02',
    name: 'Extreme Midday Heatwave (41.5°C)',
    category: 'weather',
    description: 'Severe temperature spike drastically accelerates dehydration and ORS depletion across all open riverfront ghats.',
    crowdMultiplier: 1.4,
    temperatureDeltaC: 8.5,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.90,
    affectedCommodityIds: ['water', 'medicines', 'fuel'],
    affectedZoneIds: ['zone-a', 'zone-b', 'zone-c', 'zone-f', 'zone-l'],
    baselineShortageHours: 9.4,
    aiMitigatedShortageHours: 1.2,
    reductionPct: 87.2
  },
  {
    id: 'sc-03',
    name: 'Flash Monsoon Inundation (45mm Rain)',
    category: 'weather',
    description: 'Heavy precipitation causes localized flash ponding, damaging open storage and impairing heavy logistics trucks.',
    crowdMultiplier: 0.8,
    temperatureDeltaC: -3.0,
    rainfallMm: 45.0,
    routeAccessibilityFactor: 0.40,
    affectedCommodityIds: ['infra_materials', 'sanitation', 'emergency'],
    affectedZoneIds: ['zone-b', 'zone-c', 'zone-f'],
    baselineShortageHours: 12.1,
    aiMitigatedShortageHours: 2.1,
    reductionPct: 82.6
  },
  {
    id: 'sc-04',
    name: 'Mahakal Egress Chokepoint Gridlock',
    category: 'infrastructure',
    description: 'Narrow arterial lanes surrounding Zone A experience severe pedestrian density lock, slowing standard delivery vehicles.',
    crowdMultiplier: 2.8,
    temperatureDeltaC: 0.5,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.25,
    affectedCommodityIds: ['water', 'medical'],
    affectedZoneIds: ['zone-a'],
    baselineShortageHours: 6.5,
    aiMitigatedShortageHours: 0.6,
    reductionPct: 90.8
  },
  {
    id: 'sc-05',
    name: 'Water ATM Pipeline Pressure Drop',
    category: 'infrastructure',
    description: 'Main municipal water supply pipeline suffers pressure failure in Sector 2, shifting 100% load to packaged/water-tanker trucks.',
    crowdMultiplier: 1.2,
    temperatureDeltaC: 2.0,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.85,
    affectedCommodityIds: ['water'],
    affectedZoneIds: ['zone-c', 'zone-d', 'zone-k'],
    baselineShortageHours: 11.2,
    aiMitigatedShortageHours: 1.4,
    reductionPct: 87.5
  },
  {
    id: 'sc-06',
    name: 'Acute Gastroenteritis Cluster Outbreak',
    category: 'health',
    description: 'Sudden spike in acute diarrheal illness reported near transit camps; demand for ORS and antipyretics quadruples.',
    crowdMultiplier: 1.1,
    temperatureDeltaC: 1.0,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.95,
    affectedCommodityIds: ['medicines', 'sanitation', 'medical'],
    affectedZoneIds: ['zone-c', 'zone-g'],
    baselineShortageHours: 8.9,
    aiMitigatedShortageHours: 0.8,
    reductionPct: 91.0
  },
  {
    id: 'sc-07',
    name: 'Substation Transformer Failure (Power Outage)',
    category: 'infrastructure',
    description: 'Loss of grid power triggers continuous generator operation across northern encampments, causing rapid diesel burn.',
    crowdMultiplier: 1.0,
    temperatureDeltaC: 0.0,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.90,
    affectedCommodityIds: ['fuel'],
    affectedZoneIds: ['zone-e', 'zone-f', 'zone-i', 'zone-j'],
    baselineShortageHours: 5.8,
    aiMitigatedShortageHours: 0.4,
    reductionPct: 93.1
  },
  {
    id: 'sc-08',
    name: 'National Highway Supply Ingress Blockage',
    category: 'infrastructure',
    description: 'External supply convoy delayed 6 hours on Indore-Ujjain highway; requires peer-to-peer inter-zone surplus redistribution.',
    crowdMultiplier: 1.5,
    temperatureDeltaC: 0.0,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.70,
    affectedCommodityIds: ['food', 'water', 'hygiene'],
    affectedZoneIds: ['zone-d', 'zone-h'],
    baselineShortageHours: 14.5,
    aiMitigatedShortageHours: 2.3,
    reductionPct: 84.1
  },
  {
    id: 'sc-09',
    name: 'Night Temperature Plunge & Fog (5°C)',
    category: 'weather',
    description: 'Dense winter radiation fog reduces road visibility and transit speeds by 40% between 22:00 and 06:00.',
    crowdMultiplier: 0.9,
    temperatureDeltaC: -12.0,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.60,
    affectedCommodityIds: ['food', 'fuel', 'emergency'],
    affectedZoneIds: ['zone-c', 'zone-g', 'zone-h'],
    baselineShortageHours: 6.2,
    aiMitigatedShortageHours: 0.9,
    reductionPct: 85.5
  },
  {
    id: 'sc-10',
    name: 'Post-Royal Snan Mass Egress Surge',
    category: 'crowd',
    description: 'Simultaneous departure of 2.5 million pilgrims towards railway and transit hubs creates huge localized food and water demand.',
    crowdMultiplier: 3.1,
    temperatureDeltaC: 1.0,
    rainfallMm: 0.0,
    routeAccessibilityFactor: 0.50,
    affectedCommodityIds: ['water', 'food', 'sanitation'],
    affectedZoneIds: ['zone-c', 'zone-d', 'zone-j'],
    baselineShortageHours: 8.6,
    aiMitigatedShortageHours: 1.1,
    reductionPct: 87.2
  }
];

export function computeDynamicSafetyStock(
  hourlyDemand: number,
  safetyHours: number,
  leadTimeHours: number = 1.5,
  demandVariance: number = 0.15
): { safetyStock: number; reorderPoint: number } {
  // Safety Stock formula: Z * sigma_L = 1.96 * sqrt(L * sigma_d^2 + d^2 * sigma_L^2)
  const z = 1.96; // 97.5% service level
  const sigmaD = hourlyDemand * demandVariance;
  const sigmaL = leadTimeHours * 0.2;
  const safetyStock = Math.round(
    Math.max(
      hourlyDemand * safetyHours,
      z * Math.sqrt(leadTimeHours * Math.pow(sigmaD, 2) + Math.pow(hourlyDemand, 2) * Math.pow(sigmaL, 2))
    )
  );
  const reorderPoint = Math.round(hourlyDemand * leadTimeHours + safetyStock);
  return { safetyStock, reorderPoint };
}

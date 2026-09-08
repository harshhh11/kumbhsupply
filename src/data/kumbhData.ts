export interface Commodity {
  id: string;
  name: string;
  category: 'water' | 'food' | 'medical' | 'sanitation' | 'waste' | 'fuel' | 'emergency' | 'infrastructure';
  unit: string;
  totalAvailable: number;
  totalSafetyStock: number;
  totalPredictedDemand: number;
  zonesAtRisk: number;
  activeDeliveries: number;
  readinessScore: number;
  iconName: string;
  color: string;
  description: string;
  criticalThresholdHours: number;
}

export interface ZoneCommodityStatus {
  currentInventory: number;
  predictedDemand24h: number;
  incomingStock: number;
  safetyStock: number;
  consumptionRatePerHour: number;
  stockoutEtaHours: number;
  status: 'safe' | 'watch' | 'warning' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface OperationalZone {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'bathing_ghat' | 'sadhu_camp' | 'temple_corridor' | 'transit_hub' | 'holding_area';
  crowdCount: number;
  crowdCapacity: number;
  crowdDensity: 'Low' | 'Medium' | 'High' | 'Surge';
  demandLevel: 'Normal' | 'Medium' | 'High Demand' | 'Critical Surge';
  readinessPercentage: number;
  riskScore: number; // 0 - 100
  riskLevel: 'SAFE' | 'WATCH' | 'WARNING' | 'CRITICAL';
  criticalCommodities: string[];
  warningCommodities: string[];
  incomingDeliveriesCount: number;
  coordinates: { x: number; y: number; lat: number; lng: number }; // lat/lng for real geo map
  pinStatus: 'Normal' | 'High Demand' | 'Stable' | 'Medium';
  explainableFactors: {
    crowdDelta: string;
    eventTrigger: string;
    weatherImpact: string;
    historicalPattern: string;
  };
  commodities: Record<string, ZoneCommodityStatus>;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: 'central' | 'regional';
  location: string;
  capacitySqFt: number;
  status: 'HEALTHY' | 'OPERATIONAL' | 'RESERVE_MODE';
  coordinates: { x: number; y: number };
  inventory: Record<string, {
    available: number;
    safetyStock: number;
    reserved: number;
    transferable: number;
    incoming: number;
    status: 'HEALTHY' | 'ADEQUATE' | 'DEPLETED';
  }>;
}

export interface Delivery {
  id: string;
  code: string;
  commodityId: string;
  commodityName: string;
  quantity: number;
  unit: string;
  sourceId: string;
  sourceName: string;
  destinationId: string;
  destinationName: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  etaMinutes: number;
  progressPercent: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE';
  status: 'ASSIGNED' | 'LOADING' | 'IN TRANSIT' | 'DELAYED' | 'DELIVERED';
  routeDistanceKm: number;
  routeType: 'Primary Route' | 'Alternate Route';
  coordinates: { x: number; y: number };
  delayedReason?: string;
}

export interface RedistributionRecommendation {
  id: string;
  commodityId: string;
  commodityName: string;
  quantity: number;
  unit: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  destinationZoneId: string;
  destinationZoneName: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  etaMinutes: number;
  urgencyReason: string;
  sourceStockBefore: number;
  sourceStockAfter: number;
  destinationStockBefore: number;
  destinationProjectedStockAfter: number;
  approved: boolean;
  timestamp: string;
}

export interface OperationalAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'OPERATIONAL' | 'WEATHER' | 'ROAD' | 'DELIVERY';
  title: string;
  message: string;
  zoneId?: string;
  timestamp: string;
  timeAgo: string;
  actionRequired: boolean;
  actionLabel?: string;
  actionTarget?: string;
  read: boolean;
}

export type ZoomLevel = 1 | 2 | 3 | 4 | 5;

export interface DigitalTwinLandmark {
  id: string;
  name: string;
  code?: string;
  subName: string;
  type: string;
  zoneId: string;
  category: 'water' | 'food' | 'medical' | 'sanitation' | 'waste' | 'fuel' | 'emergency' | 'infrastructure' | 'depot' | 'corridor';
  lat: number;
  lng: number;
  elevationMeters: number;
  groundX: number;
  groundY: number;
  homeTop: string;
  homeLeft: string;
  commandTop: string;
  commandLeft: string;
  verificationStatus: 'VERIFIED_GEOGRAPHIC' | 'PROPOSED_OPERATIONAL';
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'DISPATCH' | 'CONVOY';
  statusLabel: string;
  crowdCount: number;
  crowdDensity: string;
  readinessPercentage: number;
  criticalCommodity?: string;
  inventorySummary: Record<string, string>;
  predictedDemandMatrix: {
    '1h': string;
    '3h': string;
    '6h': string;
    '24h': string;
  };
  description: string;
  coordinatesFormatted: string;
  color: string;
  actionTarget?: string;
}

export interface SimulatedVehicleGPS {
  id: string;
  code: string;
  vehicleNumber: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  commodityId: string;
  commodityName: string;
  quantity: number;
  unit: string;
  sourceId: string;
  sourceName: string;
  destinationId: string;
  destinationName: string;
  speedKmh: number;
  headingDeg: number;
  currentLat: number;
  currentLng: number;
  progressPercent: number;
  etaMinutes: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE';
  status: 'IN TRANSIT' | 'LOADING' | 'ARRIVED' | 'DELAYED';
  roadCorridorName: string;
  waypoints: { lat: number; lng: number; x: number; y: number }[];
}

export interface TimelineHourState {
  time: '06:00' | '09:00' | '12:00' | '15:00' | '18:00' | '21:00';
  label: string;
  ambientLighting: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'golden_hour' | 'night';
  crowdMultiplier: number;
  temperatureC: number;
  activeKeyEvents: string[];
  zoneRiskSummary: Record<string, 'SAFE' | 'WATCH' | 'WARNING' | 'CRITICAL'>;
  description: string;
}

export interface RouteOption {
  id: string;
  name: string;
  isPrimary: boolean;
  distanceKm: number;
  estimatedMinutes: number;
  crowdDensityScore: 'Low' | 'Medium' | 'High';
  restrictionRisk: 'Low restriction risk' | 'Moderate checkpoint delay' | 'Pedestrian crowd restriction';
  roadRestrictions: string[];
  checkpoints: number;
  pontoonBridgeClearance: boolean;
}

// ----------------------------------------------------
// INITIAL MASTER DATA (GENERALIZED EVENT-AGNOSTIC)
// ----------------------------------------------------

export const COMMODITIES: Commodity[] = [
  {
    id: 'water',
    name: 'Drinking Water',
    category: 'water',
    unit: 'L',
    totalAvailable: 185000,
    totalSafetyStock: 60000,
    totalPredictedDemand: 210000,
    zonesAtRisk: 2,
    activeDeliveries: 9,
    readinessScore: 88,
    iconName: 'Droplets',
    color: '#38bdf8',
    description: 'Purified municipal drinking water, tanker replenishment along Main Gathering Ghats & chilled dispensing kiosks.',
    criticalThresholdHours: 4.5
  },
  {
    id: 'food',
    name: 'Food & Dry Rations',
    category: 'food',
    unit: 'kg',
    totalAvailable: 120000,
    totalSafetyStock: 35000,
    totalPredictedDemand: 145000,
    zonesAtRisk: 1,
    activeDeliveries: 6,
    readinessScore: 84,
    iconName: 'Utensils',
    color: '#fbbf24',
    description: 'Grain rations, wheat flour, lentils, community kitchen provisions & nutrition kits across community dining camps.',
    criticalThresholdHours: 6.0
  },
  {
    id: 'medical',
    name: 'Medicines & Medical',
    category: 'medical',
    unit: 'kits',
    totalAvailable: 48000,
    totalSafetyStock: 15000,
    totalPredictedDemand: 58000,
    zonesAtRisk: 2,
    activeDeliveries: 4,
    readinessScore: 72,
    iconName: 'Cross',
    color: '#f43f5e',
    description: 'Emergency trauma kits, IV saline, ORS sachets, antibiotics & mobile ICU consumables at Main Field Hospital.',
    criticalThresholdHours: 3.3
  },
  {
    id: 'sanitation',
    name: 'Sanitation Supplies',
    category: 'sanitation',
    unit: 'units',
    totalAvailable: 36000,
    totalSafetyStock: 10000,
    totalPredictedDemand: 41000,
    zonesAtRisk: 1,
    activeDeliveries: 3,
    readinessScore: 82,
    iconName: 'Trash2',
    color: '#10b981',
    description: 'Chlorine disinfectant blocks, bio-toilet enzyme packets, liquid soaps & mobile hygiene kits for gathering ghats.',
    criticalThresholdHours: 5.5
  },
  {
    id: 'fuel',
    name: 'Fuel & Energy',
    category: 'fuel',
    unit: 'L',
    totalAvailable: 45000,
    totalSafetyStock: 12000,
    totalPredictedDemand: 38000,
    zonesAtRisk: 0,
    activeDeliveries: 2,
    readinessScore: 92,
    iconName: 'Fuel',
    color: '#fb923c',
    description: 'Low-emission diesel for high-mast mobile floodlights, emergency gensets & ambulance reserves across event riverfront.',
    criticalThresholdHours: 8.0
  },
  {
    id: 'emergency',
    name: 'Emergency Supplies',
    category: 'emergency',
    unit: 'kits',
    totalAvailable: 2400,
    totalSafetyStock: 800,
    totalPredictedDemand: 2800,
    zonesAtRisk: 1,
    activeDeliveries: 2,
    readinessScore: 89,
    iconName: 'AlertTriangle',
    color: '#ef4444',
    description: 'Life jackets, inflatable river rescue boats, spine boards, megaphone beacons & VHF radios for emergency crews.',
    criticalThresholdHours: 4.0
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure Materials',
    category: 'infrastructure',
    unit: 'units',
    totalAvailable: 4200,
    totalSafetyStock: 1200,
    totalPredictedDemand: 3900,
    zonesAtRisk: 0,
    activeDeliveries: 1,
    readinessScore: 90,
    iconName: 'Layers',
    color: '#a855f7',
    description: 'Steel crowd barricades, pontoon anchor lines, waterproof canopy tarpaulins & flood lighting towers along bridges.',
    criticalThresholdHours: 12.0
  },
  {
    id: 'waste',
    name: 'Cleaning & Waste Mgmt',
    category: 'waste',
    unit: 'units',
    totalAvailable: 14500,
    totalSafetyStock: 4000,
    totalPredictedDemand: 16000,
    zonesAtRisk: 1,
    activeDeliveries: 1,
    readinessScore: 85,
    iconName: 'Sparkles',
    color: '#14b8a6',
    description: 'Ghat sweepers, biodegradable waste sacks, river skimming nets & lime powder dispersion bags.',
    criticalThresholdHours: 5.0
  }
];

export const OPERATIONAL_ZONES: OperationalZone[] = [
  {
    id: 'zone-a',
    name: 'Zone A — Temple & Heritage Precinct',
    code: 'ZONE A',
    description: 'Historic heritage sanctuary, central shrine complex, spiritual corridors and pedestrian darshan walkways.',
    type: 'temple_corridor',
    crowdCount: 85000,
    crowdCapacity: 110000,
    crowdDensity: 'High',
    demandLevel: 'Normal',
    readinessPercentage: 94,
    riskScore: 24,
    riskLevel: 'SAFE',
    criticalCommodities: [],
    warningCommodities: ['water'],
    incomingDeliveriesCount: 4,
    coordinates: { x: 38, y: 32, lat: 20.0055, lng: 73.7945 },
    pinStatus: 'Stable',
    explainableFactors: {
      crowdDelta: '+6% steady influx for morning shrine darshan',
      eventTrigger: 'Devotee queue circulation through heritage corridor',
      weatherImpact: '31°C clear sunny morning requiring active hydration points',
      historicalPattern: 'Peak morning corridor flow between 05:30 and 11:00'
    },
    commodities: {
      water: { currentInventory: 46000, predictedDemand24h: 42000, incomingStock: 15000, safetyStock: 14000, consumptionRatePerHour: 2200, stockoutEtaHours: 20.9, status: 'safe', trend: 'stable' },
      food: { currentInventory: 28000, predictedDemand24h: 24000, incomingStock: 8000, safetyStock: 8000, consumptionRatePerHour: 1100, stockoutEtaHours: 25.4, status: 'safe', trend: 'stable' },
      medical: { currentInventory: 14500, predictedDemand24h: 12000, incomingStock: 3000, safetyStock: 4000, consumptionRatePerHour: 520, stockoutEtaHours: 27.8, status: 'safe', trend: 'stable' },
      sanitation: { currentInventory: 11200, predictedDemand24h: 9500, incomingStock: 2500, safetyStock: 3000, consumptionRatePerHour: 420, stockoutEtaHours: 26.6, status: 'safe', trend: 'stable' },
      fuel: { currentInventory: 6200, predictedDemand24h: 4800, incomingStock: 0, safetyStock: 2000, consumptionRatePerHour: 180, stockoutEtaHours: 34.4, status: 'safe', trend: 'stable' },
      emergency: { currentInventory: 1800, predictedDemand24h: 1200, incomingStock: 400, safetyStock: 500, consumptionRatePerHour: 45, stockoutEtaHours: 40.0, status: 'safe', trend: 'stable' }
    }
  },
  {
    id: 'zone-b',
    name: 'Zone B — Main Gathering Ghat & Snan Precinct',
    code: 'ZONE B',
    description: 'Epicenter of holy bath rituals, royal dip ceremonies, riverfront prayer gatherings and massive congregation.',
    type: 'bathing_ghat',
    crowdCount: 160000,
    crowdCapacity: 180000,
    crowdDensity: 'Surge',
    demandLevel: 'High Demand',
    readinessPercentage: 58,
    riskScore: 82,
    riskLevel: 'CRITICAL',
    criticalCommodities: ['water', 'medical'],
    warningCommodities: ['sanitation'],
    incomingDeliveriesCount: 7,
    coordinates: { x: 50, y: 44, lat: 20.0038, lng: 73.7915 },
    pinStatus: 'High Demand',
    explainableFactors: {
      crowdDelta: '+22% sudden surge following morning royal bath ceremony announcement',
      eventTrigger: 'Grand ceremonial procession arriving at main ghat steps',
      weatherImpact: 'High thermal heat index (34°C) accelerating water & ORS depletion',
      historicalPattern: 'Event records show 3x hydration demand during royal bath hours'
    },
    commodities: {
      water: { currentInventory: 24000, predictedDemand24h: 78000, incomingStock: 20000, safetyStock: 22000, consumptionRatePerHour: 4600, stockoutEtaHours: 3.2, status: 'critical', trend: 'increasing' },
      food: { currentInventory: 32000, predictedDemand24h: 54000, incomingStock: 12000, safetyStock: 12000, consumptionRatePerHour: 2400, stockoutEtaHours: 8.8, status: 'watch', trend: 'increasing' },
      medical: { currentInventory: 3600, predictedDemand24h: 19500, incomingStock: 2500, safetyStock: 6000, consumptionRatePerHour: 1100, stockoutEtaHours: 2.9, status: 'critical', trend: 'increasing' },
      sanitation: { currentInventory: 8200, predictedDemand24h: 14800, incomingStock: 3500, safetyStock: 3500, consumptionRatePerHour: 740, stockoutEtaHours: 7.2, status: 'warning', trend: 'increasing' },
      fuel: { currentInventory: 5400, predictedDemand24h: 6800, incomingStock: 2000, safetyStock: 1800, consumptionRatePerHour: 280, stockoutEtaHours: 19.2, status: 'safe', trend: 'stable' },
      emergency: { currentInventory: 1400, predictedDemand24h: 1800, incomingStock: 600, safetyStock: 500, consumptionRatePerHour: 80, stockoutEtaHours: 17.5, status: 'safe', trend: 'stable' }
    }
  },
  {
    id: 'zone-c',
    name: 'Zone C — Promenade Ghat & Community Camps',
    code: 'ZONE C',
    description: 'Downstream river corridor, promenade ghats, community encampments and continuous dining kitchens.',
    type: 'sadhu_camp',
    crowdCount: 65000,
    crowdCapacity: 90000,
    crowdDensity: 'Medium',
    demandLevel: 'Normal',
    readinessPercentage: 90,
    riskScore: 26,
    riskLevel: 'SAFE',
    criticalCommodities: [],
    warningCommodities: ['food'],
    incomingDeliveriesCount: 4,
    coordinates: { x: 65, y: 55, lat: 19.9980, lng: 73.8050 },
    pinStatus: 'Stable',
    explainableFactors: {
      crowdDelta: '+3% steady dining seva attendance',
      eventTrigger: 'Afternoon community prasad distribution in assembly halls',
      weatherImpact: 'Shaded tent canopies maintaining stable conditions',
      historicalPattern: 'High flour, pulse and fuel intake during midday seva'
    },
    commodities: {
      water: { currentInventory: 44000, predictedDemand24h: 38000, incomingStock: 10000, safetyStock: 12000, consumptionRatePerHour: 1600, stockoutEtaHours: 27.5, status: 'safe', trend: 'stable' },
      food: { currentInventory: 34000, predictedDemand24h: 36000, incomingStock: 8000, safetyStock: 9000, consumptionRatePerHour: 1400, stockoutEtaHours: 18.2, status: 'watch', trend: 'increasing' },
      medical: { currentInventory: 11800, predictedDemand24h: 9200, incomingStock: 2000, safetyStock: 3000, consumptionRatePerHour: 380, stockoutEtaHours: 31.0, status: 'safe', trend: 'stable' },
      sanitation: { currentInventory: 8900, predictedDemand24h: 7600, incomingStock: 1500, safetyStock: 2500, consumptionRatePerHour: 320, stockoutEtaHours: 27.8, status: 'safe', trend: 'stable' },
      fuel: { currentInventory: 5100, predictedDemand24h: 4200, incomingStock: 0, safetyStock: 1500, consumptionRatePerHour: 150, stockoutEtaHours: 34.0, status: 'safe', trend: 'stable' },
      emergency: { currentInventory: 1100, predictedDemand24h: 850, incomingStock: 200, safetyStock: 300, consumptionRatePerHour: 30, stockoutEtaHours: 36.6, status: 'safe', trend: 'stable' }
    }
  },
  {
    id: 'zone-d',
    name: 'Zone D — Western Transit Sector & Holding Bay',
    code: 'ZONE D',
    description: 'Upstream western sector, bridge approach corridor, passenger shuttle drop-offs and buffer holding bays.',
    type: 'transit_hub',
    crowdCount: 95000,
    crowdCapacity: 120000,
    crowdDensity: 'Medium',
    demandLevel: 'Medium',
    readinessPercentage: 76,
    riskScore: 48,
    riskLevel: 'WATCH',
    criticalCommodities: [],
    warningCommodities: ['water', 'sanitation'],
    incomingDeliveriesCount: 3,
    coordinates: { x: 44, y: 68, lat: 20.0040, lng: 73.7880 },
    pinStatus: 'Medium',
    explainableFactors: {
      crowdDelta: '+9% continuous passenger turnover from transit feeder shuttles',
      eventTrigger: 'Inter-district shuttle disembarkation at western gate',
      weatherImpact: 'High road dust requiring active water sprinkling',
      historicalPattern: 'Afternoon holding sector turnover requires rapid sanitation cycle'
    },
    commodities: {
      water: { currentInventory: 31000, predictedDemand24h: 39000, incomingStock: 8000, safetyStock: 11000, consumptionRatePerHour: 1750, stockoutEtaHours: 17.7, status: 'watch', trend: 'increasing' },
      food: { currentInventory: 22000, predictedDemand24h: 21000, incomingStock: 5000, safetyStock: 6000, consumptionRatePerHour: 920, stockoutEtaHours: 23.9, status: 'safe', trend: 'stable' },
      medical: { currentInventory: 8600, predictedDemand24h: 7800, incomingStock: 1500, safetyStock: 2500, consumptionRatePerHour: 340, stockoutEtaHours: 25.2, status: 'safe', trend: 'stable' },
      sanitation: { currentInventory: 6400, predictedDemand24h: 9200, incomingStock: 2000, safetyStock: 2500, consumptionRatePerHour: 410, stockoutEtaHours: 15.6, status: 'watch', trend: 'increasing' },
      fuel: { currentInventory: 6400, predictedDemand24h: 5200, incomingStock: 1000, safetyStock: 1800, consumptionRatePerHour: 220, stockoutEtaHours: 29.0, status: 'safe', trend: 'stable' },
      emergency: { currentInventory: 900, predictedDemand24h: 700, incomingStock: 0, safetyStock: 300, consumptionRatePerHour: 40, stockoutEtaHours: 22.5, status: 'safe', trend: 'stable' }
    }
  },
  {
    id: 'zone-e',
    name: 'Zone E — Regional Ingress Staging Hub (Gate 01)',
    code: 'ZONE E',
    description: 'Regional gateway connecting outer highway, expressway transit barrier, staging depot and shuttle rotation points.',
    type: 'holding_area',
    crowdCount: 32000,
    crowdCapacity: 65000,
    crowdDensity: 'Low',
    demandLevel: 'Normal',
    readinessPercentage: 93,
    riskScore: 16,
    riskLevel: 'SAFE',
    criticalCommodities: [],
    warningCommodities: [],
    incomingDeliveriesCount: 2,
    coordinates: { x: 22, y: 75, lat: 19.9850, lng: 73.7720 },
    pinStatus: 'Stable',
    explainableFactors: {
      crowdDelta: '+2% normal inter-city highway transit',
      eventTrigger: 'Pilgrim shuttle rotation and buffer staging',
      weatherImpact: 'Wide open shaded logistics parking compound',
      historicalPattern: 'Buffer storage zone acts as secondary distribution node'
    },
    commodities: {
      water: { currentInventory: 45000, predictedDemand24h: 24000, incomingStock: 6000, safetyStock: 9000, consumptionRatePerHour: 980, stockoutEtaHours: 45.9, status: 'safe', trend: 'stable' },
      food: { currentInventory: 22000, predictedDemand24h: 14000, incomingStock: 4000, safetyStock: 5000, consumptionRatePerHour: 580, stockoutEtaHours: 37.9, status: 'safe', trend: 'stable' },
      medical: { currentInventory: 16200, predictedDemand24h: 6500, incomingStock: 0, safetyStock: 3500, consumptionRatePerHour: 220, stockoutEtaHours: 73.6, status: 'safe', trend: 'stable' },
      sanitation: { currentInventory: 5800, predictedDemand24h: 4200, incomingStock: 0, safetyStock: 1400, consumptionRatePerHour: 160, stockoutEtaHours: 36.2, status: 'safe', trend: 'stable' },
      fuel: { currentInventory: 4900, predictedDemand24h: 3100, incomingStock: 0, safetyStock: 1400, consumptionRatePerHour: 130, stockoutEtaHours: 37.6, status: 'safe', trend: 'stable' },
      emergency: { currentInventory: 700, predictedDemand24h: 450, incomingStock: 0, safetyStock: 180, consumptionRatePerHour: 18, stockoutEtaHours: 38.8, status: 'safe', trend: 'stable' }
    }
  }
];

export const WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-central',
    name: 'Central Supply Hub (Master Logistics Depot)',
    code: 'CW-01',
    type: 'central',
    location: 'Central Supply Depot, Primary Logistics Arterial',
    capacitySqFt: 520000,
    status: 'HEALTHY',
    coordinates: { x: 42, y: 64 },
    inventory: {
      water: { available: 95000, safetyStock: 30000, reserved: 25000, transferable: 45000, incoming: 60000, status: 'HEALTHY' },
      food: { available: 62000, safetyStock: 18000, reserved: 14000, transferable: 32000, incoming: 30000, status: 'HEALTHY' },
      medical: { available: 24000, safetyStock: 6000, reserved: 5000, transferable: 13000, incoming: 12000, status: 'HEALTHY' },
      sanitation: { available: 18000, safetyStock: 4500, reserved: 3500, transferable: 10000, incoming: 9000, status: 'HEALTHY' },
      fuel: { available: 22000, safetyStock: 5000, reserved: 4000, transferable: 13000, incoming: 8000, status: 'HEALTHY' },
      emergency: { available: 1200, safetyStock: 400, reserved: 200, transferable: 600, incoming: 500, status: 'HEALTHY' }
    }
  },
  {
    id: 'wh-1',
    name: 'Warehouse 01 (Secondary Staging Depot)',
    code: 'WH-01',
    type: 'regional',
    location: 'Western Logistics Yard, Staging Bay 01',
    capacitySqFt: 250000,
    status: 'HEALTHY',
    coordinates: { x: 28, y: 52 },
    inventory: {
      water: { available: 48000, safetyStock: 14000, reserved: 9000, transferable: 25000, incoming: 18000, status: 'HEALTHY' },
      food: { available: 35000, safetyStock: 9000, reserved: 7000, transferable: 19000, incoming: 12000, status: 'HEALTHY' },
      medical: { available: 13500, safetyStock: 3500, reserved: 2800, transferable: 7200, incoming: 4500, status: 'HEALTHY' },
      sanitation: { available: 9800, safetyStock: 2800, reserved: 2000, transferable: 5000, incoming: 3500, status: 'HEALTHY' },
      fuel: { available: 12000, safetyStock: 3500, reserved: 2500, transferable: 6000, incoming: 4000, status: 'HEALTHY' },
      emergency: { available: 650, safetyStock: 200, reserved: 100, transferable: 350, incoming: 250, status: 'HEALTHY' }
    }
  },
  {
    id: 'wh-2',
    name: 'Warehouse 02 (Northern Regional Logistics Depot)',
    code: 'WH-02',
    type: 'regional',
    location: 'Northern Industrial Extension, Ring Road Interchange',
    capacitySqFt: 340000,
    status: 'HEALTHY',
    coordinates: { x: 74, y: 28 },
    inventory: {
      water: { available: 64000, safetyStock: 16000, reserved: 13000, transferable: 35000, incoming: 22000, status: 'HEALTHY' },
      food: { available: 36000, safetyStock: 10000, reserved: 8000, transferable: 18000, incoming: 14000, status: 'HEALTHY' },
      medical: { available: 15800, safetyStock: 4000, reserved: 3000, transferable: 8800, incoming: 5500, status: 'HEALTHY' },
      sanitation: { available: 11400, safetyStock: 3000, reserved: 2200, transferable: 6200, incoming: 4500, status: 'HEALTHY' },
      fuel: { available: 11000, safetyStock: 3500, reserved: 2500, transferable: 5000, incoming: 3500, status: 'HEALTHY' },
      emergency: { available: 550, safetyStock: 200, reserved: 100, transferable: 250, incoming: 200, status: 'HEALTHY' }
    }
  }
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'del-1042',
    code: 'DEL-1042',
    commodityId: 'water',
    commodityName: 'Drinking Water',
    quantity: 20000,
    unit: 'L',
    sourceId: 'wh-central',
    sourceName: 'Central Supply Hub',
    destinationId: 'zone-b',
    destinationName: 'Zone B (Main Gathering Ghat)',
    vehicleNumber: 'EV-SUPPLY-1042',
    vehicleType: 'Heavy Water Tanker (WT-1042)',
    driverName: 'Lead Logistics Driver A',
    driverPhone: '+91 98000 10042',
    etaMinutes: 23,
    progressPercent: 52,
    priority: 'CRITICAL',
    status: 'IN TRANSIT',
    routeDistanceKm: 4.2,
    routeType: 'Primary Route',
    coordinates: { x: 52, y: 56 }
  },
  {
    id: 'del-1043',
    code: 'DEL-1043',
    commodityId: 'medical',
    commodityName: 'Medicines & Trauma Kits',
    quantity: 500,
    unit: 'kits',
    sourceId: 'wh-central',
    sourceName: 'Central Supply Hub',
    destinationId: 'zone-b',
    destinationName: 'Zone B (Main Field Hospital)',
    vehicleNumber: 'EV-MED-0402',
    vehicleType: 'Rapid Medical Van (MED-402)',
    driverName: 'Emergency Medical Lead',
    driverPhone: '+91 98000 10402',
    etaMinutes: 18,
    progressPercent: 38,
    priority: 'CRITICAL',
    status: 'IN TRANSIT',
    routeDistanceKm: 4.2,
    routeType: 'Primary Route',
    coordinates: { x: 55, y: 60 }
  },
  {
    id: 'del-1044',
    code: 'DEL-1044',
    commodityId: 'food',
    commodityName: 'Food & Dry Rations',
    quantity: 5000,
    unit: 'kg',
    sourceId: 'wh-1',
    sourceName: 'Warehouse 01',
    destinationId: 'zone-c',
    destinationName: 'Zone C (Community Kitchens)',
    vehicleNumber: 'EV-FOOD-2041',
    vehicleType: 'Heavy Ration Carrier (FD-204)',
    driverName: 'Ration Transport Driver',
    driverPhone: '+91 98000 10204',
    etaMinutes: 26,
    progressPercent: 40,
    priority: 'HIGH',
    status: 'IN TRANSIT',
    routeDistanceKm: 5.4,
    routeType: 'Primary Route',
    coordinates: { x: 48, y: 52 }
  },
  {
    id: 'del-1045',
    code: 'DEL-1045',
    commodityId: 'sanitation',
    commodityName: 'Chlorine Tablets & Bio-Enzymes',
    quantity: 1400,
    unit: 'units',
    sourceId: 'wh-2',
    sourceName: 'Warehouse 02',
    destinationId: 'zone-a',
    destinationName: 'Zone A (Temple Precinct)',
    vehicleNumber: 'EV-SAN-8820',
    vehicleType: 'Sanitation Fleet (SN-02)',
    driverName: 'Sanitation Logistics Lead',
    driverPhone: '+91 98000 10882',
    etaMinutes: 22,
    progressPercent: 65,
    priority: 'MEDIUM',
    status: 'IN TRANSIT',
    routeDistanceKm: 6.2,
    routeType: 'Alternate Route',
    coordinates: { x: 42, y: 38 }
  },
  {
    id: 'del-1046',
    code: 'DEL-1046',
    commodityId: 'emergency',
    commodityName: 'Life Jackets & Rescue Kits',
    quantity: 350,
    unit: 'units',
    sourceId: 'wh-central',
    sourceName: 'Central Supply Hub',
    destinationId: 'zone-b',
    destinationName: 'Zone B (Main Gathering Ghat)',
    vehicleNumber: 'EV-EMG-1122',
    vehicleType: 'Emergency Quick-Response (EQ-01)',
    driverName: 'Rescue Unit Operator',
    driverPhone: '+91 98000 11122',
    etaMinutes: 14,
    progressPercent: 78,
    priority: 'CRITICAL',
    status: 'IN TRANSIT',
    routeDistanceKm: 4.2,
    routeType: 'Primary Route',
    coordinates: { x: 51, y: 48 }
  },
  {
    id: 'del-1047',
    code: 'DEL-1047',
    commodityId: 'fuel',
    commodityName: 'Emergency Generator Diesel',
    quantity: 4000,
    unit: 'L',
    sourceId: 'wh-1',
    sourceName: 'Warehouse 01',
    destinationId: 'zone-d',
    destinationName: 'Zone D (Transit Sector)',
    vehicleNumber: 'EV-FUEL-5501',
    vehicleType: 'Fuel Bowzer (FB-03)',
    driverName: 'Energy Unit Operator',
    driverPhone: '+91 98000 15501',
    etaMinutes: 34,
    progressPercent: 20,
    priority: 'MEDIUM',
    status: 'IN TRANSIT',
    routeDistanceKm: 4.8,
    routeType: 'Alternate Route',
    coordinates: { x: 38, y: 62 }
  }
];

export const INITIAL_RECOMMENDATIONS: RedistributionRecommendation[] = [
  {
    id: 'rec-01',
    commodityId: 'water',
    commodityName: 'Drinking Water',
    quantity: 20000,
    unit: 'L',
    sourceWarehouseId: 'wh-central',
    sourceWarehouseName: 'Central Supply Hub',
    destinationZoneId: 'zone-b',
    destinationZoneName: 'Zone B (Main Gathering Ghat & Snan Precinct)',
    priority: 'CRITICAL',
    etaMinutes: 23,
    urgencyReason: 'Devotee surge at Main Ghat (160,000 pilgrims) will deplete potable water buffers below safety-stock threshold in 3h 12m. Immediate transfer of 20,000 L via Pontoon Logistics Bridge 01 recommended.',
    sourceStockBefore: 95000,
    sourceStockAfter: 75000,
    destinationStockBefore: 24000,
    destinationProjectedStockAfter: 44000,
    approved: true,
    timestamp: 'Just now'
  },
  {
    id: 'rec-02',
    commodityId: 'medical',
    commodityName: 'Emergency Medical Kits & ORS',
    quantity: 500,
    unit: 'kits',
    sourceWarehouseId: 'wh-central',
    sourceWarehouseName: 'Central Supply Hub',
    destinationZoneId: 'zone-b',
    destinationZoneName: 'Zone B (Main Gathering Ghat & Snan Precinct)',
    priority: 'CRITICAL',
    etaMinutes: 18,
    urgencyReason: 'High thermal heat index (34°C) driving dehydration triage at Main Field Hospital. Medical kit buffer below 3-hour minimum runtime.',
    sourceStockBefore: 24000,
    sourceStockAfter: 23500,
    destinationStockBefore: 3600,
    destinationProjectedStockAfter: 6100,
    approved: false,
    timestamp: '12 mins ago'
  },
  {
    id: 'rec-03',
    commodityId: 'food',
    commodityName: 'Dry Ration Food Packs & Flour',
    quantity: 5000,
    unit: 'kg',
    sourceWarehouseId: 'wh-1',
    sourceWarehouseName: 'Warehouse 01',
    destinationZoneId: 'zone-c',
    destinationZoneName: 'Zone C (Promenade & Community Camps)',
    priority: 'HIGH',
    etaMinutes: 26,
    urgencyReason: 'Community dining demand accelerating ahead of evening congregation.',
    sourceStockBefore: 35000,
    sourceStockAfter: 30000,
    destinationStockBefore: 34000,
    destinationProjectedStockAfter: 39000,
    approved: false,
    timestamp: '35 mins ago'
  }
];

export const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: 'alt-01',
    type: 'CRITICAL',
    title: 'Zone B Water Depletion Warning',
    message: 'Potable water stock at Main Gathering Ghat projected to fall below safety buffer in 3h 12m. Transfer of 20,000 L dispatched via WT-1042.',
    zoneId: 'zone-b',
    timestamp: '14:22',
    timeAgo: '6 mins ago',
    actionRequired: true,
    actionLabel: 'Track Convoy',
    actionTarget: 'twin',
    read: false
  },
  {
    id: 'alt-02',
    type: 'WARNING',
    title: 'Zone B Medical Surge Watch',
    message: 'Medical kit consumption at Main Field Hospital doubled due to 34°C afternoon thermal index. Rapid Van MED-402 on standby.',
    zoneId: 'zone-b',
    timestamp: '14:15',
    timeAgo: '13 mins ago',
    actionRequired: true,
    actionLabel: 'Review Transfer',
    actionTarget: 'redistribution',
    read: false
  },
  {
    id: 'alt-03',
    type: 'ROAD',
    title: 'Heritage Corridor Traffic Regulation',
    message: 'Primary supply route via Central Bridge congested due to crowd procession. Auto-rerouting to Pontoon Logistics Bridge 01 active.',
    zoneId: 'zone-a',
    timestamp: '13:58',
    timeAgo: '30 mins ago',
    actionRequired: false,
    read: true
  },
  {
    id: 'alt-04',
    type: 'DELIVERY',
    title: 'Water Tanker WT-1042 En Route',
    message: '20,000 L potable water transit from Central Supply Hub to Zone B on schedule. Current ETA 23 mins.',
    zoneId: 'zone-b',
    timestamp: '13:45',
    timeAgo: '43 mins ago',
    actionRequired: false,
    read: true
  },
  {
    id: 'alt-05',
    type: 'WEATHER',
    title: 'Ambient Temperature Escalation (+3°C)',
    message: 'Midday heat index across event riverfront reached 34°C. AI hydration multiplier escalated from 1.15 to 1.42.',
    timestamp: '13:30',
    timeAgo: '58 mins ago',
    actionRequired: false,
    read: true
  }
];

export const ROUTE_OPTIONS: Record<string, RouteOption[]> = {
  'zone-b': [
    {
      id: 'rt-b-primary',
      name: 'Primary Arterial (Central Supply Hub → Primary Arterial → Pontoon Bridge 01)',
      isPrimary: true,
      distanceKm: 4.2,
      estimatedMinutes: 23,
      crowdDensityScore: 'Low',
      restrictionRisk: 'Low restriction risk',
      roadRestrictions: ['Dedicated logistics lane active', 'Clearance synchronized with Event Traffic Control'],
      checkpoints: 2,
      pontoonBridgeClearance: true
    },
    {
      id: 'rt-b-alt',
      name: 'Outer Ring Contingency (Outer Ring Expressway → North Bypass → Outer Bridge)',
      isPrimary: false,
      distanceKm: 7.8,
      estimatedMinutes: 34,
      crowdDensityScore: 'Medium',
      restrictionRisk: 'Moderate checkpoint delay',
      roadRestrictions: ['Procession bypass active', 'Heavy vehicle speed capped at 30 km/h'],
      checkpoints: 4,
      pontoonBridgeClearance: false
    }
  ],
  'zone-d': [
    {
      id: 'rt-d-primary',
      name: 'Western Arterial (Central Supply Hub → Transit Way → Sector D Direct Lane)',
      isPrimary: true,
      distanceKm: 3.8,
      estimatedMinutes: 16,
      crowdDensityScore: 'Medium',
      restrictionRisk: 'Low restriction risk',
      roadRestrictions: ['RFID logistics clearance pass active'],
      checkpoints: 2,
      pontoonBridgeClearance: true
    },
    {
      id: 'rt-d-alt',
      name: 'Northern Bypass (Outer Perimeter Link Road)',
      isPrimary: false,
      distanceKm: 5.9,
      estimatedMinutes: 24,
      crowdDensityScore: 'Low',
      restrictionRisk: 'Low restriction risk',
      roadRestrictions: ['Single lane river bridge crossing'],
      checkpoints: 1,
      pontoonBridgeClearance: false
    }
  ]
};

// Machine learning benchmark evaluations
export const ML_MODELS = [
  {
    id: 'rf',
    name: 'Random Forest Regressor (Primary Engine)',
    type: 'Ensemble Learning',
    mae: 142.5,
    rmse: 218.4,
    mape: '3.42%',
    r2: 0.962,
    latencyMs: 14,
    status: 'ACTIVE PRODUCTION'
  },
  {
    id: 'xgb',
    name: 'XGBoost Gradient Boosting (Comparative Benchmark)',
    type: 'Boosted Trees',
    mae: 138.1,
    rmse: 211.2,
    mape: '3.18%',
    r2: 0.968,
    latencyMs: 22,
    status: 'EVALUATION PARALLEL'
  },
  {
    id: 'lr',
    name: 'Linear Regression (Baseline Benchmark)',
    type: 'Parametric Baseline',
    mae: 320.8,
    rmse: 445.6,
    mape: '8.94%',
    r2: 0.814,
    latencyMs: 2,
    status: 'BASELINE ONLY'
  }
];

export const DEMAND_TIME_SERIES = [
  { time: '00:00', actual: 4200, predicted: 4350, upper: 4700, lower: 4000, event: 'Night rest' },
  { time: '02:00', actual: 3600, predicted: 3750, upper: 4100, lower: 3400, event: 'Night rest' },
  { time: '04:00', actual: 8200, predicted: 7900, upper: 8600, lower: 7300, event: 'Early Morning Prayers' },
  { time: '06:00', actual: 18400, predicted: 19100, upper: 20500, lower: 17800, event: 'Dawn Holy Dip at Main Ghat' },
  { time: '08:00', actual: 26800, predicted: 27500, upper: 29200, lower: 25400, event: 'Morning Royal Bath Influx' },
  { time: '10:00', actual: 31200, predicted: 30800, upper: 33000, lower: 28900, event: 'Grand Procession Across Ghats' },
  { time: '12:00', actual: 27500, predicted: 28200, upper: 30400, lower: 26100, event: 'Midday Community Dining Seva' },
  { time: '14:00', actual: 22400, predicted: 23100, upper: 25000, lower: 21500, event: 'Midday Heat Peak (34°C)' },
  { time: '16:00', actual: 28900, predicted: 29500, upper: 31800, lower: 27600, event: 'Evening Gathering at Riverfront' },
  { time: '18:00', actual: 36500, predicted: 37200, upper: 40000, lower: 34800, event: 'Grand Riverfront Evening Aarti' },
  { time: '20:00', actual: 29800, predicted: 30400, upper: 32600, lower: 28200, event: 'Post-Ceremony Dispersal' },
  { time: '22:00', actual: 15200, predicted: 15800, upper: 17200, lower: 14400, event: 'Transit to Residential Encampments' }
];

export const KEY_EVENT_GATHERING_DAYS = [
  { date: 'Day 01', event: 'Dhwajarohan (Opening Ceremony & Flag Hoisting)', crowdEstimate: '15,00,000' },
  { date: 'Day 14', event: 'Royal Bath Day 01 (Major Influx Peak - Purnima)', crowdEstimate: '38,00,000' },
  { date: 'Day 28', event: 'Royal Bath Day 02 (Highest Congregation Peak - Amavasya)', crowdEstimate: '52,00,000' },
  { date: 'Day 45', event: 'Royal Bath Day 03 (Grand Procession Day)', crowdEstimate: '60,00,000' },
  { date: 'Day 60', event: 'Event Concluding Ceremony & Riverfront Illumination', crowdEstimate: '22,00,000' }
];

// =========================================================================
// REAL GEOGRAPHIC DIGITAL TWIN MASTER DATA (EVENT-AGNOSTIC)
// =========================================================================

export const VERIFIED_DIGITAL_TWIN_LANDMARKS: DigitalTwinLandmark[] = [
  {
    id: 'zone-b',
    name: 'Main Gathering Ghat & Snan Precinct',
    subName: 'Central Riverfront & Ceremonial Aarti Steps',
    type: 'Ceremonial Sacred Ghat & Royal Bath Epicenter',
    zoneId: 'zone-b',
    category: 'water',
    lat: 23.1825,
    lng: 75.7682,
    elevationMeters: 489,
    groundX: 50,
    groundY: 44,
    homeTop: '44%',
    homeLeft: '50%',
    commandTop: '44%',
    commandLeft: '50%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'CRITICAL',
    statusLabel: 'CRITICAL SURGE • ~1,60,000 people',
    crowdCount: 160000,
    crowdDensity: 'High Demand Flow Rate',
    readinessPercentage: 58,
    criticalCommodity: 'Drinking Water (-20,000 L Deficit Risk)',
    inventorySummary: {
      'Water Kiosks': '24,000 L',
      'Lifebuoy Stations': '180 active',
      'First Aid Triage': '24 paramed.'
    },
    predictedDemandMatrix: {
      '1h': '28,000 L Water / hr',
      '3h': '78,000 L Water (Deficit in 3.2h)',
      '6h': '1,65,000 L (Evening Aarti Surge)',
      '24h': '4,90,000 L'
    },
    description: 'Primary ceremonial bathing ghat along Kshipra riverfront where royal baths and evening river aarti take place. Active telemetry sensors trigger automated replenishment.',
    coordinatesFormatted: '23.1825° N, 75.7682° E',
    color: '#f43f5e',
    actionTarget: 'redistribution'
  },
  {
    id: 'zone-a',
    name: 'Zone A — Temple & Heritage Precinct',
    subName: 'Central Shrine Sanctuary & Pilgrim Walkways',
    type: 'Historic Temple & Heritage Corridor',
    zoneId: 'zone-a',
    category: 'infrastructure',
    lat: 23.1828,
    lng: 75.7766,
    elevationMeters: 495,
    groundX: 38,
    groundY: 32,
    homeTop: '32%',
    homeLeft: '38%',
    commandTop: '32%',
    commandLeft: '38%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'SAFE',
    statusLabel: '94% Ready • ~85,000 people',
    crowdCount: 85000,
    crowdDensity: 'Controlled Promenade Circulation',
    readinessPercentage: 94,
    inventorySummary: {
      'Emergency First Aid': '14,500 kits',
      'Water Dispensing': '46,000 L',
      'Crowd Barricades': '4,200 m'
    },
    predictedDemandMatrix: {
      '1h': '4,200 L Water / hr',
      '3h': '14,500 L Water (Stable)',
      '6h': '38,000 L (Darshan Peak)',
      '24h': '1,20,000 L'
    },
    description: 'Central heritage sanctuary and temple precinct featuring monumental stone towers, spiritual corridors, and pedestrian queue management.',
    coordinatesFormatted: '23.1828° N, 75.7766° E',
    color: '#10b981',
    actionTarget: 'zone-detail'
  },
  {
    id: 'zone-c',
    name: 'Zone C — Promenade Ghat & Community Camps',
    subName: 'Large Encampments, Community Kitchens & Assembly Hall',
    type: 'Community Encampment City & Dining Sector',
    zoneId: 'zone-c',
    category: 'food',
    lat: 23.1685,
    lng: 75.7820,
    elevationMeters: 491,
    groundX: 65,
    groundY: 55,
    homeTop: '55%',
    homeLeft: '65%',
    commandTop: '55%',
    commandLeft: '65%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'SAFE',
    statusLabel: '90% Ready • ~65,000 people',
    crowdCount: 65000,
    crowdDensity: 'Moderate Compound Flow',
    readinessPercentage: 90,
    inventorySummary: {
      'Dry Food Rations': '34,000 kg',
      'Drinking Water': '44,000 L',
      'Sanitation Units': '38 Mobile Trucks'
    },
    predictedDemandMatrix: {
      '1h': '2,400 kg Food / hr',
      '3h': '8,200 kg Food',
      '6h': '18,500 kg Food',
      '24h': '54,000 kg Food'
    },
    description: 'Vast community encampment grounds along the riverfront housing religious groups, grand tent pavilions, and continuous community dining halls.',
    coordinatesFormatted: '23.1685° N, 75.7820° E',
    color: '#10b981',
    actionTarget: 'zone-detail'
  },
  {
    id: 'zone-d',
    name: 'Zone D — Western Transit Sector',
    subName: 'Transit Interchange & Passenger Holding Bay',
    type: 'Multi-Modal Logistics Hub & Gate',
    zoneId: 'zone-d',
    category: 'infrastructure',
    lat: 23.1590,
    lng: 75.7865,
    elevationMeters: 496,
    groundX: 44,
    groundY: 68,
    homeTop: '68%',
    homeLeft: '44%',
    commandTop: '68%',
    commandLeft: '44%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'WARNING',
    statusLabel: 'Medium Demand • ~95,000 people',
    crowdCount: 95000,
    crowdDensity: 'High Transit Flow Rate',
    readinessPercentage: 76,
    inventorySummary: {
      'Packaged Water': '31,000 L',
      'Dry Rations': '22,000 kg',
      'Shuttle Fuel': '6,400 L'
    },
    predictedDemandMatrix: {
      '1h': '3,100 L Water / hr',
      '3h': '11,500 L Water',
      '6h': '26,000 L Water',
      '24h': '84,000 L Water'
    },
    description: 'Upstream transit interchange receiving passenger shuttles from major regional highways toward the river crossings.',
    coordinatesFormatted: '23.1590° N, 75.7865° E',
    color: '#f59e0b',
    actionTarget: 'routes'
  },
  {
    id: 'warehouse-1',
    name: 'Central Supply Hub (Master Logistics Depot)',
    code: 'CW-01',
    subName: '52,000 sq ft Strategic Reserve & Automated Dispatch Bay',
    type: 'Master Supply Depot & Dispatch Hub',
    zoneId: 'warehouse-1',
    category: 'depot',
    lat: 23.1495,
    lng: 75.7690,
    elevationMeters: 494,
    groundX: 42,
    groundY: 64,
    homeTop: '64%',
    homeLeft: '42%',
    commandTop: '64%',
    commandLeft: '42%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'DISPATCH',
    statusLabel: 'Supply Hub • Central • 28 Fleets Ready',
    crowdCount: 450,
    crowdDensity: 'Secured Logistics Compound',
    readinessPercentage: 100,
    inventorySummary: {
      'Drinking Water': '185,000 L',
      'Food Rations': '120,000 kg',
      'Medical Kits': '48,000 units',
      'Fuel Reserves': '45,000 L'
    },
    predictedDemandMatrix: {
      '1h': 'Dispatch Cap. 6,000 units/hr',
      '3h': 'Reserve Buffer: 100% Safe',
      '6h': 'Convoy Queue: 14 Active',
      '24h': 'Full Event Area Coverage'
    },
    description: 'Primary master logistics warehouse on the central arterial storing city-wide buffers of potable water, medical supplies, food rations and emergency fuel with 28 automated dispatch bays.',
    coordinatesFormatted: '23.1495° N, 75.7690° E',
    color: '#38bdf8',
    actionTarget: 'inventory'
  },
  {
    id: 'landmark-lakshmanghat',
    name: 'Secondary Promenade Ghat',
    subName: 'Riverfront Promenade & Water Dispensing Posts',
    type: 'Ceremonial Ghat',
    zoneId: 'zone-c',
    category: 'water',
    lat: 23.1810,
    lng: 75.7705,
    elevationMeters: 490,
    groundX: 56,
    groundY: 48,
    homeTop: '48%',
    homeLeft: '56%',
    commandTop: '48%',
    commandLeft: '56%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'SAFE',
    statusLabel: 'Promenade Ghat • ~1,20,000 people',
    crowdCount: 120000,
    crowdDensity: 'Continuous Ghat Circulation',
    readinessPercentage: 88,
    inventorySummary: {
      'Water Kiosks': '36,000 L',
      'Life Jackets': '120 units',
      'Medical First Aid': '8 paramed.'
    },
    predictedDemandMatrix: {
      '1h': '3,800 L Water / hr',
      '3h': '12,000 L Water',
      '6h': '28,000 L Water',
      '24h': '72,000 L Water'
    },
    description: 'Prominent ghat complex along the river directly adjacent to the main ghat, equipped with automated water refill posts.',
    coordinatesFormatted: '23.1810° N, 75.7705° E',
    color: '#fbbf24',
    actionTarget: 'zone-detail'
  },
  {
    id: 'bridge-arterial',
    name: 'Pontoon Logistics Bridge 01',
    subName: 'Dedicated Emergency Supply Arterial Corridor',
    type: 'Heavy River Crossing Pontoon (18-Ton Load)',
    zoneId: 'corridor-bridge',
    category: 'corridor',
    lat: 23.1818,
    lng: 75.7675,
    elevationMeters: 489,
    groundX: 52,
    groundY: 46,
    homeTop: '46%',
    homeLeft: '52%',
    commandTop: '46%',
    commandLeft: '52%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'CONVOY',
    statusLabel: 'WT-1042 In Transit • ETA 23 min',
    crowdCount: 5200,
    crowdDensity: 'Dedicated Convoy Corridor',
    readinessPercentage: 92,
    criticalCommodity: '20,000 L Potable Water Tanker',
    inventorySummary: {
      'Bridge Load Capacity': '18 Tons (Pontoon)',
      'Active Convoys': '4 in corridor',
      'Clearance Status': 'Green (Traffic Synced)'
    },
    predictedDemandMatrix: {
      '1h': '22 Convoys / hr capacity',
      '3h': 'Priority Lane Clear',
      '6h': 'Pontoon 02 Active Backup',
      '24h': '24/7 Logistics Duty'
    },
    description: 'Reinforced 18-ton heavy pontoon bridge reserved for rapid medical vans and potable water tankers crossing the river directly into Zone B.',
    coordinatesFormatted: '23.1818° N, 75.7675° E',
    color: '#38bdf8',
    actionTarget: 'deliveries'
  },
  {
    id: 'landmark-medical-camp',
    name: 'Medical Camp 01 (Field Hospital)',
    subName: '150-Bed Emergency Trauma & Heat Triage Base',
    type: 'Mobile Emergency Hospital Compound',
    zoneId: 'zone-b',
    category: 'medical',
    lat: 23.1795,
    lng: 75.7725,
    elevationMeters: 492,
    groundX: 82,
    groundY: 66,
    homeTop: '66%',
    homeLeft: '82%',
    commandTop: '66%',
    commandLeft: '82%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'CRITICAL',
    statusLabel: 'Medical Camp • Surge Watch',
    crowdCount: 1200,
    crowdDensity: 'High Triage Intake',
    readinessPercentage: 62,
    criticalCommodity: 'Trauma Kits & IV Saline',
    inventorySummary: {
      'Triage Beds': '150 active',
      'Oxygen Cylinders': '85 units',
      'Ambulances': '8 ready'
    },
    predictedDemandMatrix: {
      '1h': '55 patient intake / hr',
      '3h': 'Trauma stock deficit (2.9h)',
      '6h': 'Evening Peak Standby',
      '24h': '24/7 Full Trauma Shift'
    },
    description: 'Comprehensive mobile field hospital with 150 beds, ICU resuscitation stations, heatstroke cooling chambers and rapid ambulance bay right next to Zone B.',
    coordinatesFormatted: '23.1795° N, 75.7725° E',
    color: '#f43f5e',
    actionTarget: 'redistribution'
  },
  {
    id: 'landmark-north-ingress-route',
    name: 'North Ingress Corridor (Gate 01)',
    subName: 'Northern 4-Lane Priority Supply Arterial (12.4 km)',
    type: 'Highway Express Corridor',
    zoneId: 'zone-e',
    category: 'infrastructure',
    lat: 23.2100,
    lng: 75.7890,
    elevationMeters: 498,
    groundX: 22,
    groundY: 18,
    homeTop: '18%',
    homeLeft: '22%',
    commandTop: '18%',
    commandLeft: '22%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'SAFE',
    statusLabel: 'North Ingress • 12.4 km | 28 mins',
    crowdCount: 18000,
    crowdDensity: 'High Speed Arterial Transit',
    readinessPercentage: 98,
    inventorySummary: {
      'Route Length': '12.4 km',
      'Travel Time': '28 mins',
      'Checkpoints': '3 RFID Clear'
    },
    predictedDemandMatrix: {
      '1h': '450 vehicles / hr',
      '3h': 'Express clearance active',
      '6h': 'Continuous convoy flow',
      '24h': '24/7 Transit Pass'
    },
    description: 'High-capacity 4-lane arterial connecting the event center directly to the regional transit ingress corridor.',
    coordinatesFormatted: '23.2100° N, 75.7890° E',
    color: '#64748b',
    actionTarget: 'routes'
  },
  {
    id: 'landmark-east-ingress-route',
    name: 'East Ingress Corridor (Gate 02)',
    subName: 'Eastern Regional Highway Connector (28.7 km)',
    type: 'Highway Express Corridor',
    zoneId: 'zone-e',
    category: 'infrastructure',
    lat: 23.1650,
    lng: 75.7950,
    elevationMeters: 494,
    groundX: 88,
    groundY: 74,
    homeTop: '74%',
    homeLeft: '88%',
    commandTop: '74%',
    commandLeft: '88%',
    verificationStatus: 'VERIFIED_GEOGRAPHIC',
    status: 'SAFE',
    statusLabel: 'East Ingress • 28.7 km | 42 mins',
    crowdCount: 9500,
    crowdDensity: 'Controlled Highway Flow',
    readinessPercentage: 96,
    inventorySummary: {
      'Route Length': '28.7 km',
      'Travel Time': '42 mins',
      'Checkpoints': '2 RFID Clear'
    },
    predictedDemandMatrix: {
      '1h': '280 vehicles / hr',
      '3h': 'Normal throughput',
      '6h': 'Evening return flow',
      '24h': 'Standard arterial'
    },
    description: 'Regional highway connecting the event perimeter toward the eastern regional transit corridor.',
    coordinatesFormatted: '19.9970° N, 73.8010° E',
    color: '#64748b',
    actionTarget: 'routes'
  }
];

export const SIMULATED_GPS_FLEET: SimulatedVehicleGPS[] = [
  {
    id: 'veh-1042',
    code: 'WT-1042',
    vehicleNumber: 'EV-SUPPLY-1042',
    vehicleType: 'Heavy Potable Water Tanker (20,000 L)',
    driverName: 'Lead Logistics Driver A',
    driverPhone: '+91 98000 10042',
    commodityId: 'water',
    commodityName: 'Drinking Water',
    quantity: 20000,
    unit: 'L',
    sourceId: 'warehouse-1',
    sourceName: 'Central Supply Hub',
    destinationId: 'zone-b',
    destinationName: 'Zone B — Main Gathering Ghat',
    speedKmh: 36,
    headingDeg: 340,
    currentLat: 19.9985,
    currentLng: 73.7885,
    progressPercent: 54,
    etaMinutes: 23,
    priority: 'CRITICAL',
    status: 'IN TRANSIT',
    roadCorridorName: 'Primary Arterial → Riverbank Road → Pontoon Bridge 01',
    waypoints: [
      { lat: 19.9920, lng: 73.7845, x: 42, y: 64 },
      { lat: 19.9985, lng: 73.7885, x: 50, y: 56 },
      { lat: 20.0020, lng: 73.7905, x: 51, y: 48 },
      { lat: 20.0038, lng: 73.7915, x: 50, y: 44 }
    ]
  },
  {
    id: 'veh-2089',
    code: 'MED-402',
    vehicleNumber: 'EV-MED-0402',
    vehicleType: 'Rapid Medical ICU Transfer Van',
    driverName: 'Emergency Medical Lead',
    driverPhone: '+91 98000 10402',
    commodityId: 'medical',
    commodityName: 'Medical Trauma Kits',
    quantity: 500,
    unit: 'kits',
    sourceId: 'warehouse-1',
    sourceName: 'Central Supply Hub',
    destinationId: 'zone-b',
    destinationName: 'Zone B — Main Field Hospital',
    speedKmh: 46,
    headingDeg: 335,
    currentLat: 19.9960,
    currentLng: 73.7865,
    progressPercent: 35,
    etaMinutes: 18,
    priority: 'CRITICAL',
    status: 'IN TRANSIT',
    roadCorridorName: 'Express Medical Logistics Corridor',
    waypoints: [
      { lat: 19.9920, lng: 73.7845, x: 42, y: 64 },
      { lat: 19.9985, lng: 73.7885, x: 50, y: 56 },
      { lat: 20.0038, lng: 73.7915, x: 50, y: 44 }
    ]
  },
  {
    id: 'veh-3140',
    code: 'FD-204',
    vehicleNumber: 'EV-FOOD-2041',
    vehicleType: 'Covered Dry Food Carrier (8-Ton)',
    driverName: 'Ration Transport Driver',
    driverPhone: '+91 98000 10204',
    commodityId: 'food',
    commodityName: 'Food & Dry Rations',
    quantity: 5000,
    unit: 'kg',
    sourceId: 'wh-1',
    sourceName: 'Warehouse 01 (Secondary Staging Depot)',
    destinationId: 'zone-c',
    destinationName: 'Zone C — Community Camps',
    speedKmh: 34,
    headingDeg: 45,
    currentLat: 20.0010,
    currentLng: 73.7990,
    progressPercent: 48,
    etaMinutes: 26,
    priority: 'HIGH',
    status: 'IN TRANSIT',
    roadCorridorName: 'Riverbank Logistics Lane',
    waypoints: [
      { lat: 20.0050, lng: 73.7850, x: 28, y: 52 },
      { lat: 20.0010, lng: 73.7990, x: 48, y: 52 },
      { lat: 19.9980, lng: 73.8050, x: 65, y: 55 }
    ]
  }
];

export const TIMELINE_HOUR_STATES: TimelineHourState[] = [
  {
    time: '06:00',
    label: '06:00 IST — Morning Gathering & Dawn Bath Peak',
    ambientLighting: 'dawn',
    crowdMultiplier: 0.85,
    temperatureC: 21,
    activeKeyEvents: ['Dawn Riverfront Ceremony', 'Main Ghat Morning Prayers', 'Early Congregation Influx'],
    zoneRiskSummary: { 'zone-a': 'WARNING', 'zone-b': 'WATCH', 'zone-c': 'SAFE', 'zone-d': 'SAFE' },
    description: 'Peak ceremonial dawn gathering along event riverfront. High potable water and hot refreshment consumption at Zone B.'
  },
  {
    time: '09:00',
    label: '09:00 IST — Grand Procession & Gathering Peak',
    ambientLighting: 'morning',
    crowdMultiplier: 1.18,
    temperatureC: 26,
    activeKeyEvents: ['Grand Ceremonial March', 'Dhwajarohan Ceremonies', 'Pontoon Logistics Bridge 01 Priority Clearance'],
    zoneRiskSummary: { 'zone-a': 'SAFE', 'zone-b': 'WARNING', 'zone-c': 'WATCH', 'zone-d': 'SAFE' },
    description: 'Ceremonial procession moves across the riverfront towards Zone B. Dedicated logistics corridors synchronized.'
  },
  {
    time: '12:00',
    label: '12:00 IST — Midday Community Dining & Hydration Surge',
    ambientLighting: 'midday',
    crowdMultiplier: 1.35,
    temperatureC: 34,
    activeKeyEvents: ['Community Kitchen Dining Seva', 'Heat Index Surge (+3°C)', 'Automated Water Buffer Trigger'],
    zoneRiskSummary: { 'zone-a': 'WATCH', 'zone-b': 'CRITICAL', 'zone-c': 'WATCH', 'zone-d': 'WARNING' },
    description: 'Midday 34°C thermal spike accelerates water intake by +32%. Zone B water deficit triggers automated dispatch protocol.'
  },
  {
    time: '15:00',
    label: '15:00 IST — Inter-Zone Transit Shift',
    ambientLighting: 'afternoon',
    crowdMultiplier: 1.12,
    temperatureC: 32,
    activeKeyEvents: ['Regional Shuttle Arrivals', 'Transit Sector Rotations', 'Central Depot Convoy Dispatch'],
    zoneRiskSummary: { 'zone-a': 'SAFE', 'zone-b': 'WARNING', 'zone-c': 'SAFE', 'zone-d': 'WARNING' },
    description: 'Main bridge and transit corridors experience high passenger intake from feeder shuttles.'
  },
  {
    time: '18:00',
    label: '18:00 IST — Grand Riverfront Evening Ceremony',
    ambientLighting: 'golden_hour',
    crowdMultiplier: 1.50,
    temperatureC: 27,
    activeKeyEvents: ['Grand Riverfront Evening Aarti', 'Evening Bath Gathering', 'Night Triage Standby'],
    zoneRiskSummary: { 'zone-a': 'CRITICAL', 'zone-b': 'CRITICAL', 'zone-c': 'WARNING', 'zone-d': 'WATCH' },
    description: 'Maximum attendee concentration across Zone B and Zone C riverfront steps. Illuminated bridges operating at full capacity.'
  },
  {
    time: '21:00',
    label: '21:00 IST — Night Buffer Replenishment & Settlement',
    ambientLighting: 'night',
    crowdMultiplier: 0.75,
    temperatureC: 23,
    activeKeyEvents: ['Dining Hall Closure', 'Central Warehouse Overnight Replenishment', 'Ghat Cleaning Operations'],
    zoneRiskSummary: { 'zone-a': 'SAFE', 'zone-b': 'SAFE', 'zone-c': 'SAFE', 'zone-d': 'SAFE' },
    description: 'Attendees return to encampment zones. Heavy supply convoys reload sector buffer stocks for the next day.'
  }
];

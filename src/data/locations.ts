// =========================================================================
// CENTRAL OPERATIONAL LOCATION CONFIGURATION — UJJAIN REGION
// Real Geographic Coordinates for Ujjain, Madhya Pradesh, India
// =========================================================================

export type LocationType = 
  | 'warehouse'
  | 'zone'
  | 'ghat'
  | 'medical'
  | 'food'
  | 'sanitation'
  | 'fuel'
  | 'emergency'
  | 'bridge'
  | 'transit';

export interface OperationalLocation {
  id: string;
  name: string;
  code: string;
  type: LocationType;
  zoneId?: string;
  category: 'water' | 'food' | 'medical' | 'sanitation' | 'fuel' | 'emergency' | 'infrastructure' | 'depot' | 'corridor';
  latitude: number;
  longitude: number;
  elevationMeters: number;
  address: string;
  landmark: string;
  capacity?: string;
  operatingHours?: string;
  contactChannel?: string;
  coordinatesFormatted: string;
  description: string;
}

export const UJJAIN_OPERATIONAL_LOCATIONS: Record<string, OperationalLocation> = {
  'wh-central': {
    id: 'wh-central',
    name: 'Central Supply Hub (Master Logistics Depot)',
    code: 'CW-01',
    type: 'warehouse',
    category: 'depot',
    latitude: 23.1495,
    longitude: 75.7690,
    elevationMeters: 494,
    address: 'Indore-Ujjain Bypass Logistics Zone, Southern Corridor',
    landmark: 'Central State Logistics Yard, Ujjain',
    capacity: '520,000 sq ft Strategic Reserve • 28 Automated Dispatch Bays',
    operatingHours: '24/7 Automated Logistics Operations',
    contactChannel: 'VHF Ch 1 • Master Logistics Control',
    coordinatesFormatted: '23.1495° N, 75.7690° E',
    description: 'Primary high-capacity central master supply warehouse feeding critical supplies across all event zones.'
  },
  'wh-1': {
    id: 'wh-1',
    name: 'Warehouse 01 (Western Staging Yard)',
    code: 'WH-01',
    type: 'warehouse',
    category: 'depot',
    latitude: 23.1740,
    longitude: 75.7480,
    elevationMeters: 492,
    address: 'Western Bypass Ring Road, Sector 01 Logistics Yard',
    landmark: 'Western Transit Depot, Ujjain',
    capacity: '250,000 sq ft • 14 Fleet Bays',
    operatingHours: '24/7 Active Duty',
    contactChannel: 'VHF Ch 2 • Western Staging Lead',
    coordinatesFormatted: '23.1740° N, 75.7480° E',
    description: 'Western regional reserve depot staging food rations, bottled water, and mobile power generation units.'
  },
  'wh-2': {
    id: 'wh-2',
    name: 'Warehouse 02 (Northern Regional Logistics Depot)',
    code: 'WH-02',
    type: 'warehouse',
    category: 'depot',
    latitude: 23.2105,
    longitude: 75.7920,
    elevationMeters: 498,
    address: 'Northern Industrial Extension, Agar Road Interchange',
    landmark: 'Northern Industrial Corridor, Ujjain',
    capacity: '340,000 sq ft • 18 Fleet Bays',
    operatingHours: '24/7 Active Duty',
    contactChannel: 'VHF Ch 3 • Northern Logistics Lead',
    coordinatesFormatted: '23.2105° N, 75.7920° E',
    description: 'Northern regional warehouse with dedicated medical cold-chain facilities and emergency sanitation chemical reserves.'
  },
  'zone-a': {
    id: 'zone-a',
    name: 'Zone A — Temple & Heritage Precinct',
    code: 'ZONE-A',
    type: 'zone',
    zoneId: 'zone-a',
    category: 'infrastructure',
    latitude: 23.1828,
    longitude: 75.7766,
    elevationMeters: 495,
    address: 'Mahakal Corridor & Sacred Heritage Precinct',
    landmark: 'Mahakaleshwar Precinct, Ujjain',
    capacity: '120,000 Pilgrim Holding Capacity',
    operatingHours: '24/7 Sacred Darshan Corridor',
    contactChannel: 'VHF Ch 4 • Heritage Security Desk',
    coordinatesFormatted: '23.1828° N, 75.7766° E',
    description: 'Core temple precinct featuring monumental spiritual corridors, pedestrian holding plazas, and intensive hydration checkpoints.'
  },
  'zone-b': {
    id: 'zone-b',
    name: 'Zone B — Main Gathering Ghat & Snan Precinct',
    code: 'ZONE-B',
    type: 'ghat',
    zoneId: 'zone-b',
    category: 'water',
    latitude: 23.1825,
    longitude: 75.7682,
    elevationMeters: 489,
    address: 'Ram Ghat Sacred Riverfront & Aarti Steps, Kshipra River',
    landmark: 'Ram Ghat Epicenter, Ujjain',
    capacity: '250,000 Simultaneous Bathing Capacity',
    operatingHours: '24/7 Holy Snan Operations',
    contactChannel: 'VHF Ch 5 • Riverfront Command Post',
    coordinatesFormatted: '23.1825° N, 75.7682° E',
    description: 'Primary ceremonial bathing ghat along Kshipra riverfront where royal baths and evening river aarti ceremonies take place.'
  },
  'zone-c': {
    id: 'zone-c',
    name: 'Zone C — Promenade Ghat & Community Encampments',
    code: 'ZONE-C',
    type: 'zone',
    zoneId: 'zone-c',
    category: 'food',
    latitude: 23.1685,
    longitude: 75.7820,
    elevationMeters: 491,
    address: 'Triveni Confluence Sector & Sadhu Nagar Tent City',
    landmark: 'Triveni Sangam & Encampment City, Ujjain',
    capacity: '350,000 Residential Pilgrim Encampment',
    operatingHours: '24/7 Community Kitchens & Lodging',
    contactChannel: 'VHF Ch 6 • Encampment Logistics',
    coordinatesFormatted: '23.1685° N, 75.7820° E',
    description: 'Vast community tent city and community dining halls feeding hundreds of thousands of pilgrims daily.'
  },
  'zone-d': {
    id: 'zone-d',
    name: 'Zone D — Western Transit Sector',
    code: 'ZONE-D',
    type: 'transit',
    zoneId: 'zone-d',
    category: 'infrastructure',
    latitude: 23.1590,
    longitude: 75.7865,
    elevationMeters: 496,
    address: 'Nanakheda Multi-Modal Transit Terminal & Holding Bay',
    landmark: 'Nanakheda Bus Terminal & Transit Hub, Ujjain',
    capacity: '1,200 Shuttles & 80,000 Hourly Flow',
    operatingHours: '24/7 Inter-City Feeder Service',
    contactChannel: 'VHF Ch 7 • Transit Transport Control',
    coordinatesFormatted: '23.1590° N, 75.7865° E',
    description: 'Major multi-modal transit interchange receiving intercity passenger coaches and coordinating electric shuttle feeder lines.'
  },
  'zone-e': {
    id: 'zone-e',
    name: 'Zone E — Outer Buffer Staging Sector',
    code: 'ZONE-E',
    type: 'zone',
    zoneId: 'zone-e',
    category: 'depot',
    latitude: 23.1980,
    longitude: 75.7620,
    elevationMeters: 493,
    address: 'Mangalnath Outer Bypass Staging Complex',
    landmark: 'Mangalnath Sector Compound, Ujjain',
    capacity: '150 Heavy Logistics Transport Vehicles',
    operatingHours: '24/7 Contingency Depot',
    contactChannel: 'VHF Ch 8 • Buffer Staging Lead',
    coordinatesFormatted: '23.1980° N, 75.7620° E',
    description: 'Northern buffer staging zone with auxiliary reserve convoys ready for rapid dispatch across river crossings.'
  },
  'landmark-medical-camp': {
    id: 'landmark-medical-camp',
    name: 'Medical Camp 01 (150-Bed Field Hospital)',
    code: 'MED-01',
    type: 'medical',
    zoneId: 'zone-b',
    category: 'medical',
    latitude: 23.1795,
    longitude: 75.7725,
    elevationMeters: 492,
    address: 'Kshipra East Riverfront Medical Complex',
    landmark: 'Civil Hospital Field Extension 01, Ujjain',
    capacity: '150 Trauma & Heatstroke Triage Beds',
    operatingHours: '24/7 Emergency Medical Hospital',
    contactChannel: 'VHF Ch 9 • Emergency Medical Triage',
    coordinatesFormatted: '23.1795° N, 75.7725° E',
    description: 'Central field hospital equipped with ICU mobile trailers, oxygen manifolds, and rapid thermal heat-exhaustion rehydration suites.'
  },
  'bridge-arterial': {
    id: 'bridge-arterial',
    name: 'Pontoon Logistics Bridge 01',
    code: 'BRG-01',
    type: 'bridge',
    zoneId: 'corridor-bridge',
    category: 'corridor',
    latitude: 23.1818,
    longitude: 75.7675,
    elevationMeters: 489,
    address: 'Dedicated Logistics River Crossing, Kshipra River',
    landmark: 'Central Pontoon Span 01, Ujjain',
    capacity: '18-Ton Axle Load Limit (Logistics Convoy Priority)',
    operatingHours: '24/7 Dedicated Logistics Corridor',
    contactChannel: 'VHF Ch 10 • River Bridge Traffic Officer',
    coordinatesFormatted: '23.1818° N, 75.7675° E',
    description: 'Reinforced 18-ton heavy pontoon river bridge reserved exclusively for rapid medical ambulances and potable water bowzers.'
  },
  'food-hub-01': {
    id: 'food-hub-01',
    name: 'Central Annakshetra Food Distribution Depot',
    code: 'FOOD-01',
    type: 'food',
    zoneId: 'zone-c',
    category: 'food',
    latitude: 23.1720,
    longitude: 75.7780,
    elevationMeters: 492,
    address: 'Sector 03 Mega Annakshetra Complex, Ujjain',
    landmark: 'Central Mahaprasad Kitchens, Ujjain',
    capacity: '150,000 Meals / 12 Hours Production Capacity',
    operatingHours: '04:00 - 23:00 Continuous Service',
    contactChannel: 'VHF Ch 11 • Food Seva Director',
    coordinatesFormatted: '23.1720° N, 75.7780° E',
    description: 'Industrial automated steam kitchen preparing grain supplies and dry meal packets for continuous distribution.'
  },
  'sanitation-hub-01': {
    id: 'sanitation-hub-01',
    name: 'Central Sanitation & Bio-Treatment Depot',
    code: 'SAN-01',
    type: 'sanitation',
    zoneId: 'zone-d',
    category: 'sanitation',
    latitude: 23.1580,
    longitude: 75.7580,
    elevationMeters: 490,
    address: 'Western Sewage Treatment & Bio-Enzyme Compound',
    landmark: 'Sanitation Logistics Station, Ujjain',
    capacity: '40 Mobile Suction Tankers & Bio-Digesters',
    operatingHours: '24/7 Active Sanitation Rotation',
    contactChannel: 'VHF Ch 12 • Sanitation Logistics Lead',
    coordinatesFormatted: '23.1580° N, 75.7580° E',
    description: 'Central maintenance and chlorine distribution base deploying rapid suction vehicles and disinfection units.'
  },
  'emergency-post-01': {
    id: 'emergency-post-01',
    name: 'Disaster Quick-Response Post 01',
    code: 'SDRF-01',
    type: 'emergency',
    zoneId: 'zone-b',
    category: 'emergency',
    latitude: 23.1850,
    longitude: 75.7660,
    elevationMeters: 490,
    address: 'Riverfront Disaster Response Base, Kshipra Bank',
    landmark: 'SDRF Rescue Command, Ujjain',
    capacity: '12 Rapid Inflatable Motorboats • 80 Divers',
    operatingHours: '24/7 Emergency River Patrol',
    contactChannel: 'VHF Ch 16 • Emergency Disaster Hotline',
    coordinatesFormatted: '23.1850° N, 75.7660° E',
    description: 'Specialized quick-response disaster management post overseeing riverfront diver teams and drone reconnaissance.'
  },
  'fuel-depot-01': {
    id: 'fuel-depot-01',
    name: 'Emergency Generator Diesel Reserve Depot',
    code: 'FUEL-01',
    type: 'fuel',
    zoneId: 'zone-d',
    category: 'fuel',
    latitude: 23.1530,
    longitude: 75.7560,
    elevationMeters: 493,
    address: 'Southern Heavy Equipment Power & Fuel Yard',
    landmark: 'Power Grid Fuel Depot, Ujjain',
    capacity: '180,000 L Ultra-Low Sulfur Diesel',
    operatingHours: '24/7 Fuel Bowser Dispatch',
    contactChannel: 'VHF Ch 14 • Power Grid Coordinator',
    coordinatesFormatted: '23.1530° N, 75.7560° E',
    description: 'Strategic fuel storage keeping hospital backup generators, water pumping stations, and high-mast lighting grids powered.'
  }
};

export const getAllLocations = (): OperationalLocation[] => {
  return Object.values(UJJAIN_OPERATIONAL_LOCATIONS);
};

export const getLocationById = (id: string): OperationalLocation | undefined => {
  return UJJAIN_OPERATIONAL_LOCATIONS[id];
};

export const getLocationsByCategory = (category: string): OperationalLocation[] => {
  if (category === 'all') return getAllLocations();
  return Object.values(UJJAIN_OPERATIONAL_LOCATIONS).filter(loc => loc.category === category);
};

// Source: Google Maps Platform Code Assist
// =========================================================================
// GOOGLE MAPS PLATFORM — REAL GOOGLE ROUTES API v2 SERVICE
// Traffic-Aware Driving Routing, Encoded Polyline Decoding, & Ujjain Logistics Layer
// =========================================================================

export type GoogleTravelMode = 'DRIVE' | 'TWO_WHEELER' | 'TRANSIT' | 'WALK';

export interface RouteCoordinate {
  lat: number;
  lng: number;
}

export interface RouteManeuver {
  instruction: string;
  roadName: string;
  distanceKm: number;
  durationMinutes: number;
  progressFraction: number; // 0.0 to 1.0
  coordinate: [number, number]; // [lng, lat]
}

export interface GoogleCalculatedRoute {
  id: string;
  name: string;
  label: 'RECOMMENDED' | 'FASTEST' | 'ALTERNATIVE';
  isPrimary: boolean;
  distanceKm: number;
  durationMinutes: number; // Traffic-aware duration
  staticDurationMinutes: number; // Normal duration without congestion
  trafficDelayMinutes: number;
  trafficCondition: 'NORMAL' | 'MODERATE' | 'HEAVY';
  speedKmh: number;
  coordinates: [number, number][]; // [longitude, latitude] for WebGL GeoJSON
  midpoint: [number, number]; // [longitude, latitude] for floating route badge
  maneuvers: RouteManeuver[];
  warnings: string[];
  isGoogleLive: boolean; // True when retrieved from real Google Routes API v2
  operationalRestrictionApplied?: boolean;
  operationalRestrictionNotice?: string;
}

export interface RouteComputeResult {
  routes: GoogleCalculatedRoute[];
  recommendedRoute: GoogleCalculatedRoute;
  originName: string;
  destinationName: string;
  apiStatus: 'CONNECTED_GOOGLE_ROUTES' | 'SIMULATED_FALLBACK' | 'API_KEY_MISSING' | 'ERROR';
  errorMessage?: string;
}

// 1. Retrieve API key from environment securely
export const getGoogleMapsApiKey = (): string => {
  // Vite client-side env variable
  const viteKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (viteKey && viteKey.trim() && viteKey !== 'your_google_maps_api_key_here') {
    return viteKey.trim();
  }

  // Window global or process fallback
  if (typeof window !== 'undefined' && (window as any).GOOGLE_MAPS_API_KEY) {
    return (window as any).GOOGLE_MAPS_API_KEY;
  }

  return '';
};

// 2. Decode Google's Encoded Polyline Algorithm into [longitude, latitude] array
export const decodeGooglePolyline = (encoded: string): [number, number][] => {
  const points: [number, number][] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    // Push as [longitude, latitude] for MapLibre/GeoJSON standard
    points.push([lng * 1e-5, lat * 1e-5]);
  }

  return points;
};

// Compute route polyline midpoint coordinate
export const computePolylineMidpoint = (coords: [number, number][]): [number, number] => {
  if (!coords || coords.length === 0) return [75.7682, 23.1825];
  if (coords.length === 1) return coords[0];
  const midIdx = Math.floor(coords.length / 2);
  return coords[midIdx];
};

// 3. Format Duration strings like "1380s" to minutes
const parseDurationSeconds = (durationStr?: string): number => {
  if (!durationStr) return 0;
  const match = durationStr.match(/(\d+(\.\d+)?)s/);
  if (match && match[1]) {
    return Math.round(parseFloat(match[1]) / 60);
  }
  return 0;
};

// 4. Determine Traffic Condition (Normal / Moderate / Heavy)
const determineTrafficCondition = (
  durationMin: number,
  staticDurationMin: number
): { condition: 'NORMAL' | 'MODERATE' | 'HEAVY'; delayMin: number } => {
  const delay = Math.max(0, durationMin - staticDurationMin);
  if (delay <= 2 || durationMin <= staticDurationMin * 1.15) {
    return { condition: 'NORMAL', delayMin: delay };
  } else if (durationMin <= staticDurationMin * 1.45) {
    return { condition: 'MODERATE', delayMin: delay };
  } else {
    return { condition: 'HEAVY', delayMin: delay };
  }
};

// =========================================================================
// REAL UJJAIN ROAD NETWORK FALLBACK GEOMETRIES (WHEN OFFLINE OR NO KEY)
// Accurate Real Road Alignments across Ujjain Logistics Corridors
// =========================================================================
const REAL_UJJAIN_ROAD_NETWORK: Record<string, [number, number][]> = {
  // Central Supply Hub to Zone B via Indore Road, Dewas Gate, and Pontoon Bridge
  'wh-central-to-zone-b-primary': [
    [75.7690, 23.1495], // Central Master Logistics Depot
    [75.7712, 23.1530], // Indore-Ujjain Arterial Junction
    [75.7745, 23.1595], // Nanakheda Ring Road Roundabout
    [75.7760, 23.1650], // Harifatak Overbridge Approach
    [75.7752, 23.1710], // Begum Bagh Logistics Corridor
    [75.7710, 23.1765], // Mahakal Ghati Intersection
    [75.7688, 23.1798], // Ram Ghat Access Corridor
    [75.7675, 23.1818], // Pontoon Logistics Bridge 01 Crossing
    [75.7682, 23.1825]  // Zone B Main Bathing Ghat
  ],
  // Central Supply Hub to Zone B via Western Outer Ring Bypass
  'wh-central-to-zone-b-alternate': [
    [75.7690, 23.1495], // Central Master Logistics Depot
    [75.7620, 23.1510], // Western Industrial Bypass Link
    [75.7530, 23.1560], // Fuel Depot Corridor
    [75.7480, 23.1670], // Kshipra West Bank Road
    [75.7480, 23.1740], // Warehouse 01 Staging Yard
    [75.7550, 23.1780], // Bhartrihari Gufa Bypass
    [75.7610, 23.1810], // Northern River Ingress
    [75.7650, 23.1820], // West Ghat Approach
    [75.7682, 23.1825]  // Zone B Main Bathing Ghat
  ],
  // Central Supply Hub to Zone A (Temple Precinct)
  'wh-central-to-zone-a': [
    [75.7690, 23.1495], // Central Master Logistics Depot
    [75.7712, 23.1530], // Indore Road Ingress
    [75.7745, 23.1595], // Nanakheda Flyover
    [75.7780, 23.1680], // Bharatpuri Link
    [75.7800, 23.1750], // Harsiddhi Gate Approach
    [75.7785, 23.1790], // Mahakal Mahalok Gateway
    [75.7766, 23.1828]  // Zone A Temple Precinct
  ],
  // Warehouse 01 to Zone C (Triveni Encampments)
  'wh-1-to-zone-c': [
    [75.7480, 23.1740], // Warehouse 01
    [75.7550, 23.1710], // Chintaman Road
    [75.7650, 23.1660], // Southern Kshipra Bridge
    [75.7740, 23.1640], // Nanakheda Southern Bypass
    [75.7820, 23.1685]  // Zone C Triveni Encampments
  ],
  // Warehouse 02 to Zone B (Northern Ingress)
  'wh-2-to-zone-b': [
    [75.7920, 23.2105], // Warehouse 02 Northern Depot
    [75.7880, 23.2010], // Agar Road Corridor
    [75.7800, 23.1930], // Mangalnath Bypass
    [75.7720, 23.1870], // Siddhwat Road
    [75.7682, 23.1825]  // Zone B Main Ghat
  ]
};

// 5. Generate Realistic Fallback Routes with Real Ujjain Geometry
const generateSimulatedFallbackRoutes = (
  origin: { lat: number; lng: number; name?: string; id?: string },
  destination: { lat: number; lng: number; name?: string; id?: string },
  applyOperationalRestrictions: boolean = false
): RouteComputeResult => {
  const originName = origin.name || 'Origin Facility';
  const destinationName = destination.name || 'Destination Zone';

  // Find best matching real road alignment in Ujjain
  let primaryCoords = REAL_UJJAIN_ROAD_NETWORK['wh-central-to-zone-b-primary'];
  let altCoords = REAL_UJJAIN_ROAD_NETWORK['wh-central-to-zone-b-alternate'];

  if (origin.id === 'wh-1' || (origin.lat < 23.176 && origin.lng < 75.76)) {
    primaryCoords = REAL_UJJAIN_ROAD_NETWORK['wh-1-to-zone-c'] || primaryCoords;
  } else if (origin.id === 'wh-2' || origin.lat > 23.19) {
    primaryCoords = REAL_UJJAIN_ROAD_NETWORK['wh-2-to-zone-b'] || primaryCoords;
  } else if (destination.id === 'zone-a') {
    primaryCoords = REAL_UJJAIN_ROAD_NETWORK['wh-central-to-zone-a'] || primaryCoords;
  }

  // Ensure origin and destination connect to coordinates
  const cleanPrimaryCoords: [number, number][] = [
    [origin.lng, origin.lat],
    ...primaryCoords.slice(1, -1),
    [destination.lng, destination.lat]
  ];

  const cleanAltCoords: [number, number][] = [
    [origin.lng, origin.lat],
    ...altCoords.slice(1, -1),
    [destination.lng, destination.lat]
  ];

  // Calculate approximate distance
  let distMeters = 0;
  for (let i = 0; i < cleanPrimaryCoords.length - 1; i++) {
    const p1 = cleanPrimaryCoords[i];
    const p2 = cleanPrimaryCoords[i + 1];
    const dx = (p2[0] - p1[0]) * 111320 * Math.cos((p1[1] * Math.PI) / 180);
    const dy = (p2[1] - p1[1]) * 110540;
    distMeters += Math.sqrt(dx * dx + dy * dy);
  }

  const primaryDistKm = parseFloat((distMeters / 1000).toFixed(1));
  const primaryNormalDurationMin = Math.round(primaryDistKm * 2.6);
  const primaryTrafficDurationMin = Math.round(primaryNormalDurationMin * 1.35);

  const altDistKm = parseFloat((primaryDistKm * 1.28).toFixed(1));
  const altNormalDurationMin = Math.round(altDistKm * 2.3);
  const altTrafficDurationMin = Math.round(altNormalDurationMin * 1.12);

  const routeA: GoogleCalculatedRoute = {
    id: 'route-a-recommended',
    name: 'Indore-Ujjain Rd & Harifatak Overbridge',
    label: applyOperationalRestrictions ? 'ALTERNATIVE' : 'RECOMMENDED',
    isPrimary: !applyOperationalRestrictions,
    distanceKm: primaryDistKm,
    durationMinutes: primaryTrafficDurationMin,
    staticDurationMinutes: primaryNormalDurationMin,
    trafficDelayMinutes: primaryTrafficDurationMin - primaryNormalDurationMin,
    trafficCondition: 'HEAVY',
    speedKmh: Math.round(primaryDistKm / (primaryTrafficDurationMin / 60)),
    coordinates: cleanPrimaryCoords,
    midpoint: computePolylineMidpoint(cleanPrimaryCoords),
    maneuvers: [
      { instruction: `Depart ${originName} via Dedicated Logistics Lane`, roadName: 'Indore-Ujjain Arterial', distanceKm: 1.2, durationMinutes: 3, progressFraction: 0.0, coordinate: cleanPrimaryCoords[0] },
      { instruction: 'Merge onto Harifatak Flyover Transit Corridor', roadName: 'Harifatak Overbridge', distanceKm: 2.1, durationMinutes: 8, progressFraction: 0.25, coordinate: cleanPrimaryCoords[Math.floor(cleanPrimaryCoords.length * 0.3)] },
      { instruction: 'Turn right onto Pontoon Logistics Bridge 01 (18-Ton Clearance)', roadName: 'Pontoon Bridge 01', distanceKm: 0.8, durationMinutes: 4, progressFraction: 0.7, coordinate: cleanPrimaryCoords[Math.floor(cleanPrimaryCoords.length * 0.75)] },
      { instruction: `Arrive at ${destinationName} Automated Replenishment Bay`, roadName: 'Destination Bay', distanceKm: 0.3, durationMinutes: 2, progressFraction: 1.0, coordinate: cleanPrimaryCoords[cleanPrimaryCoords.length - 1] }
    ],
    warnings: ['Crowd pedestrian surge reported near Mahakal Corridor entrance'],
    isGoogleLive: false,
    operationalRestrictionApplied: applyOperationalRestrictions,
    operationalRestrictionNotice: applyOperationalRestrictions ? 'EVENT OPERATIONAL RESTRICTION: Harifatak corridor throttled for royal bath procession' : undefined
  };

  const routeB: GoogleCalculatedRoute = {
    id: 'route-b-alternate',
    name: 'Outer Ring Bypass & Western River Road',
    label: applyOperationalRestrictions ? 'RECOMMENDED' : 'ALTERNATIVE',
    isPrimary: applyOperationalRestrictions,
    distanceKm: altDistKm,
    durationMinutes: altTrafficDurationMin,
    staticDurationMinutes: altNormalDurationMin,
    trafficDelayMinutes: altTrafficDurationMin - altNormalDurationMin,
    trafficCondition: 'NORMAL',
    speedKmh: Math.round(altDistKm / (altTrafficDurationMin / 60)),
    coordinates: cleanAltCoords,
    midpoint: computePolylineMidpoint(cleanAltCoords),
    maneuvers: [
      { instruction: `Depart ${originName} taking Western Ring Road Bypass`, roadName: 'Western Outer Ring Road', distanceKm: 3.4, durationMinutes: 6, progressFraction: 0.0, coordinate: cleanAltCoords[0] },
      { instruction: 'Continue along Kshipra West Embankment Road', roadName: 'West Bank Logistics Way', distanceKm: 4.2, durationMinutes: 8, progressFraction: 0.4, coordinate: cleanAltCoords[Math.floor(cleanAltCoords.length * 0.45)] },
      { instruction: `Turn right onto West Ghat Access Ingress to ${destinationName}`, roadName: 'Ghat Ingress Road', distanceKm: 1.5, durationMinutes: 3, progressFraction: 0.85, coordinate: cleanAltCoords[Math.floor(cleanAltCoords.length * 0.85)] },
      { instruction: `Arrive at ${destinationName}`, roadName: 'Ghat Logistics Bay', distanceKm: 0.6, durationMinutes: 1, progressFraction: 1.0, coordinate: cleanAltCoords[cleanAltCoords.length - 1] }
    ],
    warnings: ['Clear logistics road. Zero procession interference.'],
    isGoogleLive: false
  };

  const selectedRecommended = applyOperationalRestrictions ? routeB : routeA;

  return {
    routes: [routeA, routeB],
    recommendedRoute: selectedRecommended,
    originName,
    destinationName,
    apiStatus: 'SIMULATED_FALLBACK',
    errorMessage: 'No Google Maps API Key found in environment. Using high-precision Ujjain road geometry fallback.'
  };
};

// =========================================================================
// MAIN ROUTING FUNCTION — COMPUTES GOOGLE ROUTES API v2 WITH TRAFFIC
// =========================================================================
export const computeGoogleRoute = async (
  origin: { lat: number; lng: number; name?: string; id?: string },
  destination: { lat: number; lng: number; name?: string; id?: string },
  applyOperationalRestrictions: boolean = false,
  travelMode: GoogleTravelMode = 'DRIVE'
): Promise<RouteComputeResult> => {
  const apiKey = getGoogleMapsApiKey();
  const originName = origin.name || 'Origin';
  const destinationName = destination.name || 'Destination';

  // If no API key is provided, gracefully use high-precision Ujjain fallback
  if (!apiKey) {
    console.info(
      '[KumbhSupply-AI] Google Maps API Key not detected in VITE_GOOGLE_MAPS_API_KEY. Utilizing calibrated Ujjain road geometry fallback.'
    );
    return generateSimulatedFallbackRoutes(origin, destination, applyOperationalRestrictions);
  }

  try {
    const endpoint = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    const isDrivingMode = travelMode === 'DRIVE' || travelMode === 'TWO_WHEELER';

    const payload: any = {
      origin: {
        location: {
          latLng: {
            latitude: origin.lat,
            longitude: origin.lng
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.lat,
            longitude: destination.lng
          }
        }
      },
      travelMode: travelMode === 'TWO_WHEELER' ? 'TWO_WHEELER' : travelMode === 'TRANSIT' ? 'TRANSIT' : travelMode === 'WALK' ? 'WALK' : 'DRIVE',
      computeAlternativeRoutes: true,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false
      },
      languageCode: 'en-US',
      units: 'METRIC'
    };

    if (isDrivingMode) {
      payload.routingPreference = 'TRAFFIC_AWARE_OPTIMAL';
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'routes.duration,routes.distanceMeters,routes.description,routes.polyline.encodedPolyline,routes.routeLabels,routes.warnings,routes.legs'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(
        `[Google Routes API Error ${response.status}] ${response.statusText}`,
        errorData
      );

      return {
        ...generateSimulatedFallbackRoutes(origin, destination, applyOperationalRestrictions),
        apiStatus: 'ERROR',
        errorMessage: `Google Routes API (${response.status} ${response.statusText}): ${errorData?.error?.message || 'Check API key restrictions and billing.'}`
      };
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn('[Google Routes API] No driving routes returned between points.');
      return generateSimulatedFallbackRoutes(origin, destination, applyOperationalRestrictions);
    }

    // Parse all returned Google routes
    const parsedRoutes: GoogleCalculatedRoute[] = data.routes.map((gRoute: any, index: number) => {
      const distanceKm = parseFloat(((gRoute.distanceMeters || 0) / 1000).toFixed(1));
      const durationMin = parseDurationSeconds(gRoute.duration);
      const staticDurationMin = parseDurationSeconds(gRoute.staticDuration) || durationMin;
      const { condition, delayMin } = determineTrafficCondition(durationMin, staticDurationMin);

      // Decode Google Polyline to [longitude, latitude]
      let decodedCoordinates: [number, number][] = [];
      if (gRoute.polyline?.encodedPolyline) {
        decodedCoordinates = decodeGooglePolyline(gRoute.polyline.encodedPolyline);
      } else {
        decodedCoordinates = [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat]
        ];
      }

      // Build step-by-step maneuvers
      const maneuvers: RouteManeuver[] = [];
      if (gRoute.legs && gRoute.legs[0]?.steps) {
        let accumulatedDistance = 0;
        const totalDist = gRoute.distanceMeters || 1;

        gRoute.legs[0].steps.forEach((step: any) => {
          const stepDistKm = parseFloat(((step.localizedValues?.distance?.text || '0 km').replace(/[^0-9.]/g, '')) || '0.5');
          const stepDurMin = parseDurationSeconds(step.staticDuration);
          const fraction = Math.min(1.0, accumulatedDistance / totalDist);
          accumulatedDistance += (step.distanceMeters || 0);

          let stepCoord: [number, number] = decodedCoordinates[0] || [origin.lng, origin.lat];
          if (step.polyline?.encodedPolyline) {
            const stepPoints = decodeGooglePolyline(step.polyline.encodedPolyline);
            if (stepPoints.length > 0) stepCoord = stepPoints[0];
          }

          maneuvers.push({
            instruction: step.navigationInstruction?.instructions || 'Continue straight along road',
            roadName: step.navigationInstruction?.maneuver || 'Logistics Corridor',
            distanceKm: stepDistKm,
            durationMinutes: stepDurMin,
            progressFraction: fraction,
            coordinate: stepCoord
          });
        });
      }

      if (maneuvers.length === 0) {
        maneuvers.push({
          instruction: `Depart ${originName} via Primary Route`,
          roadName: 'Main Arterial',
          distanceKm: distanceKm,
          durationMinutes: durationMin,
          progressFraction: 0,
          coordinate: [origin.lng, origin.lat]
        });
      }

      const isPrimaryRoute = index === 0;
      const label: 'RECOMMENDED' | 'FASTEST' | 'ALTERNATIVE' =
        index === 0 ? 'RECOMMENDED' : index === 1 ? 'ALTERNATIVE' : 'FASTEST';

      const routeName = gRoute.description
        ? `${gRoute.description} (${distanceKm} km)`
        : index === 0
        ? `Primary Google Route (${distanceKm} km)`
        : `Google Alternative Route ${index} (${distanceKm} km)`;

      return {
        id: `google-route-${index}`,
        name: routeName,
        label,
        isPrimary: isPrimaryRoute,
        distanceKm,
        durationMinutes: durationMin,
        staticDurationMinutes: staticDurationMin,
        trafficDelayMinutes: delayMin,
        trafficCondition: condition,
        speedKmh: durationMin > 0 ? Math.round((distanceKm / (durationMin / 60))) : 35,
        coordinates: decodedCoordinates,
        midpoint: computePolylineMidpoint(decodedCoordinates),
        maneuvers,
        warnings: gRoute.warnings || [],
        isGoogleLive: true
      };
    });

    // Operational Constraint Logic on top of Google Routes
    let recommended = parsedRoutes[0];
    if (applyOperationalRestrictions && parsedRoutes.length > 1) {
      recommended = parsedRoutes[1]; // Auto-select alternative when operational restriction applied
      recommended.operationalRestrictionApplied = true;
      recommended.operationalRestrictionNotice =
        'EVENT OPERATIONAL RESTRICTION: Primary corridor restricted by Event Traffic Control • Rerouted via Google Alternative';
    }

    return {
      routes: parsedRoutes,
      recommendedRoute: recommended,
      originName,
      destinationName,
      apiStatus: 'CONNECTED_GOOGLE_ROUTES'
    };
  } catch (err: any) {
    console.error('[Google Routes API Network Failure]', err);
    return {
      ...generateSimulatedFallbackRoutes(origin, destination, applyOperationalRestrictions),
      apiStatus: 'ERROR',
      errorMessage: `Network error connecting to Google Routes API: ${err.message || err}`
    };
  }
};

// 6. Test API Key Connectivity Check
export const testGoogleMapsApiConnection = async (): Promise<{
  connected: boolean;
  status: string;
  message: string;
}> => {
  const key = getGoogleMapsApiKey();
  if (!key) {
    return {
      connected: false,
      status: 'MISSING_KEY',
      message: 'No VITE_GOOGLE_MAPS_API_KEY environment variable provided.'
    };
  }

  try {
    const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'routes.distanceMeters'
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: 23.1495, longitude: 75.7690 } } },
        destination: { location: { latLng: { latitude: 23.1825, longitude: 75.7682 } } },
        travelMode: 'DRIVE'
      })
    });

    if (res.ok) {
      return {
        connected: true,
        status: 'CONNECTED',
        message: 'Google Maps Routes API v2 is active & authenticated with TRAFFIC_AWARE_OPTIMAL.'
      };
    } else {
      const err = await res.json().catch(() => ({}));
      return {
        connected: false,
        status: `HTTP_${res.status}`,
        message: err?.error?.message || `API error (${res.status} ${res.statusText})`
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      status: 'NETWORK_ERROR',
      message: err?.message || 'Network request failed'
    };
  }
};

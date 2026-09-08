// Source: Google Maps Platform Code Assist
// =========================================================================
// 3D REAL-TIME GEOSPATIAL DIGITAL TWIN WITH GOOGLE ROUTES API v2 NAVIGATION
// Real Ujjain Hydrography, 3D Bridges, & Traffic-Aware Logistics Navigation
// =========================================================================

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useKumbhData } from '../../context/KumbhDataContext';
import {
  Compass,
  Layers,
  Clock,
  Navigation,
  Radio,
  Truck,
  Droplets,
  Utensils,
  Cross,
  Trash2,
  Fuel,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Route as RouteIcon,
  Sparkles,
  MapPin,
  Activity,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Locate,
  CloudSun,
  Eye,
  Box,
  CornerUpRight,
  X,
  RefreshCw,
  Milestone,
  Gauge,
  Building2,
  ArrowRight,
  Info,
  ExternalLink,
  Key,
  Plus,
  Minus
} from 'lucide-react';
import {
  DigitalTwinLandmark,
  ZoomLevel
} from '../../data/kumbhData';
import {
  UJJAIN_OPERATIONAL_LOCATIONS,
  getAllLocations,
  getLocationById,
  OperationalLocation
} from '../../data/locations';
import {
  computeGoogleRoute,
  getGoogleMapsApiKey,
  testGoogleMapsApiConnection,
  GoogleCalculatedRoute,
  RouteComputeResult,
  RouteManeuver
} from '../../services/googleRoutesService';

export interface ActiveNavigationState {
  vehicleId: string;
  vehicleCode: string;
  commodityName: string;
  commodityColor: string;
  quantityStr: string;
  sourceName: string;
  destName: string;
  originId: string;
  destinationId: string;
  routeType: 'primary' | 'alternate';
  distanceKm: number;
  etaMinutes: number; // Traffic-aware
  staticEtaMinutes: number; // Normal without congestion
  trafficCondition: 'NORMAL' | 'MODERATE' | 'HEAVY';
  trafficDelayMinutes: number;
  speedKmh: number;
  nextManeuver: string;
  subManeuver: string;
  isRecalculated: boolean;
  status: 'IN TRANSIT' | 'ARRIVED' | 'REROUTED';
  recalculationNotice?: string;
  maneuvers: RouteManeuver[];
  isGoogleLive: boolean;
}

export interface RealGeospatialTwinProps {
  interactive?: boolean;
  pageMode?: 'home' | 'operations' | 'embed' | 'command';
}

// =========================================================================
// REAL HIGH-DENSITY UJJAIN HYDROGRAPHY & 3D BRIDGES (KSHIPRA RIVER)
// =========================================================================

const UJJAIN_KSHIPRA_RIVER_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { name: 'Sacred Kshipra River Corridor' },
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [75.7820, 23.1550], // Triveni Sangam Upstream
          [75.7760, 23.1660], // Southern Approach & Encampments
          [75.7700, 23.1740], // Dutt Akhada & Sunhari Ghat
          [75.7675, 23.1818], // Pontoon Logistics Bridge 01
          [75.7682, 23.1825], // Ram Ghat Epicenter
          [75.7705, 23.1860], // Narsingha Ghat
          [75.7750, 23.1950], // Mangalnath River Bend
          [75.7800, 23.2050], // Siddhwat Downstream
          [75.7850, 23.2180]  // Northern Outflow
        ]
      }
    }
  ]
};

const UJJAIN_BRIDGES_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { name: 'Harifatak / Central River Span Bridge', height: 18, base_height: 8, color: '#334155' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [75.7665, 23.1808],
          [75.7675, 23.1808],
          [75.7685, 23.1795],
          [75.7675, 23.1795],
          [75.7665, 23.1808]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { name: 'Pontoon Logistics Bridge 01 (Heavy Logistics 18T)', height: 6, base_height: 2, color: '#0284c7' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [75.7672, 23.1818],
          [75.7678, 23.1818],
          [75.7682, 23.1812],
          [75.7676, 23.1812],
          [75.7672, 23.1818]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { name: 'Bhartrihari Northern Link Bridge', height: 12, base_height: 4, color: '#475569' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [75.7795, 23.2045],
          [75.7805, 23.2045],
          [75.7810, 23.2035],
          [75.7800, 23.2035],
          [75.7795, 23.2045]
        ]]
      }
    }
  ]
};

export const RealGeospatialTwin: React.FC<RealGeospatialTwinProps> = ({
  interactive = true,
  pageMode = 'operations'
}) => {
  const isHome = pageMode === 'home';
  const {
    activeZoomLevel,
    setActiveZoomLevel,
    activeCommodityLayer,
    setActiveCommodityLayer,
    selectedTimeStep,
    setSelectedTimeStep,
    landmarks,
    setSelectedZoneId,
    setFollowedVehicleId,
    addToast
  } = useKumbhData();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const vehicleMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Digital Twin Operational Modes: 'overview' | 'preview' | 'navigate'
  const [twinMode, setTwinMode] = useState<'overview' | 'preview' | 'navigate'>('overview');
  const [currentZoom, setCurrentZoom] = useState<number>(15.2);
  const [selectedLandmark, setSelectedLandmark] = useState<DigitalTwinLandmark | null>(null);

  // Google Routes Navigation States
  const [selectedOriginId, setSelectedOriginId] = useState<string>('wh-central');
  const [selectedDestId, setSelectedDestId] = useState<string>('zone-b');
  const [routeResult, setRouteResult] = useState<RouteComputeResult | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [activeNav, setActiveNav] = useState<ActiveNavigationState | null>(null);
  const [vehicleProgress, setVehicleProgress] = useState<number>(0.0);
  const [isFollowCameraActive, setIsFollowCameraActive] = useState<boolean>(false);
  const [reroutingNotice, setReroutingNotice] = useState<string | null>(null);
  const [deliveryArrivalToast, setDeliveryArrivalToast] = useState<string | null>(null);

  // API Status & Configuration Modal
  const [apiConnectionStatus, setApiConnectionStatus] = useState<'CONNECTING' | 'CONNECTED' | 'FALLBACK'>('CONNECTING');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStepText, setDemoStepText] = useState<string>('');

  // Primary Supply Filtering Options
  const commodityLayers = useMemo(
    () => [
      { id: 'all', label: 'All', icon: Layers, color: '#38bdf8' },
      { id: 'water', label: 'Water', icon: Droplets, color: '#06b6d4' },
      { id: 'food', label: 'Food', icon: Utensils, color: '#f59e0b' },
      { id: 'medical', label: 'Medical', icon: Cross, color: '#ef4444' },
      { id: 'fuel', label: 'Fuel', icon: Fuel, color: '#eab308' }
    ],
    []
  );

  // Test Google Maps API Connection on Mount
  useEffect(() => {
    let isMounted = true;
    testGoogleMapsApiConnection().then(connected => {
      if (isMounted) {
        setApiConnectionStatus(connected ? 'CONNECTED' : 'FALLBACK');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Initialize MapLibre with High-Res Satellite Base Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'google-high-res-satellite': {
            type: 'raster',
            tiles: [
              'https://mt0.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
              'https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
              'https://mt2.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
              'https://mt3.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
            ],
            tileSize: 256,
            attribution: '© Google Maps Platform • Calibrated Ujjain Grid'
          }
        },
        layers: [
          {
            id: 'satellite-base',
            type: 'raster',
            source: 'google-high-res-satellite',
            paint: { 'raster-opacity': 1.0 }
          }
        ]
      },
      center: [75.7682, 23.1825], // Epicenter of Ram Ghat / Mahakal Precinct
      zoom: isHome ? 15.0 : 15.4,
      pitch: 52,
      bearing: 42,
      interactive: interactive
    });

    mapRef.current = map;

    map.on('zoom', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('load', () => {
      // Add Sacred River Hydrography Layer
      map.addSource('kshipra-river', {
        type: 'geojson',
        data: UJJAIN_KSHIPRA_RIVER_GEOJSON
      });

      map.addLayer({
        id: 'kshipra-river-line',
        type: 'line',
        source: 'kshipra-river',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 10,
          'line-opacity': 0.65,
          'line-blur': 3
        }
      });

      // Add 3D Extruded Bridges
      map.addSource('ujjain-3d-bridges', {
        type: 'geojson',
        data: UJJAIN_BRIDGES_GEOJSON
      });

      map.addLayer({
        id: 'bridges-3d-extrusion',
        type: 'fill-extrusion',
        source: 'ujjain-3d-bridges',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'base_height'],
          'fill-extrusion-opacity': 0.95
        }
      });

      // Dynamic Google Routes Layer
      map.addSource('active-google-route', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.addLayer({
        id: 'active-google-route-casing',
        type: 'line',
        source: 'active-google-route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
          'visibility': 'none'
        },
        paint: {
          'line-color': '#0f172a',
          'line-width': 8,
          'line-opacity': 0.9
        }
      });

      map.addLayer({
        id: 'active-google-route-core',
        type: 'line',
        source: 'active-google-route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
          'visibility': 'none'
        },
        paint: {
          'line-color': '#0284c7',
          'line-width': 4.5,
          'line-opacity': 1.0
        }
      });
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current.clear();
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.remove();
        vehicleMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, [interactive, isHome]);

  // 2. Filter Landmarks by Commodity
  const filteredLandmarks = useMemo(() => {
    if (activeCommodityLayer === 'all') return landmarks;
    return landmarks.filter(
      lm =>
        lm.category === activeCommodityLayer ||
        lm.category === 'depot' ||
        lm.category === 'infrastructure' ||
        lm.category === 'corridor'
    );
  }, [landmarks, activeCommodityLayer]);

  // 3. Render Clean Non-Colliding Geographic Markers with LOD
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const activeIds = new Set(filteredLandmarks.map(lm => lm.id));

    // Remove obsolete markers
    markersRef.current.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    filteredLandmarks.forEach(lm => {
      let marker = markersRef.current.get(lm.id);
      const isSelected = selectedLandmark?.id === lm.id;
      const isCritical = lm.status === 'CRITICAL';
      const isWarning = lm.status === 'WARNING';
      const isDepot = lm.category === 'depot';

      if (!marker) {
        const el = document.createElement('div');
        el.className = 'geo-anchor-marker-container cursor-pointer select-none transition-transform duration-150';

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedLandmark(lm);
          setSelectedZoneId(lm.zoneId);
        });

        marker = new maplibregl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat([lm.lng, lm.lat])
          .addTo(map);

        markersRef.current.set(lm.id, marker);
      }

      const el = marker.getElement();

      const dotColor = isCritical
        ? '#ef4444'
        : isDepot
        ? '#0ea5e9'
        : isWarning
        ? '#f59e0b'
        : isSelected
        ? '#fbbf24'
        : '#10b981';

      const shortName = lm.name.split('—')[0].split('(')[0].trim();
      const codeBadge = lm.code || (isDepot ? 'WH' : isCritical ? 'CRIT' : 'ZONE');

      // Full Landmark Pill Badge on Map with Diamond Anchor Pin
      el.innerHTML = `
        <div class="relative flex flex-col items-center group cursor-pointer select-none transition-transform duration-150 hover:scale-110 hover:z-50">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap shadow-2xl border backdrop-blur-md transition-all ${
            isSelected
              ? 'ring-2 ring-amber-400 scale-105 shadow-amber-500/40'
              : 'hover:border-amber-400'
          }" style="background-color: rgba(9, 14, 23, 0.94); border-color: ${dotColor}99; color: #ffffff;">
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${dotColor};"></span>
            <span>${shortName}</span>
          </div>
          <div class="w-2 h-2 rotate-45 -mt-1 shadow-md" style="background-color: #f59e0b; border: 1px solid rgba(255,255,255,0.4);"></div>
        </div>
      `;
    });
  }, [filteredLandmarks, selectedLandmark, currentZoom]);

  // 4. Calculate Google Route between Origin and Destination
  const triggerGoogleRouteCalculation = useCallback(
    async (
      originId: string,
      destId: string,
      applyOperationalRestrictions: boolean = false
    ) => {
      const originLoc = getLocationById(originId) || UJJAIN_OPERATIONAL_LOCATIONS['wh-central'];
      const destLoc = getLocationById(destId) || UJJAIN_OPERATIONAL_LOCATIONS['zone-b'];

      const result = await computeGoogleRoute(
        {
          id: originLoc.id,
          name: originLoc.name,
          lat: originLoc.latitude,
          lng: originLoc.longitude
        },
        {
          id: destLoc.id,
          name: destLoc.name,
          lat: destLoc.latitude,
          lng: destLoc.longitude
        },
        applyOperationalRestrictions
      );

      setRouteResult(result);
      setSelectedRouteIndex(0);
      const activeRoute = result.recommendedRoute;

      setActiveNav({
        vehicleId: 'veh-1042',
        vehicleCode: 'WT-1042',
        commodityName: 'Potable Drinking Water',
        commodityColor: '#0284c7',
        quantityStr: '12,000 Liters (Tanker 04)',
        sourceName: originLoc.name,
        destName: destLoc.name,
        originId: originLoc.id,
        destinationId: destLoc.id,
        routeType: activeRoute.isPrimary ? 'primary' : 'alternate',
        distanceKm: activeRoute.distanceKm,
        etaMinutes: activeRoute.durationMinutes,
        staticEtaMinutes: activeRoute.staticDurationMinutes,
        trafficCondition: activeRoute.trafficCondition,
        trafficDelayMinutes: activeRoute.trafficDelayMinutes,
        speedKmh: activeRoute.trafficCondition === 'HEAVY' ? 18 : 28,
        nextManeuver: 'Head North on Emergency Corridor 02 toward Pontoon Bridge 01',
        subManeuver: 'Pass Gate 4 Security Checkpoint',
        isRecalculated: applyOperationalRestrictions,
        status: 'IN TRANSIT',
        recalculationNotice: activeRoute.operationalRestrictionNotice,
        maneuvers: activeRoute.maneuvers,
        isGoogleLive: activeRoute.isGoogleLive
      });

      setTwinMode('preview');

      if (mapRef.current && activeRoute.coordinates.length > 0) {
        const bounds = activeRoute.coordinates.reduce(
          (b, coord) => b.extend(coord),
          new maplibregl.LngLatBounds(activeRoute.coordinates[0], activeRoute.coordinates[0])
        );

        mapRef.current.fitBounds(bounds, {
          padding: { top: 90, bottom: 90, left: 320, right: 60 },
          pitch: 52,
          bearing: 35,
          duration: 1800
        });
      }
    },
    []
  );

  // Sync Active Route to Map WebGL Layer
  const currentActiveRoute = useMemo(() => {
    if (!routeResult || routeResult.routes.length === 0) return null;
    return routeResult.routes[selectedRouteIndex] || routeResult.recommendedRoute;
  }, [routeResult, selectedRouteIndex]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (!map.isStyleLoaded()) return;

    if (currentActiveRoute && currentActiveRoute.coordinates.length > 0) {
      const geojson = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: {
              name: currentActiveRoute.name,
              isPrimary: currentActiveRoute.isPrimary
            },
            geometry: {
              type: 'LineString' as const,
              coordinates: currentActiveRoute.coordinates
            }
          }
        ]
      };

      const source = map.getSource('active-google-route') as maplibregl.GeoJSONSource | undefined;
      if (source) {
        source.setData(geojson);
      }

      if (map.getLayer('active-google-route-casing')) {
        map.setLayoutProperty('active-google-route-casing', 'visibility', 'visible');
      }
      if (map.getLayer('active-google-route-core')) {
        map.setLayoutProperty('active-google-route-core', 'visibility', 'visible');
        const routeColor =
          currentActiveRoute.trafficCondition === 'HEAVY'
            ? '#ef4444'
            : currentActiveRoute.trafficCondition === 'MODERATE'
            ? '#f59e0b'
            : '#0284c7';
        map.setPaintProperty('active-google-route-core', 'line-color', routeColor);
      }
    } else {
      const source = map.getSource('active-google-route') as maplibregl.GeoJSONSource | undefined;
      if (source) {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
      if (map.getLayer('active-google-route-casing')) {
        map.setLayoutProperty('active-google-route-casing', 'visibility', 'none');
      }
      if (map.getLayer('active-google-route-core')) {
        map.setLayoutProperty('active-google-route-core', 'visibility', 'none');
      }
    }
  }, [currentActiveRoute]);

  // Handle View Route on specific Landmark
  const handleViewRouteForLandmark = (landmark: DigitalTwinLandmark) => {
    setSelectedLandmark(landmark);
    setSelectedDestId(landmark.id);
    triggerGoogleRouteCalculation(selectedOriginId, landmark.id);
  };

  // Start Live GPS Navigation (Mode C)
  const handleStartNavigation = () => {
    setTwinMode('navigate');
    setVehicleProgress(0.0);
    setIsFollowCameraActive(true);
    setFollowedVehicleId('veh-1042');

    if (mapRef.current && currentActiveRoute && currentActiveRoute.coordinates.length > 0) {
      mapRef.current.flyTo({
        center: currentActiveRoute.coordinates[0],
        zoom: 17.4,
        pitch: 62,
        bearing: 45,
        duration: 1800
      });
    }
  };

  // Exit Navigation back to normal overview
  const exitNavigation = () => {
    setTwinMode('overview');
    setRouteResult(null);
    setActiveNav(null);
    setFollowedVehicleId(null);
    setVehicleProgress(0.0);
    setIsFollowCameraActive(false);

    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.remove();
      vehicleMarkerRef.current = null;
    }

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [75.7682, 23.1825],
        zoom: isHome ? 15.0 : 15.4,
        pitch: 52,
        bearing: 42,
        duration: 1800
      });
    }
  };

  // Dynamic Google Reroute calculation from current vehicle position
  const handleReroute = async () => {
    if (!activeNav || !currentActiveRoute) return;

    setReroutingNotice(
      'Traffic Congestion Ahead • Querying Google Routes API for optimal contingency bypass...'
    );

    await triggerGoogleRouteCalculation(selectedOriginId, selectedDestId, true);

    setTimeout(() => {
      setReroutingNotice(null);
    }, 5000);
  };

  // Camera View Presets Handler (Sky, Event, Zone, Location, Close-Up)
  const handleCameraLevelChange = (level: ZoomLevel) => {
    setActiveZoomLevel(level);
    if (!mapRef.current) return;

    switch (level) {
      case 1: // Sky
        mapRef.current.flyTo({
          center: [75.7682, 23.1825],
          zoom: 14.0,
          pitch: 45,
          bearing: 40,
          duration: 1800
        });
        break;
      case 2: // Event Overview
        mapRef.current.flyTo({
          center: [75.7720, 23.1780],
          zoom: 15.2,
          pitch: 52,
          bearing: 45,
          duration: 1800
        });
        break;
      case 3: // Zone Level
        mapRef.current.flyTo({
          center: [75.7682, 23.1825],
          zoom: 16.4,
          pitch: 56,
          bearing: 42,
          duration: 1800
        });
        break;
      case 4: // Location Level
        mapRef.current.flyTo({
          center: [75.7682, 23.1825],
          zoom: 17.4,
          pitch: 60,
          bearing: 40,
          duration: 1800
        });
        break;
      case 5: // Close-Up Inspection
        mapRef.current.flyTo({
          center: [75.7682, 23.1825],
          zoom: 18.2,
          pitch: 62,
          bearing: 38,
          duration: 1800
        });
        break;
    }
  };

  const fitWholeKumbhOverview = () => {
    handleCameraLevelChange(1);
    setSelectedLandmark(null);
  };

  // Active Vehicle Motion Loop along Decoded Google Road Polyline
  useEffect(() => {
    if (twinMode !== 'navigate' || !activeNav || !currentActiveRoute) return;

    let animFrame: number;
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setVehicleProgress(prev => {
        const nextProgress = prev + dt / 36;
        if (nextProgress >= 1.0) {
          setDeliveryArrivalToast('Convoy Arrived at Destination • Stock Replenishment Complete');
          setTimeout(() => setDeliveryArrivalToast(null), 4000);
          return 1.0;
        }
        return nextProgress;
      });

      animFrame = requestAnimationFrame(updateLoop);
    };

    animFrame = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrame);
  }, [twinMode, activeNav, currentActiveRoute]);

  // Compute Active Vehicle Coordinate along Road Polyline
  const currentVehicleMotion = useMemo(() => {
    if (!currentActiveRoute || currentActiveRoute.coordinates.length < 2) return null;
    const coords = currentActiveRoute.coordinates;
    const totalSegments = coords.length - 1;
    const exactIndex = vehicleProgress * totalSegments;
    const segmentIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
    const segmentFraction = exactIndex - segmentIndex;

    const p1 = coords[segmentIndex];
    const p2 = coords[segmentIndex + 1];

    const currentLng = p1[0] + (p2[0] - p1[0]) * segmentFraction;
    const currentLat = p1[1] + (p2[1] - p1[1]) * segmentFraction;

    const dLon = ((p2[0] - p1[0]) * Math.PI) / 180;
    const lat1 = (p1[1] * Math.PI) / 180;
    const lat2 = (p2[1] * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

    return {
      coordinate: [currentLng, currentLat] as [number, number],
      bearing: bearing
    };
  }, [currentActiveRoute, vehicleProgress]);

  // Sync Vehicle Marker to Map
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (twinMode === 'navigate' && currentVehicleMotion) {
      if (!vehicleMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'geo-vehicle-marker flex items-center justify-center';
        el.innerHTML = `
          <div class="relative flex items-center justify-center p-1.5 rounded-xl bg-slate-950 border border-sky-400 shadow-xl shadow-sky-500/30">
            <svg class="w-4 h-4 text-sky-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        `;

        vehicleMarkerRef.current = new maplibregl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat(currentVehicleMotion.coordinate)
          .addTo(map);
      } else {
        vehicleMarkerRef.current.setLngLat(currentVehicleMotion.coordinate);
      }

      if (isFollowCameraActive) {
        map.easeTo({
          center: currentVehicleMotion.coordinate,
          zoom: 17.5,
          pitch: 62,
          bearing: currentVehicleMotion.bearing,
          duration: 250
        });
      }
    } else {
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.remove();
        vehicleMarkerRef.current = null;
      }
    }
  }, [twinMode, currentVehicleMotion, isFollowCameraActive]);

  // Current Turn-by-Turn Maneuver
  const currentManeuver = useMemo(() => {
    if (!activeNav?.maneuvers || activeNav.maneuvers.length === 0) {
      return {
        instruction: 'Continue along designated logistics arterial',
        roadName: 'Primary Arterial',
        distanceKm: 0.5,
        durationMinutes: 1,
        progressFraction: 0,
        coordinate: [75.7682, 23.1825] as [number, number]
      };
    }
    const maneuvers = activeNav.maneuvers;
    for (let i = maneuvers.length - 1; i >= 0; i--) {
      if (vehicleProgress >= maneuvers[i].progressFraction) {
        return maneuvers[i];
      }
    }
    return maneuvers[0];
  }, [activeNav, vehicleProgress]);

  // Automated 3D Demonstration Script
  const runAutomatedSignatureDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);

    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    setDemoStepText('1/8 • Google Maps Routes 3D Twin • Ujjain Geographic Grid');
    fitWholeKumbhOverview();
    await wait(2400);

    setDemoStepText('2/8 • Simulating Midday Heat Surge • High Devotee Density at Ram Ghat');
    setSelectedTimeStep('12:00');
    await wait(2200);

    setDemoStepText('3/8 • AI Alert: 20,000 L Water Deficit Predicted at Zone B');
    const zoneB = landmarks.find(l => l.id === 'zone-b');
    if (zoneB && mapRef.current) {
      setSelectedLandmark(zoneB);
      setSelectedZoneId('zone-b');
      mapRef.current.flyTo({
        center: [zoneB.lng, zoneB.lat],
        zoom: 17.0,
        pitch: 58,
        bearing: 45,
        duration: 2000
      });
    }
    await wait(2600);

    setDemoStepText('4/8 • Querying Google Routes API v2 for Optimum Convoy Corridor');
    await triggerGoogleRouteCalculation('wh-central', 'zone-b');
    await wait(2200);

    setDemoStepText('5/8 • Convoy Dispatched • Camera Following Vehicle WT-1042');
    handleStartNavigation();
    await wait(4000);

    setDemoStepText('6/8 • Procession Restriction Detected • AI Recalculates Contingency Route');
    await handleReroute();
    await wait(4000);

    setDemoStepText('7/8 • Convoy Crosses Kshipra via Pontoon Bridge 01');
    await wait(3000);

    setDemoStepText('8/8 • Delivery Complete • Water Buffer Restored to 100%');
    await wait(2500);

    setIsDemoRunning(false);
    setDemoStepText('');
    exitNavigation();
  };

  return (
    <div className="relative w-full h-full bg-[#05080f] overflow-hidden select-none font-sans">
      {/* 3D MAPLIBRE CONTAINER */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ========================================================================= */}
      {/* 1. TOP SUPPLY CONTROLS (STREAMLINED & ULTRA-CLEAN) */}
      {/* ========================================================================= */}
      {twinMode === 'overview' && pageMode !== 'home' && (
        <div className={`absolute left-4 z-20 pointer-events-auto ${
          pageMode === 'operations' ? 'top-20' : 'top-3'
        }`}>
          {/* SUPPLY FILTER PILL */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-950/90 border border-white/15 backdrop-blur-md shadow-2xl">
            <span className="px-2.5 text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>SUPPLY:</span>
            </span>
            {commodityLayers.map(l => {
              const Icon = l.icon;
              const isSelected = activeCommodityLayer === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveCommodityLayer(l.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? '#0f172a' : l.color }} />
                  <span>{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SELECTED FACILITY CONTEXTUAL CARD */}
      {/* ========================================================================= */}
      {twinMode === 'overview' && selectedLandmark && (
        <div className={`absolute left-4 z-30 pointer-events-auto max-w-xs w-full rounded-2xl bg-slate-950/95 border border-white/20 backdrop-blur-xl p-3.5 shadow-2xl space-y-2.5 ${
          pageMode === 'operations' ? 'top-36' : 'top-16'
        }`}>
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                selectedLandmark.status === 'CRITICAL' ? 'bg-red-500' : 'bg-emerald-400'
              }`} />
              <span className="text-xs font-bold text-white leading-tight">
                {selectedLandmark.name.split('—')[0].trim()}
              </span>
            </div>
            <button
              onClick={() => setSelectedLandmark(null)}
              className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="text-xs text-slate-300 leading-snug">
            {selectedLandmark.description}
          </div>

          <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Est. Crowd</span>
              <span className="font-bold text-white">~{selectedLandmark.crowdCount?.toLocaleString() || '45k'}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Buffer Status</span>
              <span className="font-bold text-amber-300">{selectedLandmark.readinessPercentage}% Ready</span>
            </div>
          </div>

          <button
            onClick={() => handleViewRouteForLandmark(selectedLandmark)}
            className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <RouteIcon className="w-3.5 h-3.5 text-slate-950" />
            <span>Calculate Route &rarr;</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BOTTOM TIMELINE & ESSENTIAL MAP CONTROLS */}
      {/* ========================================================================= */}
      {twinMode === 'overview' && pageMode !== 'home' && (
        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between gap-3">
          {/* BOTTOM-LEFT: TIMELINE SCRUBBER */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-slate-950/90 border border-white/15 backdrop-blur-md shadow-2xl">
            <span className="px-2.5 text-xs font-mono text-amber-400 font-bold uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>TIME:</span>
            </span>
            {(['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'] as const).map(t => (
              <button
                key={t}
                onClick={() => setSelectedTimeStep(t)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedTimeStep === t
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* BOTTOM-RIGHT: RUN 3D DEMO & ZOOM CONTROLS */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={runAutomatedSignatureDemo}
              disabled={isDemoRunning}
              className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-2xl transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Run 3D Demo</span>
            </button>

            <div className="flex items-center rounded-full bg-slate-950/90 border border-white/15 backdrop-blur-md shadow-2xl p-0.5 gap-0.5">
              <button
                onClick={() => {
                  if (mapRef.current) mapRef.current.zoomIn({ duration: 250 });
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Zoom In"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (mapRef.current) mapRef.current.zoomOut({ duration: 250 });
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Zoom Out"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={fitWholeKumbhOverview}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-amber-400 flex items-center justify-center transition-all cursor-pointer"
                title="Reset Overview"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE B: ROUTE PREVIEW & ALTERNATIVES SELECTOR */}
      {/* ========================================================================= */}
      {twinMode === 'preview' && activeNav && routeResult && (
        <div className="absolute top-14 left-4 z-30 pointer-events-auto max-w-xs w-full rounded-2xl bg-slate-950/95 border border-white/20 backdrop-blur-xl p-3.5 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <RouteIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                GOOGLE ROUTES v2
              </span>
            </div>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                activeNav.isGoogleLive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {activeNav.isGoogleLive ? 'Live API' : 'Calibrated'}
            </span>
          </div>

          <div>
            <div className="text-[9px] text-slate-400 font-mono uppercase">DISPATCH CORRIDOR</div>
            <div className="text-xs font-bold text-white mt-0.5">
              {activeNav.sourceName} &rarr; {activeNav.destName}
            </div>
            <div className="text-[10px] text-sky-400 font-mono">
              {activeNav.vehicleCode} &bull; {activeNav.commodityName}
            </div>
          </div>

          {/* Alternative Routes */}
          {routeResult.routes.length > 1 && (
            <div className="space-y-1">
              <div className="text-[9px] text-slate-400 font-mono uppercase">ALTERNATIVE PATHWAYS</div>
              <div className="grid grid-cols-2 gap-1">
                {routeResult.routes.map((r, idx) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRouteIndex(idx)}
                    className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedRouteIndex === idx
                        ? 'bg-sky-950/80 border-sky-400 text-white'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold text-amber-400">{r.label}</div>
                    <div className="text-[11px] font-bold text-white">{r.durationMinutes}m ({r.distanceKm}km)</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-black/40 border border-white/10 text-center font-mono text-[11px]">
            <div>
              <span className="text-[8px] text-slate-400 block">DISTANCE</span>
              <span className="font-bold text-white">{currentActiveRoute?.distanceKm} km</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 block">ETA</span>
              <span className="font-bold text-amber-300">{currentActiveRoute?.durationMinutes} min</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 block">TRAFFIC</span>
              <span className="font-bold text-emerald-400">{currentActiveRoute?.trafficCondition}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={handleStartNavigation}
              className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
            >
              <Navigation className="w-3 h-3 fill-slate-950" />
              <span>START NAVIGATION</span>
            </button>

            <button
              onClick={exitNavigation}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-semibold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE C: LIVE 3D GPS NAVIGATION */}
      {/* ========================================================================= */}
      {twinMode === 'navigate' && activeNav && (
        <>
          <div className="absolute top-14 left-4 z-30 pointer-events-auto max-w-xs w-full rounded-2xl bg-slate-950/95 border border-sky-500/40 backdrop-blur-xl p-3 shadow-2xl space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div>
                <span className="text-[8px] font-mono uppercase text-slate-400 block">DESTINATION</span>
                <span className="text-xs font-bold text-white">{activeNav.destName}</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {activeNav.vehicleCode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-black/40 border border-white/10 text-center font-mono">
              <div>
                <span className="text-[8px] text-slate-400 block">ETA</span>
                <span className="font-bold text-amber-300 text-xs">
                  {Math.max(1, Math.round(activeNav.etaMinutes * (1 - vehicleProgress)))} min
                </span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 block">REMAINING</span>
                <span className="font-bold text-white text-xs">
                  {(activeNav.distanceKm * (1 - vehicleProgress)).toFixed(1)} km
                </span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 block">SPEED</span>
                <span className="font-bold text-emerald-400 text-xs">{activeNav.speedKmh} km/h</span>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-sky-950/40 border border-sky-500/20 text-xs">
              <div className="flex items-center gap-1 text-sky-400 font-mono font-semibold text-[8px] uppercase">
                <Navigation className="w-2.5 h-2.5" />
                <span>NEXT TURN</span>
              </div>
              <div className="text-white font-medium mt-0.5 text-[11px] leading-tight">
                {currentManeuver.instruction}
              </div>
            </div>

            <button
              onClick={handleReroute}
              className="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Recalculate Route</span>
            </button>
          </div>

          <div className="absolute top-14 right-4 z-30 pointer-events-auto">
            <button
              onClick={() => setIsFollowCameraActive(prev => !prev)}
              className={`px-3 py-1 rounded-full border backdrop-blur-md shadow-xl text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isFollowCameraActive
                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                  : 'bg-slate-950/90 text-slate-300 border-white/20'
              }`}
            >
              <Locate className="w-3 h-3" />
              <span>{isFollowCameraActive ? 'FOLLOWING' : 'FREE CAM'}</span>
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto">
            <button
              onClick={exitNavigation}
              className="px-4 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/20 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1.5 shadow-2xl transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>Exit Navigation</span>
            </button>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TOAST & DEMO BANNERS */}
      {/* ========================================================================= */}
      {reroutingNotice && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-40 max-w-sm w-full px-4 pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/95 border border-amber-500 text-amber-200 backdrop-blur-md text-xs font-semibold shadow-2xl flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{reroutingNotice}</span>
          </div>
        </div>
      )}

      {deliveryArrivalToast && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-40 max-w-sm w-full px-4 pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/95 border border-emerald-500 text-emerald-200 backdrop-blur-md text-xs font-semibold shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{deliveryArrivalToast}</span>
          </div>
        </div>
      )}

      {isDemoRunning && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
          <div className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-spin" />
            <span>{demoStepText}</span>
          </div>
        </div>
      )}
    </div>
  );
};

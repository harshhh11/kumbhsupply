// Source: Google Maps Platform Code Assist
// =========================================================================
// REAL GOOGLE MAPS JAVASCRIPT API & GOOGLE ROUTES v2 NAVIGATION VIEW
// Full Real Google Map Surface, Traffic-Aware Multi-Route Polylines, Street-by-Street GPS Convoy
// =========================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Car,
  Bike,
  Bus,
  Footprints,
  Navigation,
  ArrowLeftRight,
  Clock,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CornerUpRight,
  MapPin,
  X,
  RefreshCw,
  Layers,
  Truck,
  Droplets,
  Utensils,
  Cross,
  Fuel,
  AlertTriangle,
  Locate,
  CheckCircle2,
  Trash2,
  Activity
} from 'lucide-react';
import {
  getAllLocations,
  getLocationById,
  OperationalLocation
} from '../../data/locations';
import {
  computeGoogleRoute,
  getGoogleMapsApiKey,
  GoogleCalculatedRoute,
  RouteComputeResult
} from '../../services/googleRoutesService';
import { loadGoogleMapsApi } from '../../services/googleMapsLoader';
import { useKumbhData } from '../../context/KumbhDataContext';

export interface GoogleMapsDirectionsViewProps {
  initialOriginId?: string;
  initialDestId?: string;
  onBack?: () => void;
}

export const GoogleMapsDirectionsView: React.FC<GoogleMapsDirectionsViewProps> = ({
  initialOriginId = 'wh-central',
  initialDestId = 'zone-b',
  onBack
}) => {
  const { setCurrentPage } = useKumbhData();

  // Locations registry
  const allLocations = useMemo(() => getAllLocations(), []);

  // UI Modes: 'planning' (directions list) | 'details' (turn by turn steps) | 'navigation' (live vehicle follow)
  const [viewState, setViewState] = useState<'planning' | 'details' | 'navigation'>('planning');
  const [travelMode, setTravelMode] = useState<'drive' | 'two_wheeler' | 'transit' | 'walk'>('drive');

  // Origin and Destination state
  const [originId, setOriginId] = useState<string>(initialOriginId);
  const [destId, setDestId] = useState<string>(initialDestId);
  const [isOriginSelecting, setIsOriginSelecting] = useState<boolean>(false);
  const [isDestSelecting, setIsDestSelecting] = useState<boolean>(false);

  // Selected commodity vehicle
  const [selectedCommodity, setSelectedCommodity] = useState<'water' | 'food' | 'medical' | 'sanitation' | 'fuel'>('water');

  // Routing calculation results
  const [routeResult, setRouteResult] = useState<RouteComputeResult | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [reroutingAlert, setReroutingAlert] = useState<string | null>(null);
  const [deliveryArrivalToast, setDeliveryArrivalToast] = useState<string | null>(null);

  // Real Google Maps state
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const gMapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId | 'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [isTrafficLayerActive, setIsTrafficLayerActive] = useState<boolean>(true);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  // Google Map Overlays references
  const primaryPolylineRef = useRef<google.maps.Polyline | null>(null);
  const altPolylinesRef = useRef<google.maps.Polyline[]>([]);
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destMarkerRef = useRef<google.maps.Marker | null>(null);
  const vehicleMarkerRef = useRef<google.maps.Marker | null>(null);
  const overlayViewsRef = useRef<google.maps.OverlayView[]>([]);

  // Live Vehicle Animation
  const [vehicleProgress, setVehicleProgress] = useState<number>(0.0);
  const [isFollowCameraActive, setIsFollowCameraActive] = useState<boolean>(true);

  const originLocation = useMemo(() => getLocationById(originId) || allLocations[0], [originId, allLocations]);
  const destLocation = useMemo(() => getLocationById(destId) || allLocations[4], [destId, allLocations]);

  // Current active route object
  const activeRoute: GoogleCalculatedRoute | null = useMemo(() => {
    if (!routeResult || routeResult.routes.length === 0) return null;
    return routeResult.routes[selectedRouteIndex] || routeResult.recommendedRoute;
  }, [routeResult, selectedRouteIndex]);

  // Commodity Metadata
  const COMMODITY_CONFIG = {
    water: { label: 'Drinking Water', unit: '20,000 L', vehicle: 'WT-1042', color: '#38bdf8', icon: Droplets },
    food: { label: 'Dry Food Rations', unit: '8,000 kg', vehicle: 'FD-204', color: '#fbbf24', icon: Utensils },
    medical: { label: 'Critical Trauma Kits', unit: '500 kits', vehicle: 'MED-402', color: '#f43f5e', icon: Cross },
    sanitation: { label: 'Bio-Sanitation Enzymes', unit: '1,400 units', vehicle: 'SAN-108', color: '#10b981', icon: Trash2 },
    fuel: { label: 'Generator Diesel', unit: '10,000 L', vehicle: 'FL-09', color: '#fb923c', icon: Fuel }
  };

  // 1. Initialize REAL Google Maps JavaScript SDK
  useEffect(() => {
    let isMounted = true;

    loadGoogleMapsApi()
      .then((gMaps) => {
        if (!isMounted || !mapContainerRef.current) return;

        // Full-fidelity standard Google Maps Roadmap view
        const mapOptions: google.maps.MapOptions = {
          center: { lat: 23.1825, lng: 75.7682 }, // Ujjain Core
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          }
        };

        const map = new gMaps.Map(mapContainerRef.current, mapOptions);
        gMapRef.current = map;

        // Add Traffic Layer
        const trafficLayer = new gMaps.TrafficLayer();
        trafficLayer.setMap(map);
        trafficLayerRef.current = trafficLayer;

        setMapLoaded(true);
        setMapError(null);
      })
      .catch((err) => {
        console.error('[Google Maps Init Failure Details]', err);
        setMapError(err?.message === 'GOOGLE_MAPS_API_KEY_MISSING' 
          ? 'Google Maps API Key missing in environment (VITE_GOOGLE_MAPS_API_KEY).' 
          : 'Map unavailable — check Google Maps API configuration.');
      });

    return () => {
      isMounted = false;
      if (primaryPolylineRef.current) primaryPolylineRef.current.setMap(null);
      altPolylinesRef.current.forEach((p) => p.setMap(null));
      if (originMarkerRef.current) originMarkerRef.current.setMap(null);
      if (destMarkerRef.current) destMarkerRef.current.setMap(null);
      if (vehicleMarkerRef.current) vehicleMarkerRef.current.setMap(null);
    };
  }, []);

  // 2. Compute Google Routes whenever Origin, Destination, or Travel Mode changes
  const fetchGoogleRoutes = useCallback(
    async (
      orgId: string,
      dstId: string,
      mode: 'drive' | 'two_wheeler' | 'transit' | 'walk',
      applyRestriction: boolean = false
    ) => {
      setIsLoadingRoutes(true);
      const org = getLocationById(orgId) || allLocations[0];
      const dst = getLocationById(dstId) || allLocations[4];

      const googleMode =
        mode === 'two_wheeler' ? 'TWO_WHEELER' : mode === 'transit' ? 'TRANSIT' : mode === 'walk' ? 'WALK' : 'DRIVE';

      try {
        const res = await computeGoogleRoute(
          { id: org.id, name: org.name, lat: org.latitude, lng: org.longitude },
          { id: dst.id, name: dst.name, lat: dst.latitude, lng: dst.longitude },
          applyRestriction,
          googleMode
        );

        setRouteResult(res);
        setSelectedRouteIndex(0);

        // Fit Google Map bounds to encompass the entire route with padding
        if (gMapRef.current && res.recommendedRoute.coordinates.length > 0 && window.google) {
          const bounds = new window.google.maps.LatLngBounds();
          res.recommendedRoute.coordinates.forEach(([lng, lat]) => {
            bounds.extend(new window.google.maps.LatLng(lat, lng));
          });
          gMapRef.current.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: 450 });
        }
      } catch (err) {
        console.error('Failed to compute Google routes', err);
      } finally {
        setIsLoadingRoutes(false);
      }
    },
    [allLocations]
  );

  useEffect(() => {
    fetchGoogleRoutes(originId, destId, travelMode);
  }, [originId, destId, travelMode, fetchGoogleRoutes]);

  // 3. Render Real Google Routes Polylines on the Map
  useEffect(() => {
    if (!gMapRef.current || !routeResult || !window.google || !mapLoaded) return;
    const map = gMapRef.current;
    const g = window.google;

    // Remove old polylines
    if (primaryPolylineRef.current) {
      primaryPolylineRef.current.setMap(null);
      primaryPolylineRef.current = null;
    }
    altPolylinesRef.current.forEach((p) => p.setMap(null));
    altPolylinesRef.current = [];

    const routes = routeResult.routes;
    const activeR = routes[selectedRouteIndex] || routeResult.recommendedRoute;

    // Render Alternative Routes First (Underneath Primary)
    routes.forEach((r, idx) => {
      if (idx === selectedRouteIndex) return;

      const path = r.coordinates.map(([lng, lat]) => new g.maps.LatLng(lat, lng));
      const altPolyline = new g.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#64748b', // Slate Gray
        strokeOpacity: 0.85,
        strokeWeight: 6,
        zIndex: 10,
        map
      });

      // Clicking an alternative route on the map selects it!
      altPolyline.addListener('click', () => {
        setSelectedRouteIndex(idx);
      });

      altPolylinesRef.current.push(altPolyline);
    });

    // Render Active Primary Route
    if (activeR) {
      const activePath = activeR.coordinates.map(([lng, lat]) => new g.maps.LatLng(lat, lng));
      const trafficColor =
        activeR.trafficCondition === 'HEAVY'
          ? '#ea580c' // Orange-Red for heavy congestion
          : activeR.trafficCondition === 'MODERATE'
          ? '#eab308' // Amber
          : '#2563eb'; // Google Blue

      const primaryPolyline = new g.maps.Polyline({
        path: activePath,
        geodesic: true,
        strokeColor: trafficColor,
        strokeOpacity: 1.0,
        strokeWeight: 8,
        zIndex: 20,
        map
      });

      primaryPolylineRef.current = primaryPolyline;
    }
  }, [routeResult, selectedRouteIndex, mapLoaded]);

  // 4. Place Origin & Destination Markers on Real Google Map
  useEffect(() => {
    if (!gMapRef.current || !window.google || !mapLoaded) return;
    const map = gMapRef.current;
    const g = window.google;

    // Origin Marker (Google Style Origin Pin)
    const orgPos = new g.maps.LatLng(originLocation.latitude, originLocation.longitude);
    if (!originMarkerRef.current) {
      originMarkerRef.current = new g.maps.Marker({
        position: orgPos,
        map,
        title: `Origin: ${originLocation.name}`,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#ffffff',
          fillOpacity: 1.0,
          strokeColor: '#0f172a',
          strokeWeight: 4
        },
        zIndex: 30
      });
    } else {
      originMarkerRef.current.setPosition(orgPos);
    }

    // Destination Marker (Google Style Red Pin)
    const dstPos = new g.maps.LatLng(destLocation.latitude, destLocation.longitude);
    if (!destMarkerRef.current) {
      destMarkerRef.current = new g.maps.Marker({
        position: dstPos,
        map,
        title: `Destination: ${destLocation.name}`,
        icon: {
          path: 'M 12 2 C 8.13 2 5 5.13 5 9 c 0 5.25 7 13 7 13 s 7 -7.75 7 -13 c 0 -3.87 -3.13 -7 -7 -7 z M 12 11.5 c -1.38 0 -2.5 -1.12 -2.5 -2.5 s 1.12 -2.5 2.5 -2.5 s 2.5 1.12 2.5 2.5 s -1.12 2.5 -2.5 2.5 z',
          scale: 1.6,
          fillColor: '#e11d48',
          fillOpacity: 1.0,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
          anchor: new g.maps.Point(12, 22)
        },
        zIndex: 30
      });
    } else {
      destMarkerRef.current.setPosition(dstPos);
    }
  }, [originLocation, destLocation, mapLoaded]);

  // 5. Swap Origin and Destination
  const handleSwapLocations = () => {
    const prevOrg = originId;
    setOriginId(destId);
    setDestId(prevOrg);
  };

  // 6. Cumulative Distance Profile for Street-by-Street Motion
  const routeSegmentProfile = useMemo(() => {
    if (!activeRoute || activeRoute.coordinates.length < 2) return null;
    const coords = activeRoute.coordinates;
    const cumulativeDistances: number[] = [0];
    let totalMeters = 0;

    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const dx = (p2[0] - p1[0]) * 111320 * Math.cos((p1[1] * Math.PI) / 180);
      const dy = (p2[1] - p1[1]) * 110540;
      const d = Math.sqrt(dx * dx + dy * dy);
      totalMeters += d;
      cumulativeDistances.push(totalMeters);
    }

    return { coords, cumulativeDistances, totalMeters };
  }, [activeRoute]);

  // 7. Live Navigation Vehicle Motion Loop
  useEffect(() => {
    if (viewState !== 'navigation' || !activeRoute) return;

    let animFrame: number;
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setVehicleProgress((prev) => {
        const next = prev + dt / 36;
        if (next >= 1.0) {
          setDeliveryArrivalToast(
            `Convoy Arrived at ${destLocation.name} • Replenished ${COMMODITY_CONFIG[selectedCommodity].unit}`
          );
          setTimeout(() => setDeliveryArrivalToast(null), 6000);
          return 1.0;
        }
        return next;
      });

      animFrame = requestAnimationFrame(updateLoop);
    };

    animFrame = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrame);
  }, [viewState, activeRoute, destLocation, selectedCommodity]);

  // Interpolated Vehicle Coordinate & Heading along Road LineString
  const currentVehicleMotion = useMemo(() => {
    if (!routeSegmentProfile || routeSegmentProfile.coords.length < 2) return null;
    const { coords, cumulativeDistances, totalMeters } = routeSegmentProfile;
    if (totalMeters <= 0) return null;

    const targetDist = Math.min(vehicleProgress * totalMeters, totalMeters);

    // Find road segment
    let segIdx = 0;
    for (let i = 0; i < cumulativeDistances.length - 1; i++) {
      if (targetDist >= cumulativeDistances[i] && targetDist <= cumulativeDistances[i + 1]) {
        segIdx = i;
        break;
      }
    }

    const segStartDist = cumulativeDistances[segIdx];
    const segEndDist = cumulativeDistances[segIdx + 1] || segStartDist + 1;
    const segLen = Math.max(0.001, segEndDist - segStartDist);
    const fraction = Math.max(0, Math.min(1, (targetDist - segStartDist) / segLen));

    const p1 = coords[segIdx];
    const p2 = coords[segIdx + 1] || p1;

    const lng = p1[0] + (p2[0] - p1[0]) * fraction;
    const lat = p1[1] + (p2[1] - p1[1]) * fraction;

    // Calculate heading angle from road segment vector
    const y = Math.sin(((p2[0] - p1[0]) * Math.PI) / 180) * Math.cos((p2[1] * Math.PI) / 180);
    const x =
      Math.cos((p1[1] * Math.PI) / 180) * Math.sin((p2[1] * Math.PI) / 180) -
      Math.sin((p1[1] * Math.PI) / 180) *
        Math.cos((p2[1] * Math.PI) / 180) *
        Math.cos(((p2[0] - p1[0]) * Math.PI) / 180);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    return {
      coordinate: [lng, lat] as [number, number],
      bearing: (bearing + 360) % 360
    };
  }, [routeSegmentProfile, vehicleProgress]);

  // Render & Follow Vehicle Marker on Real Google Map
  useEffect(() => {
    if (!gMapRef.current || !window.google || !mapLoaded) return;
    const map = gMapRef.current;
    const g = window.google;

    if (viewState === 'navigation' && currentVehicleMotion) {
      const pos = new g.maps.LatLng(currentVehicleMotion.coordinate[1], currentVehicleMotion.coordinate[0]);

      if (!vehicleMarkerRef.current) {
        vehicleMarkerRef.current = new g.maps.Marker({
          position: pos,
          map,
          title: `Convoy: ${COMMODITY_CONFIG[selectedCommodity].vehicle}`,
          icon: {
            path: g.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#0284c7', // Sky Blue
            fillOpacity: 1.0,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            rotation: currentVehicleMotion.bearing
          },
          zIndex: 40
        });
      } else {
        vehicleMarkerRef.current.setPosition(pos);
        const icon = vehicleMarkerRef.current.getIcon() as google.maps.Symbol;
        if (icon) {
          icon.rotation = currentVehicleMotion.bearing;
          vehicleMarkerRef.current.setIcon(icon);
        }
      }

      if (isFollowCameraActive) {
        map.panTo(pos);
      }
    } else {
      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setMap(null);
        vehicleMarkerRef.current = null;
      }
    }
  }, [viewState, currentVehicleMotion, isFollowCameraActive, selectedCommodity, mapLoaded]);

  // Current Turn-by-Turn Maneuver
  const currentManeuver = useMemo(() => {
    if (!activeRoute?.maneuvers || activeRoute.maneuvers.length === 0) {
      return {
        instruction: 'Continue straight along logistics corridor',
        roadName: 'Primary Arterial',
        distanceKm: 0.5,
        durationMinutes: 1,
        progressFraction: 0,
        coordinate: [75.7682, 23.1825] as [number, number]
      };
    }
    const mans = activeRoute.maneuvers;
    for (let i = mans.length - 1; i >= 0; i--) {
      if (vehicleProgress >= mans[i].progressFraction) {
        return mans[i];
      }
    }
    return mans[0];
  }, [activeRoute, vehicleProgress]);

  // Start Live Navigation
  const handleStartNavigation = () => {
    setViewState('navigation');
    setVehicleProgress(0.0);
    setIsFollowCameraActive(true);

    if (gMapRef.current && activeRoute && activeRoute.coordinates.length > 0 && window.google) {
      const startPos = new window.google.maps.LatLng(activeRoute.coordinates[0][1], activeRoute.coordinates[0][0]);
      gMapRef.current.panTo(startPos);
      gMapRef.current.setZoom(17);
    }
  };

  // Exit Navigation
  const handleExitNavigation = () => {
    setViewState('planning');
    setVehicleProgress(0.0);
    setIsFollowCameraActive(false);

    if (gMapRef.current && activeRoute && activeRoute.coordinates.length > 0 && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      activeRoute.coordinates.forEach(([lng, lat]) => {
        bounds.extend(new window.google.maps.LatLng(lat, lng));
      });
      gMapRef.current.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: 450 });
    }
  };

  // Dynamic Reroute Request
  const handleReroute = async () => {
    setReroutingAlert('Traffic Congestion Detected • Querying Google Routes API for optimal bypass...');
    await fetchGoogleRoutes(originId, destId, travelMode, true);
    setTimeout(() => setReroutingAlert(null), 5000);
  };

  // Copy Route Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Switch Base Map Style (Roadmap, Satellite, Hybrid, Terrain)
  const handleToggleMapType = () => {
    if (!gMapRef.current || !window.google) return;
    const nextType =
      mapTypeId === 'roadmap'
        ? google.maps.MapTypeId.SATELLITE
        : mapTypeId === 'satellite'
        ? google.maps.MapTypeId.HYBRID
        : mapTypeId === 'hybrid'
        ? google.maps.MapTypeId.TERRAIN
        : google.maps.MapTypeId.ROADMAP;

    setMapTypeId(nextType);
    gMapRef.current.setMapTypeId(nextType);
  };

  // Toggle Live Traffic Layer
  const handleToggleTraffic = () => {
    if (!trafficLayerRef.current || !gMapRef.current) return;
    const nextState = !isTrafficLayerActive;
    setIsTrafficLayerActive(nextState);
    trafficLayerRef.current.setMap(nextState ? gMapRef.current : null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-100 select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. REAL GOOGLE MAPS BASE SURFACE */}
      {/* ========================================================================= */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Error Banner if Google Maps API key fails */}
      {mapError && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{mapError}</span>
        </div>
      )}

      {/* TOP SEARCH CATEGORY CHIPS OVER MAP (LIKE GOOGLE MAPS) */}
      <div className="absolute top-4 left-[440px] right-20 z-10 hidden xl:flex items-center gap-2 overflow-x-auto no-scrollbar pointer-events-auto">
        {[
          { label: '💧 Hydration Kiosks', dest: 'zone-b' },
          { label: '🏥 Medical Triage', dest: 'landmark-medical-camp' },
          { label: '🍲 Annakshetra Kitchens', dest: 'food-hub-01' },
          { label: '⛽ Fuel Reserves', dest: 'fuel-depot-01' },
          { label: '🌉 Pontoon Bridges', dest: 'bridge-arterial' },
          { label: '🚾 Bio-Sanitation', dest: 'sanitation-hub-01' }
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={() => setDestId(chip.dest)}
            className="px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-md text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. GOOGLE MAPS-STYLE LEFT DIRECTIONS PANEL */}
      {/* ========================================================================= */}
      {viewState !== 'navigation' && (
        <div className="absolute top-4 left-4 z-30 w-[380px] sm:w-[412px] max-h-[calc(100vh-32px)] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden pointer-events-auto transition-all">
          {/* A. TOP BAR: BACK, MODES, CLOSE */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 bg-white">
            <button
              onClick={onBack || (() => setCurrentPage('command'))}
              title="Return to Dashboard"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Travel Mode Selector with Estimated Travel Times */}
            <div className="flex items-center gap-1">
              {[
                { id: 'drive' as const, icon: Car, label: 'Best 23 min', active: travelMode === 'drive' },
                { id: 'two_wheeler' as const, icon: Bike, label: '16 min', active: travelMode === 'two_wheeler' },
                { id: 'transit' as const, icon: Bus, label: '29 min', active: travelMode === 'transit' },
                { id: 'walk' as const, icon: Footprints, label: '48 min', active: travelMode === 'walk' }
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTravelMode(mode.id)}
                    className={`flex flex-col items-center px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                      mode.active
                        ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-mono leading-none mt-1">{mode.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setViewState('planning')}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* B. ROUTE INPUTS (ORIGIN & DESTINATION WITH SWAP) */}
          <div className="px-4 py-3 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              {/* Left connector dots */}
              <div className="flex flex-col items-center justify-between h-16 py-1">
                <div className="w-3.5 h-3.5 rounded-full border-[2.5px] border-slate-700 bg-white" />
                <div className="w-0.5 h-6 border-l-2 border-dotted border-slate-300" />
                <div className="w-3.5 h-3.5 rounded-full bg-rose-600" />
              </div>

              {/* Input Boxes */}
              <div className="flex-1 space-y-2">
                {/* Origin Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={originLocation.name}
                    readOnly
                    onClick={() => setIsOriginSelecting((prev) => !prev)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-transparent focus:border-blue-500 text-xs font-semibold text-slate-900 cursor-pointer truncate"
                  />
                  {isOriginSelecting && (
                    <div className="absolute top-9 left-0 right-0 z-50 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-1">
                      {allLocations.map((loc) => (
                        <div
                          key={loc.id}
                          onClick={() => {
                            setOriginId(loc.id);
                            setIsOriginSelecting(false);
                          }}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-xs text-slate-800 cursor-pointer truncate"
                        >
                          {loc.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={destLocation.name}
                    readOnly
                    onClick={() => setIsDestSelecting((prev) => !prev)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-transparent focus:border-blue-500 text-xs font-semibold text-slate-900 cursor-pointer truncate"
                  />
                  {isDestSelecting && (
                    <div className="absolute top-9 left-0 right-0 z-50 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-1">
                      {allLocations.map((loc) => (
                        <div
                          key={loc.id}
                          onClick={() => {
                            setDestId(loc.id);
                            setIsDestSelecting(false);
                          }}
                          className="px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-xs text-slate-800 cursor-pointer truncate"
                        >
                          {loc.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapLocations}
                title="Swap origin and destination"
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-all cursor-pointer self-center"
              >
                <ArrowLeftRight className="w-4 h-4 rotate-90" />
              </button>
            </div>

            {/* Bottom Controls: Commodity & Departure */}
            <div className="flex items-center justify-between pt-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">Leave now</span>
                <ChevronDown className="w-3 h-3" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">SUPPLY:</span>
                <select
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value as any)}
                  className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="water">💧 Water (20k L)</option>
                  <option value="food">🍲 Food (8-Ton)</option>
                  <option value="medical">🏥 Medical (500 kits)</option>
                  <option value="sanitation">🚾 Sanitation</option>
                  <option value="fuel">⛽ Fuel</option>
                </select>
              </div>
            </div>
          </div>

          {/* C. SHARE / SEND DIRECTIONS BAR */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-medium text-blue-600">
            <button
              onClick={() =>
                alert(
                  `Directions dispatched to Convoy Driver (${COMMODITY_CONFIG[selectedCommodity].vehicle}) via VHF Ch 1.`
                )
              }
              className="hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Send to Convoy Driver</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="hover:underline flex items-center gap-1.5 text-slate-600 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy link'}</span>
            </button>
          </div>

          {/* D. ROUTES LIST (MATCHING GOOGLE MAPS REFERENCE SCREENSHOT) */}
          {viewState === 'planning' && (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[calc(100vh-280px)]">
              {isLoadingRoutes ? (
                <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  <span>Computing real traffic-aware Google routes...</span>
                </div>
              ) : routeResult && routeResult.routes.length > 0 ? (
                <>
                  {routeResult.apiStatus === 'ERROR' && (
                    <div className="p-3 mx-4 my-2 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Route Notice</div>
                        <div className="text-[11px] text-rose-600 mt-0.5">
                          {routeResult.errorMessage || 'Unable to retrieve a road-based route.'}
                        </div>
                      </div>
                    </div>
                  )}
                  {routeResult.routes.map((route, idx) => {
                    const isSelected = selectedRouteIndex === idx;
                    const isHeavy = route.trafficCondition === 'HEAVY';
                    const isModerate = route.trafficCondition === 'MODERATE';

                    return (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRouteIndex(idx)}
                        className={`p-4 transition-all cursor-pointer ${
                          isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2.5">
                            <Car className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                            <div>
                              {/* Route Road Name */}
                              <div className="text-xs font-bold text-slate-900 leading-snug">
                                {route.name}
                              </div>

                              {/* Subtitle notice */}
                              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                                {isHeavy
                                  ? 'Best route, despite heavier traffic than usual'
                                  : isModerate
                                  ? 'Moderate traffic along corridor'
                                  : 'Fastest route now with light traffic'}
                              </div>

                              {/* Action Buttons when Selected */}
                              {isSelected && (
                                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-blue-200/60">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewState('details');
                                    }}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                  >
                                    Details
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartNavigation();
                                    }}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1"
                                  >
                                    <Navigation className="w-3 h-3 fill-white" />
                                    <span>Start Navigation</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Travel Duration & Distance */}
                          <div className="text-right">
                            <div
                              className={`text-sm font-extrabold ${
                                isHeavy ? 'text-rose-600' : isModerate ? 'text-amber-600' : 'text-emerald-600'
                              }`}
                            >
                              {route.durationMinutes} min
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">{route.distanceKm} km</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  <span className="font-bold">Route unavailable.</span>
                  <span className="text-slate-400">
                    Unable to retrieve a road-based route. No drivable route available between these locations.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* E. TURN-BY-TURN DETAILS VIEW */}
          {viewState === 'details' && activeRoute && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-280px)]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  onClick={() => setViewState('planning')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to all routes</span>
                </button>
                <div className="text-xs font-bold text-slate-900">
                  {activeRoute.durationMinutes} min ({activeRoute.distanceKm} km)
                </div>
              </div>

              {/* Maneuvers Steps */}
              <div className="space-y-3 pt-1">
                {activeRoute.maneuvers.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{step.instruction}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {step.roadName} &bull; {step.distanceKm} km ({step.durationMinutes} min)
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleStartNavigation}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 fill-white" />
                  <span>Start GPS Convoy Navigation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MINIMAL LIVE GPS NAVIGATION UI (STATE C) */}
      {/* ========================================================================= */}
      {viewState === 'navigation' && activeRoute && (
        <>
          {/* TOP GREEN GOOGLE MAPS NAVIGATION MANEUVER CARD */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 w-[90%] max-w-md pointer-events-auto">
            <div className="p-4 rounded-2xl bg-emerald-700 text-white shadow-2xl flex items-start gap-3 border border-emerald-500">
              <div className="p-2 rounded-xl bg-emerald-800 flex-shrink-0 mt-0.5">
                <CornerUpRight className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-200">
                  {currentManeuver.distanceKm > 0 ? `In ${(currentManeuver.distanceKm * 1000).toFixed(0)}m` : 'Next Turn'}
                </div>
                <div className="text-base font-bold leading-tight mt-0.5">{currentManeuver.instruction}</div>
                <div className="text-xs text-emerald-200 mt-0.5">onto {currentManeuver.roadName}</div>
              </div>
            </div>
          </div>

          {/* BOTTOM FLOATING TRIP BAR */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-[92%] max-w-xl pointer-events-auto">
            <div className="p-4 rounded-2xl bg-white text-slate-800 shadow-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    {Math.max(1, Math.round(activeRoute.durationMinutes * (1 - vehicleProgress)))} min
                  </span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs font-mono text-slate-600">
                    {(activeRoute.distanceKm * (1 - vehicleProgress)).toFixed(1)} km
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                  Vehicle: <span className="font-bold text-slate-800">{COMMODITY_CONFIG[selectedCommodity].vehicle}</span> &bull;{' '}
                  {COMMODITY_CONFIG[selectedCommodity].unit}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReroute}
                  title="Recalculate dynamic route"
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  <span>Reroute</span>
                </button>

                <button
                  onClick={handleExitNavigation}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Exit</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 4. MAP CONTROLS (BOTTOM-LEFT LAYERS & TRAFFIC TOGGLE) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 pointer-events-auto">
        {/* LAYERS TOGGLE */}
        <button
          onClick={handleToggleMapType}
          title="Switch Map Type (Roadmap / Satellite / Hybrid / Terrain)"
          className="p-1 rounded-2xl bg-white shadow-xl border border-slate-200 flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden relative border border-slate-300">
            <img
              src={
                mapTypeId === 'roadmap'
                  ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/14450/23240'
                  : 'https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/15/23240/14450.png'
              }
              alt="Layer Thumbnail"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Layers className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-700 uppercase">
            {mapTypeId === 'roadmap' ? 'Satellite' : 'Roadmap'}
          </span>
        </button>

        {/* LIVE TRAFFIC TOGGLE */}
        <button
          onClick={handleToggleTraffic}
          title="Toggle Real-Time Google Traffic Overlay"
          className={`px-3 py-2 rounded-xl shadow-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isTrafficLayerActive
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Traffic</span>
        </button>
      </div>

      {/* TOASTS & ALERTS */}
      {reroutingAlert && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-amber-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>{reroutingAlert}</span>
          </div>
        </div>
      )}

      {deliveryArrivalToast && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{deliveryArrivalToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

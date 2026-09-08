import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useKumbhData } from '../../context/KumbhDataContext';
import {
  Layers,
  Clock,
  Navigation,
  Compass,
  Radio,
  Truck,
  Droplets,
  Utensils,
  Cross,
  Trash2,
  Fuel,
  AlertTriangle,
  Play,
  Activity,
  ShieldCheck,
  ChevronRight,
  Route,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  DigitalTwinLandmark,
  ZoomLevel
} from '../../data/kumbhData';

interface KumbhTwinCanvasProps {
  interactive?: boolean;
  pageMode?: 'home' | 'operations' | 'embed' | 'command' | 'routes';
}

export const KumbhTwinCanvas: React.FC<KumbhTwinCanvasProps> = ({
  interactive = true,
  pageMode = 'operations'
}) => {
  const {
    setCurrentPage,
    setSelectedZoneId,
    activeZoomLevel,
    setActiveZoomLevel,
    activeCommodityLayer,
    setActiveCommodityLayer,
    selectedTimeStep,
    setSelectedTimeStep,
    currentTimelineState,
    landmarks,
    simulatedFleet,
    followedVehicleId,
    setFollowedVehicleId,
    flyToTarget,
    setFlyToTarget,
    startUspDemoScenario
  } = useKumbhData();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parallax & Selected Landmark Controls
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState<string | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<DigitalTwinLandmark | null>(null);

  const isHome = pageMode === 'home';
  const isOperations = pageMode === 'operations';

  // Active Commodity Categories with clean functional styling
  const commodityLayers = [
    { id: 'all', label: 'All Layers', icon: Layers, color: '#f8fafc' },
    { id: 'water', label: 'Water', icon: Droplets, color: '#38bdf8' },
    { id: 'food', label: 'Food', icon: Utensils, color: '#fbbf24' },
    { id: 'medical', label: 'Medical', icon: Cross, color: '#f43f5e' },
    { id: 'sanitation', label: 'Sanitation', icon: Trash2, color: '#10b981' },
    { id: 'fuel', label: 'Fuel', icon: Fuel, color: '#fb923c' },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle, color: '#ec4899' },
    { id: 'infrastructure', label: 'Infrastructure', icon: Navigation, color: '#a855f7' }
  ];

  // =========================================================================
  // MAP MARKER SELECTION & DENSITY
  // On Home: ONLY 3 very subtle markers (Zone B, Warehouse 2, Zone D).
  // On Operations: Focused markers based on layer & zoom.
  // =========================================================================
  const visibleLandmarks = useMemo(() => {
    if (isHome) {
      // Home page: only 3 calm, quiet landmarks
      return landmarks.filter(lm => ['zone-b', 'warehouse-1', 'zone-d'].includes(lm.id));
    }

    // Operations page:
    if (activeCommodityLayer !== 'all') {
      return landmarks.filter(
        lm => lm.category === activeCommodityLayer || lm.category === 'depot'
      );
    }
    if (activeZoomLevel <= 2 && !flyToTarget) {
      const primaryAnchorIds = ['zone-a', 'zone-b', 'zone-c', 'zone-d', 'warehouse-1'];
      return landmarks.filter(lm => primaryAnchorIds.includes(lm.id));
    }
    return landmarks;
  }, [landmarks, activeCommodityLayer, activeZoomLevel, flyToTarget, isHome]);

  // Mouse Parallax handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0.5, y: 0.5 });
  };

  // Current effective zoom scale
  const currentZoomScale = useMemo(() => {
    if (isHome) return 1.0;
    if (followedVehicleId) return 2.1;
    if (flyToTarget) {
      return flyToTarget.zoom === 1 ? 1.0 : flyToTarget.zoom === 2 ? 1.25 : flyToTarget.zoom === 3 ? 1.55 : flyToTarget.zoom === 4 ? 1.85 : 2.2;
    }
    switch (activeZoomLevel) {
      case 1: return 1.0;
      case 2: return 1.22;
      case 3: return 1.48;
      case 4: return 1.78;
      case 5: return 2.15;
      default: return 1.0;
    }
  }, [activeZoomLevel, followedVehicleId, flyToTarget, isHome]);

  // Scale compensation so pins stay crisp and non-overlapping
  const pinScaleCompensation = useMemo(() => {
    return Math.min(1.0, 1 / Math.pow(currentZoomScale, 0.75));
  }, [currentZoomScale]);

  // 3D Camera Matrix
  const computed3DTransform = useMemo(() => {
    const tiltX = (mousePos.y - 0.5) * -3.5;
    const tiltY = (mousePos.x - 0.5) * 3.5;

    let scale = currentZoomScale;
    let panX = 0;
    let panY = 0;
    let pitch = 8;

    if (isHome) {
      // Home page: gentle cinematic aerial resting tilt, focused on right river corridor
      scale = 1.02;
      panX = 0;
      panY = 0;
      pitch = 9;
    } else if (followedVehicleId) {
      const veh = simulatedFleet.find(v => v.id === followedVehicleId);
      if (veh) {
        scale = 2.1;
        panX = (50 - (veh.waypoints[1]?.x || 75)) * 0.9;
        panY = (50 - (veh.waypoints[1]?.y || 50)) * 0.9;
        pitch = 24;
      }
    } else if (flyToTarget) {
      panX = (73.80 - flyToTarget.lng) * 110;
      panY = (flyToTarget.lat - 20.00) * 100;
      pitch = 18;
    } else {
      switch (activeZoomLevel) {
        case 1: panX = 0; panY = 0; pitch = 8; break;
        case 2: panX = 0; panY = 3; pitch = 15; break;
        case 3: panX = 0; panY = 7; pitch = 22; break;
        case 4: panX = 0; panY = 11; pitch = 28; break;
        case 5: panX = 0; panY = 15; pitch = 32; break;
      }
    }

    return `perspective(1600px) rotateX(${tiltX + pitch * 0.25}deg) rotateY(${tiltY}deg) scale(${scale}) translate3d(${panX}%, ${panY}%, 0px)`;
  }, [mousePos, currentZoomScale, activeZoomLevel, followedVehicleId, flyToTarget, isHome, simulatedFleet]);

  // Canvas Geospatial Operations Animation Layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick += 0.025;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // =========================================================================
      // 1. TIME-OF-DAY NATURAL WARM LIGHTING
      // =========================================================================
      ctx.save();
      const lighting = currentTimelineState.ambientLighting;
      if (lighting === 'dawn') {
        const dawnGrad = ctx.createLinearGradient(0, 0, w, h);
        dawnGrad.addColorStop(0, 'rgba(251, 146, 60, 0.06)');
        dawnGrad.addColorStop(1, 'rgba(56, 189, 248, 0.03)');
        ctx.fillStyle = dawnGrad;
        ctx.fillRect(0, 0, w, h);
      } else if (lighting === 'golden_hour') {
        const goldGrad = ctx.createLinearGradient(0, 0, w, h);
        goldGrad.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
        goldGrad.addColorStop(0.6, 'rgba(244, 63, 94, 0.06)');
        goldGrad.addColorStop(1, 'rgba(15, 23, 42, 0.15)');
        ctx.fillStyle = goldGrad;
        ctx.fillRect(0, 0, w, h);
      } else if (lighting === 'night') {
        ctx.fillStyle = 'rgba(7, 11, 20, 0.30)';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();

      // =========================================================================
      // 2. SUBTLE DRONE RADAR SWEEP (Muted, enterprise telemetry)
      // =========================================================================
      if (isOperations) {
        ctx.save();
        const radarCenter = { x: w * 0.50, y: h * 0.50 };
        const radarRadius = Math.max(w, h) * 0.60;
        const radarAngle = (tick * 0.60) % (Math.PI * 2);

        const beamGrad = ctx.createRadialGradient(
          radarCenter.x, radarCenter.y, 2,
          radarCenter.x, radarCenter.y, radarRadius
        );
        beamGrad.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
        beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.04)');
        beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(radarCenter.x, radarCenter.y);
        ctx.arc(radarCenter.x, radarCenter.y, radarRadius, radarAngle - 0.20, radarAngle);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 245, 210, 0.35)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(radarCenter.x, radarCenter.y);
        ctx.lineTo(
          radarCenter.x + Math.cos(radarAngle) * radarRadius,
          radarCenter.y + Math.sin(radarAngle) * radarRadius
        );
        ctx.stroke();
        ctx.restore();
      }

      // =========================================================================
      // 3. SUBTLE VEHICLE GPS TRAILS (Thin semi-transparent paths)
      // =========================================================================
      simulatedFleet.forEach((veh) => {
        ctx.save();
        const pts = veh.waypoints.map(p => ({
          x: (p.x / 100) * w,
          y: (p.y / 100) * h
        }));

        if (pts.length >= 2) {
          const isFollowed = veh.id === followedVehicleId;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          // Highlight only followed route, others are faint
          ctx.strokeStyle = isFollowed ? 'rgba(56, 189, 248, 0.90)' : 'rgba(245, 158, 11, 0.22)';
          ctx.lineWidth = isFollowed ? 2.5 : 1.2;
          ctx.setLineDash(isFollowed ? [8, 5] : [5, 6]);
          ctx.lineDashOffset = -tick * 20;
          ctx.stroke();

          // Vehicle dot
          const progress = (veh.progressPercent / 100 + (tick * 0.012)) % 1;
          const currentPtIdx = Math.min(pts.length - 2, Math.floor(progress * (pts.length - 1)));
          const segProgress = (progress * (pts.length - 1)) - currentPtIdx;
          const p1 = pts[currentPtIdx];
          const p2 = pts[currentPtIdx + 1] || p1;

          const currX = p1.x + (p2.x - p1.x) * segProgress;
          const currY = p1.y + (p2.y - p1.y) * segProgress;

          ctx.setLineDash([]);
          ctx.fillStyle = isFollowed ? '#38bdf8' : '#fbbf24';
          ctx.beginPath();
          ctx.arc(currX, currY, isFollowed ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();

          if (isFollowed) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
            ctx.beginPath();
            ctx.arc(currX, currY, 10 + Math.sin(tick * 4) * 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOperations, currentTimelineState, simulatedFleet, followedVehicleId]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full overflow-hidden select-none z-0 bg-[#070b12]"
    >
      {/* 3D AERIAL CANVAS STAGE */}
      <div
        className="absolute -top-[30%] -left-[30%] w-[160%] h-[160%] transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: computed3DTransform,
          transformOrigin: isHome ? '70% 45%' : '50% 50%'
        }}
      >
        {/* High-Resolution Golden-Hour Aerial Photographic Base */}
        <img
          src="/assets/kumbh_realistic_clean_bg.jpg"
          alt="3D Live Aerial View of Event Environment"
          className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.03]"
        />

        {/* Atmospheric depth gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b12]/90 via-transparent to-[#070b12]/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b12]/80 via-[#070b12]/20 to-transparent pointer-events-none" />

        {/* WebGL/Canvas Animation Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Geographic Landmark Water Label */}
        <div
          className="absolute pointer-events-none font-mono text-[10px] tracking-[0.35em] text-slate-200/40 uppercase font-semibold rotate-[-22deg] drop-shadow-md"
          style={{ top: isHome ? '64%' : '60%', left: isHome ? '68%' : '57%' }}
        >
          RIVERFRONT WATERWAY &bull; SACRED CORRIDOR
        </div>

        {/* ========================================================================= */}
        {/* SUBTLE MAP MARKERS */}
        {/* ========================================================================= */}
        {interactive && (
          <div className="absolute inset-0 pointer-events-auto font-sans">
            {visibleLandmarks.map((loc) => {
              const isHovered = hoveredLandmarkId === loc.id;
              const isSelected = selectedLandmark?.id === loc.id;
              const isCritical = loc.status === 'CRITICAL';
              const isWarning = loc.status === 'WARNING';
              const topPos = isHome ? loc.homeTop : loc.commandTop;
              const leftPos = isHome ? loc.homeLeft : loc.commandLeft;

              // Clean short display labels matching user spec
              let shortName = loc.name.split('—')[0].trim();
              let subtitle = loc.status === 'CRITICAL' ? 'High Demand' : loc.status === 'WARNING' ? 'Medium' : 'Safe';
              if (loc.id === 'warehouse-1') {
                shortName = 'Warehouse 2';
                subtitle = 'Supply Hub';
              } else if (loc.id === 'zone-b') {
                shortName = 'Zone B';
                subtitle = 'High Demand';
              } else if (loc.id === 'zone-d') {
                shortName = 'Zone D';
                subtitle = 'Medium';
              } else if (loc.id === 'zone-a') {
                shortName = 'Zone A';
                subtitle = 'Optimal';
              } else if (loc.id === 'zone-c') {
                shortName = 'Zone C';
                subtitle = 'Safe';
              }

              return (
                <div
                  key={loc.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 cursor-pointer group"
                  style={{
                    top: topPos,
                    left: leftPos,
                    transform: `translate(-50%, -50%) scale(${pinScaleCompensation})`
                  }}
                  onMouseEnter={() => setHoveredLandmarkId(loc.id)}
                  onMouseLeave={() => setHoveredLandmarkId(null)}
                  onClick={() => {
                    if (isHome) {
                      setCurrentPage('twin');
                    } else {
                      setSelectedLandmark(loc);
                      setSelectedZoneId(loc.zoneId);
                      setFlyToTarget({ lat: loc.lat, lng: loc.lng, zoom: 3, label: loc.name });
                      setActiveZoomLevel(3);
                    }
                  }}
                >
                  {/* Small ground beacon dot */}
                  <div className="relative flex items-center justify-center">
                    <span
                      className="absolute rounded-full animate-ping opacity-45"
                      style={{
                        width: isHovered || isSelected ? '24px' : '14px',
                        height: isHovered || isSelected ? '24px' : '14px',
                        backgroundColor: loc.color
                      }}
                    />
                    <span
                      className="relative rounded-full border border-white/90 shadow-lg flex items-center justify-center transition-all"
                      style={{
                        width: isHovered || isSelected ? '11px' : '8px',
                        height: isHovered || isSelected ? '11px' : '8px',
                        backgroundColor: loc.color
                      }}
                    >
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    </span>
                  </div>

                  {/* Clean calm single marker label (No huge boxes) */}
                  <div
                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 transition-all ${
                      isHovered || isSelected ? 'scale-105 z-30' : 'scale-100'
                    }`}
                  >
                    <div
                      className={`px-2 py-0.5 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                        isCritical
                          ? 'bg-[#1e0d13]/90 border-rose-500/70 text-rose-100'
                          : isWarning
                          ? 'bg-[#20150b]/90 border-amber-500/70 text-amber-100'
                          : isSelected
                          ? 'bg-slate-900/95 border-amber-400 text-white'
                          : 'bg-slate-950/80 border-white/20 text-slate-200 group-hover:border-white/40'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: loc.color }}
                      />
                      <span className="text-[10px] font-semibold tracking-tight">
                        {shortName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {subtitle}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* OPERATIONS MODE ADVANCED GEOSPATIAL CONTROLS */}
      {/* (Only rendered when pageMode === 'operations', NOT on Home hero!) */}
      {/* ========================================================================= */}
      {isOperations && interactive && (
        <>
          {/* TOP RIGHT: COMPACT 3D CAMERA CONTROL PILL (VIEW) */}
          <div className="absolute top-20 right-4 sm:right-8 z-30 pointer-events-auto">
            <div className="p-1 rounded-full bg-slate-950/85 border border-white/15 backdrop-blur-xl shadow-xl flex items-center gap-0.5 text-xs">
              <span className="px-2.5 py-0.5 text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" />
                <span>VIEW</span>
              </span>
              {([1, 2, 3, 4, 5] as ZoomLevel[]).map((lvl) => {
                const labels = ['Sky', 'Kumbh', 'Zone', 'Location', 'Close-Up'];
                const isActive = activeZoomLevel === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      setActiveZoomLevel(lvl);
                      setFollowedVehicleId(null);
                      setFlyToTarget(null);
                    }}
                    className={`px-2.5 py-1 rounded-full font-mono text-[10px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {labels[lvl - 1]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LEFT SIDEBAR: MINIMAL VERTICAL SUPPLY LAYER SELECTOR */}
          <div className="absolute top-20 left-4 sm:left-8 z-30 pointer-events-auto">
            <div className="p-1.5 rounded-2xl bg-slate-950/85 border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col gap-1 w-44">
              <div className="px-2.5 py-1 text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between border-b border-white/10 pb-1.5 mb-0.5">
                <span>Supply Layers</span>
                <Layers className="w-3 h-3 text-amber-400" />
              </div>
              {commodityLayers.map((layer) => {
                const Icon = layer.icon;
                const isActive = activeCommodityLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveCommodityLayer(layer.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/15 text-white font-semibold shadow-xs border border-white/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3" style={{ color: layer.color }} />
                      <span>{layer.label}</span>
                    </div>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM BAR: COMPACT TIMELINE SCRUBBER + DATA STATUS + ACTIONS */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
            {/* Timeline & Verification */}
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-slate-950/85 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400 ml-2 mr-1" />
                {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((time) => {
                  const isActive = selectedTimeStep === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTimeStep(time)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex px-3 py-1.5 rounded-full bg-slate-950/85 border border-emerald-500/25 backdrop-blur-md text-[10px] font-mono text-emerald-400 items-center gap-1.5 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Event Geography</span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-slate-400">Simulated Operations</span>
              </div>
            </div>

            {/* Actions: Run Demo & Live Convoy GPS */}
            <div className="flex items-center gap-2">
              <button
                onClick={startUspDemoScenario}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xl transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Run 3D Demo</span>
              </button>

              <button
                onClick={() => {
                  if (followedVehicleId) {
                    setFollowedVehicleId(null);
                    setActiveZoomLevel(1);
                  } else {
                    setFollowedVehicleId('veh-1042');
                    setActiveZoomLevel(5);
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-medium backdrop-blur-md shadow-xl transition-all cursor-pointer ${
                  followedVehicleId
                    ? 'bg-sky-500/30 border-sky-400 text-sky-200'
                    : 'bg-slate-950/85 border-white/20 text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-sky-400" />
                <span>{followedVehicleId ? 'Following Convoy' : 'Follow Live Convoy'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CONTEXTUAL RIGHT INSPECTION PANEL (WHEN A LOCATION IS SELECTED) */}
          {/* ========================================================================= */}
          {selectedLandmark && (
            <div className="fixed top-20 right-4 sm:right-8 w-84 max-w-[90vw] bg-[#0b101b]/95 border border-white/15 shadow-2xl backdrop-blur-2xl z-50 p-5 rounded-2xl flex flex-col gap-3.5 animate-fadeIn">
              {/* Header */}
              <div className="flex items-start justify-between pb-2.5 border-b border-white/10">
                <div>
                  <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-wider block">
                    {selectedLandmark.zoneId.toUpperCase()}
                  </span>
                  <h2 className="text-base font-extrabold text-white tracking-tight leading-snug">
                    {selectedLandmark.name}
                  </h2>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {selectedLandmark.subName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLandmark(null)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase font-mono ${
                    selectedLandmark.status === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : selectedLandmark.status === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {selectedLandmark.statusLabel}
                </span>
                <span className="font-mono text-[9px] text-slate-400">
                  {selectedLandmark.coordinatesFormatted}
                </span>
              </div>

              {/* Core Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] text-slate-400 block font-mono">Crowd</span>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {selectedLandmark.crowdCount.toLocaleString()}
                  </div>
                  <span className="text-[9px] text-amber-300/90">{selectedLandmark.crowdDensity}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] text-slate-400 block font-mono">Supply Readiness</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    {selectedLandmark.readinessPercentage}%
                  </div>
                  <span className="text-[9px] text-slate-400">Station Stock</span>
                </div>
              </div>

              {/* Commodity Status Summary */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">
                  Commodity Condition
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                  <div className="p-1 rounded bg-white/5">
                    <span className="text-slate-400 block text-[8px]">Water</span>
                    <span className="text-sky-300 font-bold">WATCH</span>
                  </div>
                  <div className="p-1 rounded bg-rose-500/10 border border-rose-500/20">
                    <span className="text-slate-400 block text-[8px]">Medical</span>
                    <span className="text-rose-400 font-bold">CRITICAL</span>
                  </div>
                  <div className="p-1 rounded bg-white/5">
                    <span className="text-slate-400 block text-[8px]">Food</span>
                    <span className="text-emerald-400 font-bold">SAFE</span>
                  </div>
                </div>
              </div>

              {/* Shortage & AI Recommendation */}
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-rose-300">
                  <span>Predicted Shortage:</span>
                  <span className="font-bold">3h 20m</span>
                </div>
                <div className="pt-1 border-t border-rose-500/20">
                  <span className="text-[9px] font-mono text-slate-300 uppercase font-bold block">
                    AI Recommended Action:
                  </span>
                  <p className="text-slate-200 font-light text-[10px] leading-relaxed mt-0.5">
                    Transfer 500 Medical Kits from Satpur MIDC Master Depot via Pontoon Bridge 01
                  </p>
                </div>
              </div>

              {/* Action CTAs: View Route & Inspect Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    setSelectedLandmark(null);
                    setCurrentPage('routes');
                  }}
                  className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>View Route</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedLandmark(null);
                    if (selectedLandmark.actionTarget === 'redistribution') {
                      setCurrentPage('redistribution');
                    } else if (selectedLandmark.actionTarget === 'inventory') {
                      setCurrentPage('inventory');
                    } else {
                      setSelectedZoneId(selectedLandmark.zoneId);
                      setCurrentPage('zone-detail');
                    }
                  }}
                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all text-center cursor-pointer"
                >
                  Inspect Actions &rarr;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

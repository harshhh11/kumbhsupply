import React from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { RealGeospatialTwin } from '../components/visual/RealGeospatialTwin';
import {
  Droplets,
  Utensils,
  Cross,
  Trash2,
  Fuel,
  Layers,
  AlertTriangle,
  MoreHorizontal,
  Truck,
  Users,
  Box,
  MapPin,
  TrendingUp,
  Boxes,
  AlertOctagon,
  ArrowLeftRight,
  Route,
  Activity,
  Play,
  ArrowRight,
  Sparkles,
  Calendar,
  ShieldCheck,
  Zap,
  Mouse,
  Navigation,
  CheckCircle2,
  Cpu,
  Database,
  Globe2,
  Radio,
  ChevronRight
} from 'lucide-react';
import { KEY_EVENT_GATHERING_DAYS } from '../data/kumbhData';

export const HomePage: React.FC = () => {
  const {
    setCurrentPage,
    setSelectedZoneId,
    commodities,
    zones,
    deliveries,
    estimatedCrowd,
    totalActiveDeliveries,
    criticalZonesCount,
    setIsDemoVideoOpen,
    triggerCrowdSurge,
    approveRecommendation
  } = useKumbhData();

  // Find the primary active delivery featured in reference image: 20,000 L Water to Zone B
  const activeHeroDelivery = deliveries.find(d => d.id === 'del-1042') || deliveries[0];

  return (
    <div className="relative min-h-screen text-slate-100 select-none font-sans">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO VIEWPORT - 100VW x 100VH FULL-BLEED 3D GEOSPATIAL ENVIRONMENT */}
      {/* ========================================================================= */}
      <section className="relative h-screen min-h-[750px] w-full flex flex-col justify-between pt-24 pb-6 px-4 sm:px-8 overflow-hidden bg-[#070b12]">
        {/* Full-bleed Continuous 3D Digital Twin World */}
        <div className="absolute inset-0 w-full h-full z-0">
          <RealGeospatialTwin interactive={true} pageMode="home" />
        </div>

        {/* Subtle gradient scrims for crisp typography contrast without obscuring 3D map */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-r from-[#060910]/85 via-[#060910]/40 to-transparent pointer-events-none z-[5]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#060910]/80 via-[#060910]/30 to-transparent pointer-events-none z-[5]" />

        {/* TOP / MIDDLE ROW: LEFT HERO COPY & TOP-RIGHT LIVE HUD PILL */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          {/* LEFT SIDE: Hero typography matching exact user instructions */}
          <div className="lg:col-span-7 space-y-4 pt-4 sm:pt-6">
            {/* Small Label */}
            <div className="inline-block font-mono text-[11px] tracking-[0.22em] text-slate-300/90 uppercase font-semibold">
              AI FOR A SAFER, BETTER KUMBH
            </div>

            {/* Large Brand Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg leading-[1.08]">
              KumbhSupply-AI
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl font-normal text-slate-200 tracking-tight leading-snug drop-shadow">
              AI-Powered Essential Supply Intelligence
              <br />
              <span className="text-amber-300/95 font-medium">for Kumbh & Mass Gathering Events</span>
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed drop-shadow font-light">
              Predict demand, monitor inventory, detect shortages and intelligently coordinate essential logistics across the event environment.
            </p>

            {/* Tagline matching reference */}
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium tracking-wide text-slate-200/90 py-1">
              <span>Right Resource</span>
              <span className="text-slate-500">|</span>
              <span>Right Place</span>
              <span className="text-slate-500">|</span>
              <span>Right Time</span>
            </div>

            {/* CTA Buttons matching reference */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentPage('command')}
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-100 hover:bg-white text-slate-900 text-xs sm:text-sm font-bold shadow-xl transition-all transform hover:scale-102 group cursor-pointer"
              >
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setCurrentPage('twin')}
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold shadow-xl transition-all transform hover:scale-102 group cursor-pointer"
              >
                <span>Explore 3D Operations</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: ONLY ONE elegant floating panel: Essential Supplies */}
          <div className="hidden lg:flex lg:col-span-5 justify-end items-center pointer-events-none">
            <div className="w-72 bg-slate-950/85 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl space-y-3 pointer-events-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Essential Supplies</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live Monitoring</span>
              </div>

              <div className="space-y-1 text-xs">
                {[
                  { name: 'Water', icon: Droplets, color: '#38bdf8', status: 'Optimal', stock: '185,000 L' },
                  { name: 'Food', icon: Utensils, color: '#fbbf24', status: 'Stable', stock: '120,000 kg' },
                  { name: 'Medical', icon: Cross, color: '#f43f5e', status: 'Surge Watch', stock: '48,000 kits' },
                  { name: 'Sanitation', icon: Trash2, color: '#10b981', status: 'Active', stock: '36,000 units' },
                  { name: 'Fuel', icon: Fuel, color: '#fb923c', status: 'Reserved', stock: '45,000 L' },
                  { name: 'Emergency', icon: AlertTriangle, color: '#ec4899', status: 'Standby', stock: '2,400 kits' },
                  { name: 'Infrastructure', icon: Navigation, color: '#a855f7', status: 'Pontoon 01', stock: 'Clear' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-slate-300 py-1 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                      <span className="text-slate-200 font-medium text-[11px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-slate-400">{item.stock}</span>
                      <span className="text-amber-300/90 font-semibold">&bull; {item.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage('twin')}
                className="w-full mt-2 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open 3D Operations &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM KPI ROW MATCHING REFERENCE IMAGE */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
            {/* KPI 1: Estimated Crowd */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">
                  {estimatedCrowd.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">Estimated Crowd</div>
                <div className="text-[9px] text-slate-500">Live Estimate</div>
              </div>
            </div>

            {/* KPI 2: Supply Categories */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/15 text-sky-400">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">
                  {commodities.length}
                </div>
                <div className="text-[11px] text-slate-400">Supply Categories</div>
                <div className="text-[9px] text-slate-500">Managed</div>
              </div>
            </div>

            {/* KPI 3: Operational Zones */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">
                  {zones.length}
                </div>
                <div className="text-[11px] text-slate-400">Operational Zones</div>
                <div className="text-[9px] text-slate-500">Across Event Area</div>
              </div>
            </div>

            {/* KPI 4: Active Deliveries */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono">
                  28
                </div>
                <div className="text-[11px] text-slate-400">Active Deliveries</div>
                <div className="text-[9px] text-slate-500">In Progress</div>
              </div>
            </div>
          </div>

          {/* Right Devanagari text matching reference image */}
          <div className="text-right">
            <div className="font-devanagari text-xl text-amber-400/90 font-semibold tracking-wide">
              हर हर महादेव ॐ
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              RIGHT RESOURCE | RIGHT PLACE | RIGHT TIME
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: "MANAGING THE MOVEMENT OF A GREATER KUMBH" */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-[#f8fafc] border-t border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono text-amber-700 uppercase tracking-wider font-semibold block mb-2">
                Unified Logistics Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Managing Essential Supplies for Large-Scale Gatherings
              </h2>
              <p className="text-base text-slate-600 mt-2 font-light">
                One platform. Multiple essential supplies. Smarter decisions. Greater impact.
              </p>
            </div>
            <div className="max-w-md text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              KumbhSupply-AI unifies real-time geospatial telemetry, predictive demand modeling and road-aware automated dispatch to ensure zero stock-outs across all event sectors and community camps.
            </div>
          </div>

          {/* 6 Capabilities Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Card 1: AI Demand Forecast */}
            <div
              onClick={() => setCurrentPage('demand')}
              className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-300 rounded-2xl group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="p-3 w-fit rounded-xl bg-sky-50 text-sky-700 border border-sky-100 mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">AI Demand Forecast</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Predict zone-wise demand for all essential supplies up to 24h ahead.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                <span>View Models</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Inventory Intelligence */}
            <div
              onClick={() => setCurrentPage('inventory')}
              className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-300 rounded-2xl group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="p-3 w-fit rounded-xl bg-purple-50 text-purple-700 border border-purple-100 mb-4 group-hover:scale-110 transition-transform">
                  <Boxes className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Inventory Intelligence</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Real-time stock visibility across central warehouses & zone buffer points.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-semibold flex items-center justify-between">
                <span>Supply Hubs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Shortage Detection */}
            <div
              onClick={() => setCurrentPage('shortage')}
              className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-300 rounded-2xl group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="p-3 w-fit rounded-xl bg-rose-50 text-rose-700 border border-rose-100 mb-4 group-hover:scale-110 transition-transform">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Shortage Detection</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Early alerts before stock-outs occur at critical ghats and medical posts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-700 font-semibold flex items-center justify-between">
                <span>Risk Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Smart Redistribution */}
            <div
              onClick={() => setCurrentPage('redistribution')}
              className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-300 rounded-2xl group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="p-3 w-fit rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 mb-4 group-hover:scale-110 transition-transform">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Smart Redistribution</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Recommend optimal transfer quantity, destination zone & source depot.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-semibold flex items-center justify-between">
                <span>Decision Engine</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 5: Route Optimization */}
            <div
              onClick={() => setCurrentPage('routes')}
              className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-300 rounded-2xl group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="p-3 w-fit rounded-xl bg-amber-50 text-amber-800 border border-amber-100 mb-4 group-hover:scale-110 transition-transform">
                  <Route className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Route Optimization</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Find feasible road-based delivery routes around crowd congestion.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 font-semibold flex items-center justify-between">
                <span>Pontoon Corridors</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 6: Live Operations */}
            <div
              onClick={() => setCurrentPage('command')}
              className="p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-all duration-300 rounded-2xl group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-700 border border-blue-100 mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Live Operations</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  Monitor active deliveries, follow GPS convoys and manage critical zones.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-700 font-semibold flex items-center justify-between">
                <span>Command Hub</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: HOW IT WORKS — 5-STEP DECISION LIFECYCLE */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-slate-900 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold block mb-2">
              Automated Closed-Loop Decisioning
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How KumbhSupply-AI Works
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-light">
              Observe &rarr; Predict &rarr; Detect &rarr; Recommend &rarr; Route &rarr; Deliver &rarr; Verify
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'PREDICT',
                subtitle: 'Demand ML Engine',
                desc: 'Forecasts zone-level consumption using crowd estimates, event schedules and ambient temperature.',
                color: '#38bdf8'
              },
              {
                step: '02',
                title: 'DETECT',
                subtitle: 'Stock-Out Horizon',
                desc: 'Computes current stock + incoming shipments against consumption rate to flag impending deficits.',
                color: '#f43f5e'
              },
              {
                step: '03',
                title: 'DECIDE',
                subtitle: 'Smart Redistribution',
                desc: 'Formulates optimal replenishment transfer quantity and source depot preserving safety stocks.',
                color: '#fbbf24'
              },
              {
                step: '04',
                title: 'DISPATCH',
                subtitle: 'OSM Road Routing',
                desc: 'Calculates turn-by-turn road routes across dedicated corridors, overbridges and pontoon bridges.',
                color: '#10b981'
              },
              {
                step: '05',
                title: 'VERIFY',
                subtitle: 'Live Telemetry & Arrival',
                desc: 'Tracks vehicle GPS in real time, auto-reroutes around crowd bottlenecks and updates buffer health on arrival.',
                color: '#a855f7'
              }
            ].map((item) => (
              <div
                key={item.step}
                className="p-5 rounded-2xl bg-slate-800/60 border border-white/10 hover:border-white/20 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">{item.step}</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                  <div className="text-base font-extrabold text-white font-mono tracking-wider pt-1">{item.title}</div>
                  <div className="text-[11px] text-amber-300/90 font-medium">{item.subtitle}</div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-light pt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: 3D DIGITAL TWIN EXPERIENCE SHOWCASE */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-20 px-4 sm:px-8 bg-white border-t border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono text-amber-700 uppercase tracking-wider font-semibold">
                High-Fidelity 3D Geographic Digital Twin
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Explore the 3D Digital Twin Environment
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Inspect 3D extruded event infrastructure, main ghats and gathering hubs along the river corridor, pontoon bridges and live animated supply convoys.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  'Real coordinates: Main Ghat, Heritage Precinct, Promenade & Camp Sectors',
                  '5 Camera Presets: Sky, Event, Zone, Location & Close-Up',
                  '8 Supply Layer toggles with active object filtering',
                  'OSM-grounded turn-by-turn road navigation with live camera follow'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setCurrentPage('twin')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <span>Launch 3D Operations Cockpit</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl h-[420px] bg-slate-950">
                <RealGeospatialTwin interactive={true} pageMode="embed" />
                <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                  <button
                    onClick={() => setCurrentPage('twin')}
                    className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white font-semibold text-xs border border-white/20 backdrop-blur-md shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Full Screen</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: RESEARCH / TECHNOLOGY ARCHITECTURE */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-[#f8fafc] border-t border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-amber-700 uppercase tracking-wider font-semibold block mb-1">
              Scientific & Technical Rigor
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Platform Architecture & AI Systems
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-light">
              Built on machine learning, geographic information systems and operations research principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Cpu, title: 'AI / ML Models', desc: 'Random Forest & XGBoost time-series ensemble for 1h-24h demand.' },
              { icon: Globe2, title: 'Geospatial Intelligence', desc: 'Real-time WebGL/MapLibre 3D digital twin rendering & hydrography.' },
              { icon: Database, title: 'Inventory Analytics', desc: 'Multi-echelon safety stock buffers with stock-out horizon estimation.' },
              { icon: Route, title: 'Route Optimization', desc: 'Road-network graph solver factoring crowd bottlenecks and pontoon loads.' },
              { icon: Radio, title: 'Digital Twin Telemetry', desc: 'GPS-tracked simulated vehicle physics and heading orientation.' },
              { icon: ShieldCheck, title: 'Real-Time Operations', desc: 'Automated alert triggers, supervisor sign-offs and convoy follow mode.' }
            ].map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">{tech.title}</div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-light">{tech.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: KEY GATHERING & SURGE DAYS SCHEDULE */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-white border-t border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono text-amber-700 uppercase tracking-wider font-semibold">
              Event-Aware Forecasting Schedule
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Key Gathering & Royal Bath Surge Days
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-light">
              Demand prediction models incorporate religious festival spikes and gathering timetables into safety stock buffers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {KEY_EVENT_GATHERING_DAYS.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-amber-300 hover:shadow-xs transition-all"
              >
                <div className="text-[10px] font-mono text-amber-700 font-semibold flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">{item.event}</h4>
                <div className="text-[11px] text-slate-500">
                  Devotee Surge: <span className="text-emerald-700 font-mono font-semibold">{item.crowdEstimate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

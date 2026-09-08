import React from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { RealGeospatialTwin } from '../components/visual/RealGeospatialTwin';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Boxes,
  Users,
  AlertOctagon,
  Truck,
  Clock,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Utensils,
  Cross,
  Trash2,
  Fuel,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  TrendingUp
} from 'lucide-react';

export const CommandCenterPage: React.FC = () => {
  const {
    selectedCommodityId,
    setSelectedCommodityId,
    setSelectedZoneId,
    setCurrentPage,
    commodities,
    zones,
    deliveries,
    recommendations,
    alerts,
    estimatedCrowd,
    totalActiveDeliveries,
    criticalZonesCount,
    approveRecommendation,
    addToast,
    triggerCrowdSurge,
    simulateWeatherSpike,
    syncTelemetry,
    exportData
  } = useKumbhData();

  const filterOptions = [
    { id: 'all', label: 'ALL', icon: Boxes },
    { id: 'water', label: 'WATER', icon: Droplets },
    { id: 'food', label: 'FOOD', icon: Utensils },
    { id: 'medical', label: 'MEDICAL', icon: Cross },
    { id: 'sanitation', label: 'SANITATION', icon: Trash2 },
    { id: 'fuel', label: 'FUEL', icon: Fuel },
    { id: 'emergency', label: 'EMERGENCY', icon: AlertTriangle },
    { id: 'infrastructure', label: 'INFRASTRUCTURE', icon: Layers }
  ];

  // Compute total available essential stock
  const totalStockSum = commodities.reduce((acc, c) => acc + c.totalAvailable, 0);

  // Filter deliveries and recommendations if a specific commodity is selected
  const activeRecommendations = recommendations.filter(
    r => selectedCommodityId === 'all' || r.commodityId === selectedCommodityId
  );

  const activeDeliveriesList = deliveries.filter(
    d => selectedCommodityId === 'all' || d.commodityId === selectedCommodityId
  );

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 select-none pb-12">
      {/* Secondary Sub-Navbar for Operational Pages */}
      <div className="pt-20">
        <SecondaryNav />
      </div>

      {/* Main Command Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* TOP KPIS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* KPI 1: Total Essential Stock */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Total Stock</span>
              <Boxes className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {totalStockSum.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">8 Commodities Tracked</div>
          </div>

          {/* KPI 2: Estimated Crowd */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Estimated Crowd</span>
              <Users className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {estimatedCrowd.toLocaleString()}
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">+12% vs Baseline</div>
          </div>

          {/* KPI 3: Critical Zones */}
          <div className="p-3.5 bg-white border border-rose-200 rounded-xl shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Critical Zones</span>
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-600 mt-1">
              {criticalZonesCount}
            </div>
            <div className="text-[10px] text-rose-600 font-medium mt-0.5">Zone B (Main Ghat)</div>
          </div>

          {/* KPI 4: Active Deliveries */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Active Deliveries</span>
              <Truck className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {totalActiveDeliveries}
            </div>
            <div className="text-[10px] text-purple-700 font-medium mt-0.5">Fleet en route</div>
          </div>

          {/* KPI 5: Pending Replenishments */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Pending Transfers</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-700 mt-1">
              {recommendations.filter(r => !r.approved).length}
            </div>
            <div className="text-[10px] text-amber-800 font-medium mt-0.5">Awaiting human signoff</div>
          </div>

          {/* KPI 6: Delayed Deliveries */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Delayed Vehicles</span>
              <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              1
            </div>
            <div className="text-[10px] text-orange-700 font-medium mt-0.5">WT-12 rerouted (+8m)</div>
          </div>
        </div>

        {/* COMMODITY FILTER PILL BAR & SIMULATION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Filter Supply:
            </span>
            {filterOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = selectedCommodityId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedCommodityId(opt.id);
                    addToast('Supply Filter Applied', `Showing ${opt.label} status and buffer telemetry.`, 'info');
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200 shadow-xs'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Simulation & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
            <button
              onClick={() => triggerCrowdSurge('zone-b', 25)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              title="Simulate sudden influx in Main Gathering Sector"
            >
              <Users className="w-3.5 h-3.5 text-rose-600" />
              <span>Simulate Surge (+25%)</span>
            </button>

            <button
              onClick={() => simulateWeatherSpike('heatwave')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              title="Simulate heatwave temperature spike"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Heatwave Spike</span>
            </button>

            <button
              onClick={syncTelemetry}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              title="Sync IoT gateway feeds"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Sync Feeds</span>
            </button>

            <button
              onClick={() => exportData('csv', 'CommandSnapshot')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              title="Export complete CSV data dossier"
            >
              <Boxes className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* MAIN COMMAND WORKSPACE: 3D DIGITAL TWIN + RIGHT OPERATIONAL INTELLIGENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CENTER / LEFT 8 COLS: 3D INTERACTIVE OPERATIONAL MAP */}
          <div className="lg:col-span-8 relative aspect-[16/10] min-h-[500px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-2xl">
            {/* Embedded 3D Digital Twin World */}
            <RealGeospatialTwin interactive={true} pageMode="command" />
          </div>

          {/* RIGHT 4 COLS: OPERATIONAL INTELLIGENCE STACK */}
          <div className="lg:col-span-4 space-y-4">
            {/* CARD 1: CRITICAL SHORTAGE RISK & AI RECOMMENDATION */}
            <div className="p-5 bg-white border border-rose-200 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                    <AlertOctagon className="w-4 h-4" />
                  </span>
                  <h3 className="text-xs font-bold text-rose-800 tracking-wide uppercase">
                    Critical Shortage Risk
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  ZONE B
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">Zone B &bull; Medical Supplies</div>
                  <div className="text-xs text-rose-600 mt-0.5 font-medium">
                    Estimated stock-out: <span className="font-mono font-bold">3h 20m</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Surge of +18% crowd into Main Gathering Sector will exhaust trauma kits below safety buffer before evening surge.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[10px] font-mono text-amber-800 uppercase tracking-wider font-semibold">
                    AI Recommended Action:
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    Transfer 500 Medical Kits
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Central Warehouse (Mhasrul) &rarr; Zone B
                  </div>
                  <div className="text-[11px] text-sky-700 font-mono font-medium">
                    Priority: CRITICAL &bull; ETA: 28 min
                  </div>
                </div>

                {recommendations[0]?.approved ? (
                  <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <Check className="w-4 h-4" />
                    <span>Transfer Approved & Dispatched</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => approveRecommendation(recommendations[0]?.id || 'rec-01')}
                      className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Approve Transfer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage('redistribution')}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      Modify
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: ACTIVE DELIVERIES TELEMETRY */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600" />
                  Active Deliveries
                </h3>
                <button
                  onClick={() => setCurrentPage('deliveries')}
                  className="text-[11px] text-slate-500 hover:text-slate-900 transition-colors font-medium"
                >
                  View All ({deliveries.length})
                </button>
              </div>

              <div className="space-y-3">
                {activeDeliveriesList.slice(0, 3).map(del => (
                  <div
                    key={del.id}
                    onClick={() => setCurrentPage('deliveries')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition-colors border border-slate-200/80"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900 font-mono">{del.code}</span>
                      <span className="font-mono text-sky-700 font-semibold">ETA {del.etaMinutes}m</span>
                    </div>
                    <div className="text-xs text-slate-800 font-medium">
                      {del.quantity.toLocaleString()} {del.unit} {del.commodityName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {del.sourceName} &rarr; {del.destinationName}
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-300"
                        style={{ width: `${del.progressPercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 3: REAL-TIME OPERATIONAL ALERTS */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Live Operational Alerts
                </h3>
                <button
                  onClick={() => setCurrentPage('alerts')}
                  className="text-[11px] text-slate-500 hover:text-slate-900 transition-colors font-medium"
                >
                  All Alerts
                </button>
              </div>

              <div className="space-y-2.5">
                {alerts.slice(0, 2).map(alt => (
                  <div key={alt.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        alt.type === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        alt.type === 'WARNING' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        {alt.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{alt.timeAgo}</span>
                    </div>
                    <div className="font-semibold text-slate-900 text-[11px]">{alt.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{alt.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

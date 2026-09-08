import React from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Users,
  ShieldCheck,
  AlertOctagon,
  Truck,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const ZonesPage: React.FC = () => {
  const {
    zones,
    setSelectedZoneId,
    setCurrentPage,
    triggerCrowdSurge,
    exportData,
    addToast
  } = useKumbhData();

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800 mb-2">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>Event Logistics Grid &bull; 5 Operational Sectors</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Operational Zones Intelligence
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Real-time crowd density, supply readiness, and risk telemetry across all Kumbh sectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => exportData('csv', 'Sector_Logistics_Health')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Export CSV</span>
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2">
              <span className="text-xs text-slate-500">Devotees:</span>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {zones.reduce((sum, z) => sum + z.crowdCount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map(z => {
            const isCritical = z.riskLevel === 'CRITICAL';
            const isWarning = z.riskLevel === 'WARNING';
            return (
              <div
                key={z.id}
                className={`p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between border bg-white shadow-xs hover:shadow-md ${
                  isCritical
                    ? 'border-rose-300'
                    : isWarning
                    ? 'border-amber-300'
                    : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-800 uppercase">
                          {z.code}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isCritical ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          isWarning ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {z.riskLevel}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{z.name.split('—')[1] || z.name}</h3>
                    </div>

                    {/* Readiness Ring / Badge */}
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-slate-900">
                        {z.readinessPercentage}%
                      </div>
                      <div className="text-[10px] text-slate-500">Readiness</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {z.description}
                  </p>

                  {/* Telemetry Row */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Crowd Density</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {z.crowdCount.toLocaleString()} ({z.crowdDensity})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Incoming Deliveries</span>
                      <span className="font-bold text-sky-700 font-mono">
                        {z.incomingDeliveriesCount} In Transit
                      </span>
                    </div>
                  </div>

                  {/* Supply Status Flags */}
                  <div className="space-y-1 text-xs mb-4">
                    {z.criticalCommodities.length > 0 && (
                      <div className="flex items-center gap-2 text-rose-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span className="font-semibold text-[11px]">
                          Critical Shortage: {z.criticalCommodities.join(', ').toUpperCase()}
                        </span>
                      </div>
                    )}
                    {z.warningCommodities.length > 0 && (
                      <div className="flex items-center gap-2 text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="font-semibold text-[11px]">
                          Stock Warning: {z.warningCommodities.join(', ').toUpperCase()}
                        </span>
                      </div>
                    )}
                    {z.criticalCommodities.length === 0 && z.warningCommodities.length === 0 && (
                      <div className="flex items-center gap-2 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-[11px]">All Supplies Sufficient (Safety Buffers Safe)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedZoneId(z.id);
                      setCurrentPage('zone-detail');
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-700 transition-colors"
                  >
                    <span>Inspect Zone Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => triggerCrowdSurge(z.id, 20)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors border border-slate-200"
                    title="Simulate 20% crowd influx"
                  >
                    +20% Surge
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

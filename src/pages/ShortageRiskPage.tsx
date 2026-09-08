import React from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  AlertOctagon,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap
} from 'lucide-react';

export const ShortageRiskPage: React.FC = () => {
  const {
    zones,
    setSelectedZoneId,
    setCurrentPage,
    approveRecommendation,
    batchApproveRecommendations,
    recommendations,
    simulateHourAdvance,
    triggerCrowdSurge,
    exportData,
    addToast
  } = useKumbhData();

  return (
    <div className="relative min-h-screen text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-mono text-rose-700 mb-2">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Predictive Shortage Engine &bull; Zero-Outage Thresholds</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Shortage & Risk Center
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Proactive mathematical detection: <span className="font-mono text-amber-700 font-semibold">Projected = Current + Incoming &minus; Predicted Demand</span>. Early warnings triggered hours before critical stock depletion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => triggerCrowdSurge('zone-b', 30)}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Simulate +30% Crowd Influx to Zone B"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>+30% Influx</span>
            </button>
            <button
              onClick={() => simulateHourAdvance()}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs text-xs text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
              title="Simulate 1 Hour of Devotee Consumption"
            >
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>+1h Burn</span>
            </button>
            <button
              onClick={() => exportData('csv', 'Shortage_Risk_Assessment')}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs text-xs text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
              title="Export Risk Matrix as CSV"
            >
              <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => batchApproveRecommendations()}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Batch Authorize All</span>
            </button>
          </div>
        </div>

        {/* Predictive Formula Explanation & Risk Timeline Card */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-amber-700 uppercase tracking-wider font-semibold">
                Risk Classification Formula
              </div>
              <div className="text-lg font-mono font-bold text-slate-900">
                Projected Inventory &lt; Safety Stock Threshold &rArr; Threat Warning
              </div>
              <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                KumbhSupply-AI avoids lagging indicators. If projected intake velocity causes stock-out within 4 hours, it triggers immediate emergency redistribution protocols.
              </p>
            </div>

            {/* Risk Timeline Stage Visualization */}
            <div className="flex items-center gap-2 sm:gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-center px-3 py-1.5 rounded-lg bg-emerald-100/70 text-emerald-800 text-xs font-bold border border-emerald-200">
                SAFE
                <span className="block text-[9px] font-normal text-emerald-700">&gt; 12h Buffer</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
              <div className="text-center px-3 py-1.5 rounded-lg bg-blue-100/70 text-blue-800 text-xs font-bold border border-blue-200">
                WATCH
                <span className="block text-[9px] font-normal text-blue-700">8h - 12h Buffer</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
              <div className="text-center px-3 py-1.5 rounded-lg bg-amber-100/70 text-amber-900 text-xs font-bold border border-amber-200">
                WARNING
                <span className="block text-[9px] font-normal text-amber-800">4h - 8h Buffer</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
              <div className="text-center px-3 py-1.5 rounded-lg bg-rose-100/80 text-rose-800 text-xs font-bold border border-rose-300 animate-pulse">
                CRITICAL
                <span className="block text-[9px] font-normal text-rose-700">&lt; 4h Buffer</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTIVE CRITICAL INCIDENT CARD (ZONE B MEDICAL) */}
        <div className="glass-panel p-6 sm:p-8 bg-rose-50/70 border border-rose-200 rounded-2xl shadow-sm">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-100 text-rose-600 border border-rose-200">
                  <AlertOctagon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-600 text-white font-mono shadow-sm">
                      CRITICAL RISK
                    </span>
                    <span className="text-xs text-rose-700 font-mono font-bold">
                      Stock-Out ETA: 3h 20m
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Zone B (Main Gathering Sector) &bull; Medical Supplies Deficit
                  </h2>
                </div>
              </div>

              {/* Arithmetic Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white border border-rose-200/80 text-xs font-mono shadow-sm">
                <div>
                  <span className="text-slate-500 text-[10px] block">Current Stock</span>
                  <span className="text-lg font-bold text-slate-900">120 kits</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Predicted Need</span>
                  <span className="text-lg font-bold text-amber-700">520 kits</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Incoming In-Transit</span>
                  <span className="text-lg font-bold text-sky-700">100 kits</span>
                </div>
                <div className="text-rose-600">
                  <span className="text-rose-700 text-[10px] block font-bold">Deficit Shortfall</span>
                  <span className="text-lg font-bold">-300 kits</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Surge of 132,000 devotees at Main Gathering Ghat will exhaust emergency trauma kits and hydration packs before the peak evening ceremony. Proactive dispatch required immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full lg:w-72 space-y-3 p-5 rounded-xl bg-white border border-rose-200 shadow-sm">
              <div className="text-xs font-mono text-amber-800 font-bold uppercase mb-2">
                Recommended Resolution
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                Dispatch 500 kits from Central Warehouse via Dedicated Emergency Lane.
              </div>

              <button
                onClick={() => {
                  approveRecommendation('rec-01');
                  setCurrentPage('redistribution');
                }}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Authorize Transfer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedZoneId('zone-b');
                  setCurrentPage('zone-detail');
                }}
                className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                Inspect Zone B Telemetry
              </button>
            </div>
          </div>
        </div>

        {/* ALL ZONES RISK OVERVIEW TABLE */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase mb-4 pb-2 border-b border-slate-200">
            Sector Vulnerability Index
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map(z => (
              <div key={z.id} className="p-4 rounded-xl bg-slate-50/90 border border-slate-200 space-y-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs">{z.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    z.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                    z.riskLevel === 'WARNING' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                    'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {z.riskLevel} ({z.riskScore}/100)
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Crowd Density:</span>
                    <span className="text-slate-900 font-mono font-semibold">{z.crowdCount.toLocaleString()} ({z.crowdDensity})</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Critical Deficits:</span>
                    <span className="text-rose-600 font-bold">
                      {z.criticalCommodities.length ? z.criticalCommodities.join(', ') : 'None'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedZoneId(z.id);
                    setCurrentPage('zone-detail');
                  }}
                  className="w-full py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Detailed Telemetry</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

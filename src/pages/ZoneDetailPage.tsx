import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  ArrowLeft,
  Droplets,
  Utensils,
  Cross,
  Trash2,
  Fuel,
  AlertTriangle,
  Clock,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { DEMAND_TIME_SERIES } from '../data/kumbhData';

export const ZoneDetailPage: React.FC = () => {
  const {
    selectedZoneId,
    zones,
    setCurrentPage,
    approveRecommendation,
    recommendations,
    triggerCrowdSurge,
    exportData,
    addToast
  } = useKumbhData();

  const [activeCommodityKey, setActiveCommodityKey] = useState<string>('medical');

  const zone = zones.find(z => z.id === selectedZoneId) || zones[1]; // Default to Zone B

  const commStatus = zone.commodities[activeCommodityKey] || zone.commodities['water'];

  const categoryTabs = [
    { key: 'medical', label: 'Medical', icon: Cross, color: '#f43f5e' },
    { key: 'water', label: 'Water', icon: Droplets, color: '#38bdf8' },
    { key: 'food', label: 'Food', icon: Utensils, color: '#fbbf24' },
    { key: 'sanitation', label: 'Sanitation', icon: Trash2, color: '#10b981' },
    { key: 'fuel', label: 'Fuel', icon: Fuel, color: '#f97316' },
    { key: 'emergency', label: 'Emergency', icon: AlertTriangle, color: '#ef4444' }
  ];

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setCurrentPage('zones')}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Zones</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportData('csv', `Zone_Telemetry_${zone.code}`)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium transition-colors shadow-xs"
            >
              Export CSV
            </button>
            <button
              onClick={() => triggerCrowdSurge(zone.id, 15)}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-mono text-amber-900 transition-colors"
            >
              +15% Crowd Spike
            </button>
          </div>
        </div>

        {/* Zone Header Banner */}
        <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                  {zone.code}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                  zone.riskLevel === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  zone.riskLevel === 'WARNING' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {zone.demandLevel} &bull; {zone.riskLevel}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">{zone.name}</h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {zone.description}
              </p>
            </div>

            <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-500 text-xs block">Active Crowd</span>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {zone.crowdCount.toLocaleString()}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 text-xs block">Readiness</span>
                <span className="text-2xl font-bold font-mono text-amber-600">
                  {zone.readinessPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Commodity Selector Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 overflow-x-auto no-scrollbar">
            {categoryTabs.map(tab => {
              const Icon = tab.icon;
              const isSelected = activeCommodityKey === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCommodityKey(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isSelected ? '#f59e0b' : tab.color }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Commodity Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Current Inventory */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <span className="text-[11px] text-slate-500 block">Current Inventory</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {commStatus.currentInventory.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">On-site cache</span>
          </div>

          {/* 2. Predicted Demand (24h) */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <span className="text-[11px] text-slate-500 block">Predicted Demand (24h)</span>
            <div className="text-xl font-bold font-mono text-amber-700 mt-1">
              {commStatus.predictedDemand24h.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">ML Random Forest</span>
          </div>

          {/* 3. Incoming Stock */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <span className="text-[11px] text-slate-500 block">Incoming Stock</span>
            <div className="text-xl font-bold font-mono text-sky-700 mt-1">
              +{commStatus.incomingStock.toLocaleString()}
            </div>
            <span className="text-[10px] text-sky-700 font-medium">En route on trucks</span>
          </div>

          {/* 4. Safety Stock */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <span className="text-[11px] text-slate-500 block">Safety Stock Buffer</span>
            <div className="text-xl font-bold font-mono text-slate-800 mt-1">
              {commStatus.safetyStock.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Mandatory threshold</span>
          </div>

          {/* 5. Consumption Rate */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
            <span className="text-[11px] text-slate-500 block">Consumption Rate</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {commStatus.consumptionRatePerHour.toLocaleString()}/hr
            </div>
            <span className="text-[10px] text-slate-400">Dynamic hourly draw</span>
          </div>

          {/* 6. Stock-Out ETA */}
          <div className={`p-4 rounded-xl border shadow-xs ${
            commStatus.stockoutEtaHours < 5
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <span className="text-[11px] text-slate-500 block">Stock-Out ETA</span>
            <div className="text-xl font-bold font-mono mt-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{commStatus.stockoutEtaHours}h</span>
            </div>
            <span className={`text-[10px] font-bold ${
              commStatus.stockoutEtaHours < 5 ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {commStatus.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* TWO COLS: EXPLAINABLE AI REASONING & DEMAND FORECAST VISUALIZATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 6 COLS: EXPLAINABLE AI: WHY DEMAND IS CHANGING */}
          <div className="lg:col-span-6 p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                Explainable AI &bull; Why Demand Is Changing
              </h3>
            </div>

            <div className="space-y-4">
              {/* Factor 1: Crowd Delta */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900">Crowd Influx Dynamics</span>
                  <span className="font-mono text-rose-600 font-bold">{zone.explainableFactors.crowdDelta}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time optical drone counts and mobile transit taps indicate rapid crowd accumulation into this sector.
                </p>
              </div>

              {/* Factor 2: Event Trigger */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900">Religious Ritual Event</span>
                  <span className="font-mono text-sky-700 font-bold">Procession Event</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {zone.explainableFactors.eventTrigger}
                </p>
              </div>

              {/* Factor 3: Weather Impact */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900">Meteorological Heat Index</span>
                  <span className="font-mono text-orange-700 font-bold">+3°C Above Baseline</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {zone.explainableFactors.weatherImpact}
                </p>
              </div>

              {/* Factor 4: Historical Peak Pattern */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900">Historical Event Peak Pattern</span>
                  <span className="font-mono text-emerald-700 font-bold">1.42x Surge Coefficient</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {zone.explainableFactors.historicalPattern}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT 6 COLS: 24-HOUR FORECAST CHART & DISPATCH TRIGGER */}
          <div className="lg:col-span-6 p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                    24h Demand Trend ({activeCommodityKey.toUpperCase()})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  Confidence Interval: 95%
                </span>
              </div>

              {/* Demand SVG Bar / Area Visualization */}
              <div className="h-44 w-full flex items-end gap-2 pt-6 px-2">
                {DEMAND_TIME_SERIES.map((pt, idx) => {
                  const maxVal = 32000;
                  const heightPercent = Math.round((pt.predicted / maxVal) * 100);
                  const isPeak = pt.predicted > 25000;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isPeak ? 'bg-rose-500' : 'bg-sky-500/80 hover:bg-sky-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] font-mono text-slate-500 mt-2 block rotate-[-45deg] origin-top-left">
                        {pt.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-sky-500" />
                  <span>Predicted Hourly Demand</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                  <span>Peak Snan Surge Interval</span>
                </div>
              </div>
            </div>

            {/* Replenish CTA */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Need Replenishment for this Zone?</div>
                <div className="text-[11px] text-slate-500">Review AI recommendations or manual dispatch.</div>
              </div>
              <button
                onClick={() => setCurrentPage('redistribution')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>Smart Transfer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

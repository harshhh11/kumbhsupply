import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  TrendingUp,
  Layers,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Database,
  Users,
  Sun,
  Droplets,
  HelpCircle
} from 'lucide-react';

export const DemandPage: React.FC = () => {
  const {
    selectedHorizon,
    setSelectedHorizon,
    multiCommodities,
    multiZones,
    systemForecasts,
    simulateWeatherSpike,
    triggerCrowdSurge,
    exportData,
    addToast
  } = useKumbhData();

  const [filterZone, setFilterZone] = useState<string>('zone-b');
  const [filterCommodity, setFilterCommodity] = useState<string>('water');

  const selectedZoneObj = multiZones.find(z => z.id === filterZone) || multiZones[0];
  const selectedCommObj = multiCommodities[filterCommodity] || multiCommodities['water'];

  // Lookup forecast item for selected zone & commodity
  const forecastItem = systemForecasts.forecasts.find(
    f => f.zoneId === filterZone && f.commodityId === filterCommodity
  ) || systemForecasts.forecasts[0];

  const getHorizonValue = (h: '1h' | '3h' | '6h' | '12h' | '24h' | '48h') => {
    switch (h) {
      case '1h': return forecastItem.forecasts.h1;
      case '3h': return Math.round(forecastItem.forecasts.h1 * 2.9);
      case '6h': return forecastItem.forecasts.h6;
      case '12h': return forecastItem.forecasts.h12;
      case '24h': return forecastItem.forecasts.h24;
      case '48h': return forecastItem.forecasts.h48;
      default: return forecastItem.forecasts.h1;
    }
  };

  const currentHorizonVal = getHorizonValue(selectedHorizon);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Demand Intelligence &bull; Continuous Update</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Expected Supply Need
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Real-time estimated supply requirements across all 12 zones, automatically calculated from crowd density, temperature, and daily usage patterns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => simulateWeatherSpike('heatwave')}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Simulate heatwave (+8.5°C) across all zones"
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Heat (+8.5°C)</span>
            </button>
            <button
              onClick={() => triggerCrowdSurge(filterZone, 30)}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Simulate +30% crowd influx in selected zone"
            >
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Simulate Crowd (+30%)</span>
            </button>
            <button
              onClick={() => exportData('csv', 'Expected_Supply_Need_Report')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Global Selectors Bar */}
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Zone (12 Locations)
            </label>
            <select
              value={filterZone}
              onChange={e => setFilterZone(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              {multiZones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Supply Item (9 Categories)
            </label>
            <select
              value={filterCommodity}
              onChange={e => setFilterCommodity(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              {Object.values(multiCommodities).map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Forecast Timeframe
            </label>
            <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1 rounded-xl">
              {(['1h', '3h', '6h', '12h', '24h', '48h'] as const).map(h => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`py-1 text-[11px] font-bold rounded-lg transition-all text-center cursor-pointer ${
                    selectedHorizon === h
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Intelligence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Expected Need</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Next {selectedHorizon}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {currentHorizonVal.toLocaleString()} <span className="text-sm font-semibold text-slate-500">{selectedCommObj.unit}</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className="font-medium text-slate-600">Expected Range:</span>
              <span className="font-semibold text-slate-800">{forecastItem.ci95Lower.toLocaleString()} &ndash; {forecastItem.ci95Upper.toLocaleString()} {selectedCommObj.unit}</span>
            </div>
          </div>

          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Time Until Stock Runs Out
            </div>
            <div className={`text-3xl font-extrabold mt-2 ${
              forecastItem.hoursToStockout < 4.0 ? 'text-red-600' : forecastItem.hoursToStockout < 8.0 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {forecastItem.hoursToStockout} <span className="text-sm font-semibold text-slate-500">hours</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span>Current Stock on Hand:</span>
              <span className="font-bold text-slate-800">{forecastItem.currentStock.toLocaleString()} {selectedCommObj.unit}</span>
            </div>
          </div>

          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Hourly Consumption Rate
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {forecastItem.burnRateHourly.toLocaleString()} <span className="text-sm font-semibold text-slate-500">{selectedCommObj.unit}/hour</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Minimum Safe Reserve: <span className="font-bold text-slate-800">{forecastItem.safetyStockThreshold.toLocaleString()} {selectedCommObj.unit}</span>
            </div>
          </div>

          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Shortage Risk Level
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border ${
                forecastItem.shortageRisk === 'CRITICAL'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : forecastItem.shortageRisk === 'WARNING'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {forecastItem.shortageRisk === 'CRITICAL' && <ShieldAlert className="w-4 h-4" />}
                {forecastItem.shortageRisk === 'WARNING' && <Clock className="w-4 h-4" />}
                {forecastItem.shortageRisk === 'NOMINAL' && <CheckCircle2 className="w-4 h-4" />}
                <span>{forecastItem.shortageRisk} PRIORITY</span>
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Status: <span className="text-slate-800 font-medium">
                {forecastItem.shortageRisk === 'CRITICAL' ? 'Immediate transfer needed' : forecastItem.shortageRisk === 'WARNING' ? 'Monitor closely' : 'Sufficient supply available'}
              </span>
            </div>
          </div>
        </div>

        {/* Operational Analysis: Drivers + Upcoming Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Drivers of Increased Need */}
          <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-600" />
                <span>Why is Demand Increasing in {selectedZoneObj.name}?</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Key operational factors driving up consumption in this sector:
            </p>

            <div className="space-y-3 pt-2">
              {forecastItem.topCausalFactors.map((factor, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{factor.name}</span>
                    <span className="font-bold text-amber-700">+{factor.impactScore}% increase</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(15, factor.impactScore * 1.5))}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500">{factor.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Forward Hours Requirement Table */}
          <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Expected Requirements by Time Window</span>
              </h2>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Live Estimates
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Total quantity required at each milestone to prevent stock-outs:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2">Timeframe</th>
                    <th className="pb-2 text-right">Estimated Need</th>
                    <th className="pb-2 text-right">Min Safe Buffer</th>
                    <th className="pb-2 text-right">Hourly Burn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 font-mono">Next 1 Hour</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{forecastItem.forecasts.h1.toLocaleString()} {selectedCommObj.unit}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.safetyStockThreshold.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.burnRateHourly}/h</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 font-mono">Next 6 Hours</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{forecastItem.forecasts.h6.toLocaleString()} {selectedCommObj.unit}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.safetyStockThreshold.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.burnRateHourly}/h</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 font-mono">Next 12 Hours</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{forecastItem.forecasts.h12.toLocaleString()} {selectedCommObj.unit}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.safetyStockThreshold.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.burnRateHourly}/h</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 font-mono">Next 24 Hours</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{forecastItem.forecasts.h24.toLocaleString()} {selectedCommObj.unit}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.safetyStockThreshold.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.burnRateHourly}/h</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-800 font-mono">Next 48 Hours</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{forecastItem.forecasts.h48.toLocaleString()} {selectedCommObj.unit}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.safetyStockThreshold.toLocaleString()}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">{forecastItem.burnRateHourly}/h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Operational Status Footnote */}
        <div className="glass-panel p-4 bg-slate-900 text-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              OPERATIONAL STATUS: ACTIVE
            </span>
            <span className="text-slate-300">
              All 12 sector streams synchronizing continuously. Need technical verification? Visit Admin Console.
            </span>
          </div>
          <div className="text-slate-400">
            Sector: <span className="text-white font-semibold">{selectedZoneObj.name}</span> &bull; Updated just now
          </div>
        </div>
      </div>
    </div>
  );
};

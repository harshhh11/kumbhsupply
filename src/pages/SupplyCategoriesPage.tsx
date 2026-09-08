import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Layers,
  Droplets,
  Utensils,
  Cross,
  Trash2,
  Fuel,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Truck
} from 'lucide-react';

export const SupplyCategoriesPage: React.FC = () => {
  const {
    commodities,
    setCurrentPage,
    setSelectedCommodityId,
    triggerEmergencyReorder,
    exportData,
    addToast
  } = useKumbhData();
  const [activeCategory, setActiveCategory] = useState<string>('water');

  const iconMap: Record<string, any> = {
    Droplets,
    Utensils,
    Cross,
    Trash2,
    Fuel,
    Layers,
    AlertTriangle,
    Sparkles
  };

  return (
    <div className="relative min-h-screen text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-mono text-sky-800 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Commodity Decision Intelligence</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Essential Supply Categories
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              KumbhSupply-AI is a comprehensive multi-commodity platform managing 8 vital resource classes across all temporary city sectors.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => exportData('csv', 'Commodity_Supply_Manifest')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Export Commodity Manifest (CSV)</span>
            </button>
          </div>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {commodities.map(c => {
            const Icon = iconMap[c.iconName] || Layers;
            return (
              <div
                key={c.id}
                className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80" style={{ color: c.color }}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-slate-900">
                        {c.readinessScore}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Readiness</div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{c.name}</h3>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Available:</span>
                      <span className="font-bold text-slate-900">
                        {c.totalAvailable.toLocaleString()} {c.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Predicted Demand (24h):</span>
                      <span className="font-bold text-amber-700">
                        {c.totalPredictedDemand.toLocaleString()} {c.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Zones at Risk:</span>
                      <span className={`font-bold ${c.zonesAtRisk > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {c.zonesAtRisk} Sector{c.zonesAtRisk === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Deliveries:</span>
                      <span className="font-bold text-sky-700">
                        {c.activeDeliveries} Vehicles
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => triggerEmergencyReorder('wh-central', c.id, 10000)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors flex items-center gap-1"
                    title="Request emergency supplier procurement batch"
                  >
                    <span>+10k Reorder</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCommodityId(c.id);
                      setCurrentPage('command');
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Filter on Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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

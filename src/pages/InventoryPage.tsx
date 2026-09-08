import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Package,
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Warehouse as WarehouseIcon,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Database,
  Layers,
  Truck
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const {
    multiCommodities,
    multiZones,
    multiWarehouses,
    systemForecasts,
    triggerEmergencyReorder,
    exportData,
    addToast
  } = useKumbhData();

  const [filterCommodity, setFilterCommodity] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<'all' | 'critical' | 'warning' | 'nominal'>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('wh-central');

  // Compute aggregated inventory metrics across all 12 zones
  const zoneInventoryItems = systemForecasts.forecasts.filter(item => {
    const matchComm = filterCommodity === 'all' || item.commodityId === filterCommodity;
    const matchRisk = filterRisk === 'all' || item.shortageRisk.toLowerCase() === filterRisk;
    return matchComm && matchRisk;
  });

  const totalCurrentStock = zoneInventoryItems.reduce((acc, i) => acc + i.currentStock, 0);
  const criticalDeficitCount = zoneInventoryItems.filter(i => i.shortageRisk === 'CRITICAL').length;
  const warningDeficitCount = zoneInventoryItems.filter(i => i.shortageRisk === 'WARNING').length;

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
              <Boxes className="w-3.5 h-3.5 text-emerald-700" />
              <span>Real-Time Supply & Stock Tracking</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Supply & Storage Depots
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Current on-hand stock, usage rates, and time remaining across all 12 zones and 3 major supply depots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                triggerEmergencyReorder(selectedWarehouse, filterCommodity === 'all' ? 'water' : filterCommodity, 5000);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Order Stock for Depot</span>
            </button>
            <button
              onClick={() => exportData('csv', 'Supply_Inventory_Report')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Filter by Supply Item
              </label>
              <select
                value={filterCommodity}
                onChange={e => setFilterCommodity(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
              >
                <option value="all">All 9 Essential Commodities</option>
                {Object.values(multiCommodities).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Filter Status
              </label>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['all', 'critical', 'warning', 'nominal'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => setFilterRisk(tier)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                      filterRisk === tier
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tier === 'all' ? 'All' : tier === 'critical' ? 'Urgent (<4h)' : tier === 'warning' ? 'Low (4-8h)' : 'Sufficient (>8h)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="font-semibold text-slate-700">Urgent: {criticalDeficitCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-700">Running Low: {warningDeficitCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700">Safe: {zoneInventoryItems.length - criticalDeficitCount - warningDeficitCount}</span>
            </div>
          </div>
        </div>

        {/* Regional Warehouse Capacity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {multiWarehouses.map(wh => (
            <div
              key={wh.id}
              onClick={() => setSelectedWarehouse(wh.id)}
              className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedWarehouse === wh.id
                  ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-slate-500">{wh.code}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  {wh.currentFleetAvailable} Vehicles Ready
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">{wh.name}</h3>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Depot Space</span>
                  <span className="font-bold text-slate-800">{wh.totalCapacitySqm.toLocaleString()} m²</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dispatch Speed</span>
                  <span className="font-bold text-slate-800">{wh.throughputPerHour} items/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Master Supply Status Table */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Zone-by-Zone Stock Status & Countdown</span>
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Showing {zoneInventoryItems.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/80">
                  <th className="py-2.5 px-3">Zone / Location</th>
                  <th className="py-2.5 px-3">Supply Item</th>
                  <th className="py-2.5 px-3 text-right">Available Stock</th>
                  <th className="py-2.5 px-3 text-right">Usage Rate</th>
                  <th className="py-2.5 px-3 text-right">Safe Minimum</th>
                  <th className="py-2.5 px-3 text-right">Hours Remaining</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zoneInventoryItems.map((item, idx) => {
                  const commMeta = multiCommodities[item.commodityId] || multiCommodities['water'];
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {item.zoneName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700">{item.commodityName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">({commMeta.unit})</span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                        {item.currentStock.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {item.burnRateHourly.toLocaleString()}/h
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {item.safetyStockThreshold.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded-md ${
                          item.hoursToStockout < 4.0
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : item.hoursToStockout < 8.0
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {item.hoursToStockout} hrs
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${
                          item.shortageRisk === 'CRITICAL'
                            ? 'text-red-700'
                            : item.shortageRisk === 'WARNING'
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}>
                          {item.shortageRisk === 'CRITICAL' && <AlertTriangle className="w-3.5 h-3.5" />}
                          {item.shortageRisk === 'WARNING' && <Clock className="w-3.5 h-3.5" />}
                          {item.shortageRisk === 'NOMINAL' && <ShieldCheck className="w-3.5 h-3.5" />}
                          <span>{item.shortageRisk === 'CRITICAL' ? 'URGENT' : item.shortageRisk === 'WARNING' ? 'RUNNING LOW' : 'SAFE'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            triggerEmergencyReorder(selectedWarehouse, item.commodityId, item.safetyStockThreshold);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Send Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

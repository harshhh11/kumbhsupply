import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Truck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Filter,
  Navigation,
  ArrowRight
} from 'lucide-react';

export const DeliveriesPage: React.FC = () => {
  const {
    deliveries,
    commodities,
    rerouteVehicle,
    syncTelemetry,
    exportData,
    setCurrentPage,
    addToast
  } = useKumbhData();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredDeliveries = deliveries.filter(
    d => filterStatus === 'ALL' || d.status === filterStatus
  );

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
              <Truck className="w-3.5 h-3.5" />
              <span>Real-Time Fleet Dispatch Telemetry &bull; Active Logistics Grid</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Essential Supply Deliveries
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Live automated status monitoring for potable water tankers, emergency medical express vans, dry ration carriers, and sanitation tenders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => syncTelemetry()}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
              title="Ping GPS telemetry beacons"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              <span>Sync GPS</span>
            </button>
            <button
              onClick={() => exportData('csv', 'Fleet_Dispatch_Telemetry')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
              title="Download fleet log as CSV"
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
          {['ALL', 'IN TRANSIT', 'LOADING', 'ASSIGNED', 'DELAYED', 'DELIVERED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Deliveries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeliveries.map(del => {
            const isDelivered = del.status === 'DELIVERED';
            const isCritical = del.priority === 'CRITICAL';
            return (
              <div
                key={del.id}
                className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-700">{del.code}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {del.quantity.toLocaleString()} {del.unit} {del.commodityName}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      del.status === 'IN TRANSIT' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                      del.status === 'LOADING' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      del.status === 'DELAYED' ? 'bg-orange-50 text-orange-800 border-orange-200' :
                      'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {del.status}
                    </span>
                  </div>

                  {/* Route Vector */}
                  <div className="text-xs space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 mt-3">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>From:</span>
                      <span className="font-semibold text-slate-900">{del.sourceName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>To:</span>
                      <span className="font-semibold text-sky-700">{del.destinationName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Route:</span>
                      <span className="font-mono text-slate-700">{del.routeType} ({del.routeDistanceKm} km)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                      <span>Transit Progress:</span>
                      <span className="text-slate-900 font-bold">{del.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDelivered ? 'bg-emerald-600' : 'bg-gradient-to-r from-sky-500 to-amber-500'
                        }`}
                        style={{ width: `${del.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {/* Vehicle & Driver Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-3">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-800">{del.vehicleNumber}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{del.driverName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Est. Arrival</span>
                      <span className="text-sm font-bold font-mono text-amber-700">
                        {isDelivered ? 'COMPLETED' : `ETA ${del.etaMinutes}m`}
                      </span>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {!isDelivered && (
                      <button
                        onClick={() => rerouteVehicle(del.id)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="Reroute via alternate non-congested corridor"
                      >
                        <Navigation className="w-3 h-3 text-amber-700" />
                        <span>Reroute Bypass</span>
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentPage('routes')}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>3D Route</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

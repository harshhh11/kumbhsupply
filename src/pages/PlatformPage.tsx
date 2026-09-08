import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import {
  Database,
  TrendingUp,
  Eye,
  AlertOctagon,
  ArrowLeftRight,
  Route,
  Truck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const PlatformPage: React.FC = () => {
  const { setCurrentPage, approveRecommendation } = useKumbhData();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'DATA INGESTION',
      subtitle: 'Multi-Agency Aggregate Data',
      icon: Database,
      color: '#38bdf8',
      description:
        'Continuous ingestion of aggregate pilgrim counts, weather stations (ambient heat index), road traffic police notifications, and warehouse inventory updates.',
      telemetry: [
        { label: 'Ingestion Sources', val: '6 Live Streams' },
        { label: 'Sampling Rate', val: '5 min telemetry' },
        { label: 'Data Privacy', val: 'Aggregate Only (No PII)' }
      ]
    },
    {
      num: '02',
      title: 'PREDICT DEMAND',
      subtitle: 'Ensemble Machine Learning',
      icon: TrendingUp,
      color: '#fbbf24',
      description:
        'Random Forest and XGBoost models project zone-wise consumption across 1h, 3h, 6h, and 24h horizons, incorporating Shahi Snan bathing timetables and heat index.',
      telemetry: [
        { label: 'Primary Model', val: 'Random Forest (R²=0.962)' },
        { label: 'Forecast Latency', val: '14 ms' },
        { label: 'Horizons', val: '1h, 3h, 6h, 24h' }
      ]
    },
    {
      num: '03',
      title: 'MONITOR INVENTORY',
      subtitle: 'Centralized Visibility',
      icon: Eye,
      color: '#a855f7',
      description:
        'Multi-tier stock visibility tracking Available, Safety Stock, Reserved, and Transferable goods across Central Warehouse, Satpur, Ambad, and Zone cache points.',
      telemetry: [
        { label: 'Managed Commodities', val: '8 Essential Categories' },
        { label: 'Storage Hubs', val: '3 Warehouses + 5 Sectors' },
        { label: 'Sync State', val: 'Live Reconciled' }
      ]
    },
    {
      num: '04',
      title: 'DETECT SHORTAGE',
      subtitle: 'Predictive Stock-Out Risk',
      icon: AlertOctagon,
      color: '#f43f5e',
      description:
        'Automated mathematical detection: Projected Inventory = Current + Incoming - Predicted Demand. Triggers Safe, Watch, Warning, or Critical flags before stock runs out.',
      telemetry: [
        { label: 'Zone B Risk Level', val: 'CRITICAL (3h 20m ETA)' },
        { label: 'Prediction Lead Time', val: '3.5 Hours' },
        { label: 'False Alarm Rate', val: '< 1.8%' }
      ]
    },
    {
      num: '05',
      title: 'RECOMMEND TRANSFER',
      subtitle: 'Smart Redistribution Engine',
      icon: ArrowLeftRight,
      color: '#10b981',
      description:
        'Calculates What, How Much, Where, Which Warehouse, When, and Priority. Presents clear before-and-after stock balance with mandatory human approval.',
      telemetry: [
        { label: 'Recommended Action', val: 'Transfer 500 Medical Kits' },
        { label: 'Source Depot', val: 'Central Warehouse CW-01' },
        { label: 'Destination', val: 'Zone B (Main Gathering Sector)' }
      ]
    },
    {
      num: '06',
      title: 'OPTIMIZE ROUTE',
      subtitle: 'Crowd-Aware Navigation',
      icon: Route,
      color: '#f97316',
      description:
        'Dijkstra and NetworkX routing that bypasses congested pedestrian corridors, respects bridge weight capacities, and dynamically navigates traffic closures.',
      telemetry: [
        { label: 'Primary Path', val: '8.5 km (32 mins)' },
        { label: 'Alternate Route', val: '10.2 km (37 mins)' },
        { label: 'Bridge Clearance', val: 'Pontoon 04 Approved' }
      ]
    },
    {
      num: '07',
      title: 'DELIVER & TRACK',
      subtitle: 'Active Fleet Telemetry',
      icon: Truck,
      color: '#38bdf8',
      description:
        'Real-time vehicle GPS coordinates, driver communication, ETA updates, and dispatch checkpoint logging from loading bay to destination depot.',
      telemetry: [
        { label: 'Active Fleet', val: '28 Tankers & Vans' },
        { label: 'Avg Dispatch Time', val: '14.2 minutes' },
        { label: 'On-Time Rate', val: '96.8%' }
      ]
    },
    {
      num: '08',
      title: 'VERIFY RECOVERY',
      subtitle: 'Closed-Loop Resilience',
      icon: CheckCircle2,
      color: '#10b981',
      description:
        'Confirms physical intake at the zone warehouse, reconciles inventory registers, updates ML training logs, and verifies that the zone returns to SAFE status.',
      telemetry: [
        { label: 'Zone B Post-State', val: 'Stock restored to SAFE' },
        { label: 'Stockout Averted', val: '100% Zero Outage' },
        { label: 'Feedback Loop', val: 'Telemetry Re-trained' }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-8 max-w-7xl mx-auto select-none bg-[#f8fafc] text-slate-800">
      {/* Page Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Core Operational Workflow Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How KumbhSupply-AI Works
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          From multi-stream data ingestion to verified stock replenishment: an 8-stage closed-loop decision support engine engineered for large-scale temporary mass gathering events.
        </p>
      </div>

      {/* 8-Stage Interactive Process Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-8">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm border border-slate-900 scale-105'
                  : 'bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className={`text-[10px] font-mono mb-1 ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>{s.num}</div>
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-4 h-4" style={{ color: isActive ? '#f59e0b' : s.color }} />
                <span className={`text-xs font-bold tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {s.title.split(' ')[0]}
                </span>
              </div>
              <div className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{s.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Card */}
      {(() => {
        const cur = steps[activeStep];
        const Icon = cur.icon;
        return (
          <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl mb-12 shadow-xs">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200" style={{ color: cur.color }}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-amber-800 font-bold">
                      STAGE {cur.num} OF 08
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">{cur.title}</h2>
                    <p className="text-sm text-slate-500">{cur.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pt-2">
                  {cur.description}
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  {activeStep < steps.length - 1 ? (
                    <button
                      onClick={() => setActiveStep(prev => prev + 1)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
                    >
                      <span>Proceed to Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentPage('command')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                    >
                      <span>Explore Live Command Center</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                    disabled={activeStep === 0}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs disabled:opacity-40 border border-slate-200"
                  >
                    Previous
                  </button>
                </div>
              </div>

              {/* Stage Telemetry Grid */}
              <div className="w-full lg:w-80 space-y-3 p-5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                  Stage Telemetry & Parameters
                </h4>
                {cur.telemetry.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-200/60 text-xs">
                    <span className="text-slate-500">{t.label}:</span>
                    <span className="font-semibold text-slate-800 font-mono">{t.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Core Philosophy Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-white border border-slate-200/90 rounded-xl shadow-xs">
          <div className="text-amber-700 font-bold text-lg mb-1">RIGHT RESOURCE</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-commodity matching ensures precise allocation of potable water, rations, ICU trauma medicines, and bio-toilet enzyme packets.
          </p>
        </div>
        <div className="p-6 bg-white border border-slate-200/90 rounded-xl shadow-xs">
          <div className="text-sky-700 font-bold text-lg mb-1">RIGHT PLACE</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zone-level geospatial granularity directs dispatches directly to Main Ghat, Community Camps, or Regional Transit hubs.
          </p>
        </div>
        <div className="p-6 bg-white border border-slate-200/90 rounded-xl shadow-xs">
          <div className="text-emerald-700 font-bold text-lg mb-1">RIGHT TIME</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Predictive lead times dispatch replenishment 3+ hours before stock-outs, mitigating stampede hazards and shortages.
          </p>
        </div>
      </div>
    </div>
  );
};

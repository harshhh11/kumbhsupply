import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Cpu,
  Database,
  Layers,
  Route,
  ArrowDown,
  Server,
  Activity,
  Smartphone,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(0);

  const architectureLayers = [
    {
      title: '01. MULTI-SOURCE DATA INGESTION',
      tech: 'FastAPI • Kafka • IoT MQTT • OpenMeteo',
      inputs: ['Aggregated Pilgrim Counters', 'Event Calendar & Surge Gathering Flag', 'Historical Event Consumption', 'Meteorological Stations (Heat Index)', 'Warehouse Stocks', 'Traffic Police Road Restrictions'],
      description: 'Ingests real-time and planned environmental telemetry into unified streaming buffers without capturing PII.'
    },
    {
      title: '02. DATA PROCESSING & NORMALIZATION',
      tech: 'Python 3.11 • Pandas • NumPy • Polars',
      inputs: ['Timestamp Alignment', 'Outlier Filtering', 'Spatial Interpolation across Event Sectors', 'Lag Feature Engineering (1h, 3h, 6h, 24h)'],
      description: 'Standardizes temporal consumption waveforms into feature vectors with weather multipliers and day-of-week weights.'
    },
    {
      title: '03. DEMAND FORECASTING ENGINE',
      tech: 'Scikit-Learn • XGBoost • Linear Models',
      inputs: ['Linear Regression (Baseline Benchmark)', 'Random Forest Regressor (Primary Engine, R²=0.962)', 'XGBoost Comparative Evaluation'],
      description: 'Projects consumption for all 8 commodities across 1h, 3h, 6h, and 24h horizons with 95% confidence intervals.'
    },
    {
      title: '04. INVENTORY & SHORTAGE RISK ENGINE',
      tech: 'Deterministic Mathematical Optimization',
      inputs: ['Projected Inventory = Current + Incoming - Predicted Demand', 'Safety Stock Buffer Checks', 'Risk Classification (SAFE, WATCH, WARNING, CRITICAL)'],
      description: 'Constantly audits sector stockpiles against projected consumption to detect stock-outs hours before occurrence.'
    },
    {
      title: '05. SMART REDISTRIBUTION ENGINE',
      tech: 'PuLP Linear Programming • Scipy Optimize',
      inputs: ['Source Stock Availability', 'Destination Deficit Urgency', 'Transfer Volume Minimization', 'Human Approval Verification Gate'],
      description: 'Formulates optimal replenishment transfers from Central and Regional hubs with before-and-after balance projections.'
    },
    {
      title: '06. CROWD-AWARE ROUTE OPTIMIZATION',
      tech: 'NetworkX • Dijkstra • OpenStreetMap Graph',
      inputs: ['Road Closure Graph', 'Pontoon Bridge Weight Caps', 'Pedestrian Crowd Density Penalty', 'Primary vs Alternative Path Scoring'],
      description: 'Calculates feasible delivery transit routes avoiding crowded bathing corridors and police barricades.'
    },
    {
      title: '07. STORAGE & DATABASE PERSISTENCE',
      tech: 'PostgreSQL 16 • PostGIS • TimescaleDB',
      inputs: ['Spatial GeoJSON Layers', 'Time-Series Sensor Records', 'Audit Logs & Dispatch History', 'Transfer Signoff Records'],
      description: 'Stores immutable operational logs and geospatial road networks with sub-millisecond query performance.'
    },
    {
      title: '08. APPLICATION & DECISION-SUPPORT UI',
      tech: 'React 19 • TypeScript • Tailwind CSS • Three.js WebGL',
      inputs: ['Desktop Command Twin', 'Mobile Field Vehicle UI', 'Explainable AI Reasoning Panels', 'Real-Time Alert Notifications'],
      description: 'Delivers the master digital twin interface with floating glass panels, subtle 3D camera transitions, and tactile operations.'
    }
  ];

  return (
    <div className="relative min-h-screen text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-mono text-purple-800 mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>End-to-End System Specifications</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            System Architecture & Pipeline
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Modular multi-tier technical architecture powering data ingestion, machine learning forecasts, inventory risk mathematics, and route optimization.
          </p>
        </div>

        {/* Visual Architecture Flow Stack */}
        <div className="space-y-3">
          {architectureLayers.map((layer, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                onClick={() => setSelectedLayer(idx)}
                className={`w-full glass-panel p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  selectedLayer === idx
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm scale-101'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-amber-800 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-wide">{layer.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 font-medium">
                    {layer.tech}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {layer.description}
                </p>

                {/* Sub-inputs chips */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {layer.inputs.map((inp, iIdx) => (
                    <span key={iIdx} className="text-[10px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-mono">
                      {inp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connecting Down Arrow */}
              {idx < architectureLayers.length - 1 && (
                <div className="py-1 text-slate-400">
                  <ArrowDown className="w-4 h-4 text-amber-600 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

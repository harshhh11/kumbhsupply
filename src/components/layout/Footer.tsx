import React from 'react';
import { useKumbhData } from '../../context/KumbhDataContext';
import { Sparkles, Shield, Compass, BookOpen, GitBranch, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useKumbhData();

  return (
    <footer className="relative z-10 bg-white border-t border-slate-200 pt-16 pb-12 px-4 sm:px-8 text-slate-600 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex items-center justify-center">
                <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
                  <path d="M18 3L28 29H8L18 3Z" fill="#d97706" />
                  <path d="M18 10L24 28H12L18 10Z" fill="#0f172a" />
                  <circle cx="18" cy="22" r="3" fill="#0284c7" />
                  <path d="M4 33H32" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                KumbhSupply<span className="text-amber-600 font-light">-AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
              AI-Powered Essential Supply Intelligence for Kumbh & Mass Gatherings. Predicting multi-commodity demand,
              monitoring warehouse stock, detecting shortages, and orchestrating crowd-aware logistics
              across large-scale temporary event sectors.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-amber-700 font-semibold">
              <span>RIGHT RESOURCE</span>
              <span>•</span>
              <span>RIGHT PLACE</span>
              <span>•</span>
              <span>RIGHT TIME</span>
            </div>
            <div className="text-xs text-slate-500 pt-2 font-mono">
              Decision Support Platform • Event Logistics Intelligence • Simulated Demo Operations
            </div>
          </div>

          {/* Col 2: Operations & Decision Support */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Operational Modules
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('command')} className="hover:text-slate-900 transition-colors">
                  3D Operations / Command Center
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('zones')} className="hover:text-slate-900 transition-colors">
                  Zone Intelligence (A–E)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('demand')} className="hover:text-slate-900 transition-colors">
                  ML Demand Forecasting
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('inventory')} className="hover:text-slate-900 transition-colors">
                  Master Depot & Staging Hubs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('redistribution')} className="hover:text-slate-900 transition-colors">
                  Smart Redistribution Engine
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('routes')} className="hover:text-slate-900 transition-colors">
                  Route Optimization & GPS
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Literature */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Science & Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('platform')} className="hover:text-slate-900 transition-colors">
                  How It Works (8-Stage Flow)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('research')} className="hover:text-slate-900 transition-colors">
                  Research Literature & Gap
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('architecture')} className="hover:text-slate-900 transition-colors">
                  System Architecture
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('analytics')} className="hover:text-slate-900 transition-colors">
                  Model Metrics (MAE / RMSE)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-slate-900 transition-colors">
                  About Platform & Ethics
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-devanagari text-lg text-amber-700 font-semibold tracking-wide">
              हर हर महादेव
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 tracking-wider uppercase text-[11px]">
              Safe, Scalable & Intelligent Event Logistics
            </span>
          </div>

          <div className="text-slate-500 text-[11px] text-center sm:text-right">
            KumbhSupply-AI &copy; Intelligent Decision-Support System. Built for Seva, Suraksha & Public Health.
          </div>
        </div>
      </div>
    </footer>
  );
};

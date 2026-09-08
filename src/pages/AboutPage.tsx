import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Info,
  Shield,
  Heart,
  Sparkles,
  Trash2,
  Recycle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useKumbhData();
  const [isWasteModuleOpen, setIsWasteModuleOpen] = useState<boolean>(true);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800 mb-2">
            <Info className="w-3.5 h-3.5 text-amber-700" />
            <span>Academic Research Project &bull; Event Supply Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About KumbhSupply-AI
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            An academic research prototype investigating how artificial intelligence, predictive forecasting, and humanitarian logistics decision support can coordinate essential supplies across large-scale temporary mass gathering events.
          </p>
        </div>

        {/* ETHICAL DISCLOSURE BANNER */}
        <div className="p-6 bg-white border border-amber-200/90 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 uppercase">
            <Shield className="w-4 h-4 text-amber-700" />
            <span>Official Prototype & Ethical Transparency Disclaimer</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Academic Research Prototype &bull; Not an Official Government Deployment
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            KumbhSupply-AI is designed exclusively for research, simulation, and humanitarian logistics modeling. All figures displayed in this demonstration represent simulated prototype data. This platform does NOT claim access to live CCTV surveillance, private government inventory repositories, or individual pilgrim location tracking. All crowd estimations use coarse, privacy-preserving aggregate densities.
          </p>
        </div>

        {/* CORE PURPOSE & SEVA PHILOSOPHY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md transition-shadow space-y-2">
            <div className="text-amber-700 font-bold text-sm uppercase tracking-wider font-mono">
              SEVA (SERVICE)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated to the welfare of millions of pilgrims, ensuring dignity, hydration, nutrition, and immediate emergency medical care during holy snan rituals.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md transition-shadow space-y-2">
            <div className="text-sky-700 font-bold text-sm uppercase tracking-wider font-mono">
              SURAKSHA (SAFETY)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminating crowd surges caused by localized resource depletion by detecting shortages 3+ hours in advance and coordinating crowd-aware delivery routes.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md transition-shadow space-y-2">
            <div className="text-emerald-700 font-bold text-sm uppercase tracking-wider font-mono">
              SUSTAINABLE TOMORROW
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optimizing reverse logistics to safeguard the sacred river corridor through circular waste collection, biodegradable plates recycling, and zero ghat pollution.
            </p>
          </div>
        </div>

        {/* EXPANDABLE MODULE: REVERSE LOGISTICS & WASTE MANAGEMENT */}
        <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-xs">
          <div
            onClick={() => setIsWasteModuleOpen(!isWasteModuleOpen)}
            className="p-6 bg-emerald-50/50 flex items-center justify-between cursor-pointer border-b border-emerald-100 transition-colors hover:bg-emerald-50/80"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold tracking-wider">
                  Expandable Research Module &bull; Circular Economy
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Waste & Reverse Logistics Intelligence
                </h3>
              </div>
            </div>
            <button className="text-slate-500 hover:text-slate-900">
              {isWasteModuleOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {isWasteModuleOpen && (
            <div className="p-6 sm:p-8 bg-white space-y-6">
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Mass gatherings generate significant solid and organic waste requiring inverse supply chain management. KumbhSupply-AI tracks pickup urgency, compactor capacity, and sacred river bank cleansing cycles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-emerald-700 font-bold font-mono">Main Ghat Skimming</div>
                  <div className="text-slate-600 leading-relaxed">
                    4 floating containment booms deployed. 12.4 MT floral and biodegradable offerings collected per 6-hour cycle.
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 block">Status: NOMINAL CLEAN</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-amber-700 font-bold font-mono">Community Camp Langar Waste</div>
                  <div className="text-slate-600 leading-relaxed">
                    18.2 MT leaf plates (pattals) diverted to biomass composting plants in regional processing sector.
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-amber-700 block">Status: PICKUP ROUTED</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-sky-700 font-bold font-mono">Sanitary Disinfection</div>
                  <div className="text-slate-600 leading-relaxed">
                    Automated lime powder and eco-enzyme replenishment along 14 km of pedestrian barricade corridors.
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-sky-700 block">Status: 94% COMPLIANT</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FINAL CLOSING CTA BANNER */}
        <div className="p-8 sm:p-12 text-center bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-4">
          <div className="font-devanagari text-2xl text-amber-700 font-semibold tracking-wide">
            हर हर महादेव
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Managing the Movement of a Greater Kumbh
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            One Platform. Multiple Essential Supplies. Smarter Decisions. Greater Impact.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('command')}
              className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs border border-slate-200 transition-all"
            >
              Return to 3D Digital Twin
            </button>
          </div>

          <div className="pt-6 text-xs text-slate-400 font-mono tracking-widest uppercase">
            RIGHT RESOURCE &bull; RIGHT PLACE &bull; RIGHT TIME
          </div>
        </div>
      </div>
    </div>
  );
};

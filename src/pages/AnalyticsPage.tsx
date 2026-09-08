import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Activity,
  Zap,
  TrendingUp,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Layers,
  Database
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const {
    allScenarios,
    activeScenarioId,
    activeSimulation,
    runScenarioSimulation,
    resetScenarioSimulation,
    exportData,
    addToast
  } = useKumbhData();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    activeScenarioId || allScenarios[0].id
  );

  const activeScenarioObj = allScenarios.find(s => s.id === selectedScenarioId) || allScenarios[0];

  const handleRunTest = (id: string) => {
    setSelectedScenarioId(id);
    runScenarioSimulation(id);
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-800 mb-2">
              <Activity className="w-3.5 h-3.5 text-indigo-700" />
              <span>Operational Simulation & Impact Analysis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Operational Reports & Simulations
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Compare standard manual response times vs automated proactive supply dispatch across 10 real-world incident scenarios.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeScenarioId && (
              <button
                onClick={resetScenarioSimulation}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            )}
            <button
              onClick={() => exportData('json', 'Operational_Reports_Dossier')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* 10 Scenarios Selector Carousel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>10 Real-World Incident Scenarios</span>
            </h2>
            <span className="text-xs text-slate-500">
              Select any scenario to test system response
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {allScenarios.map((sc) => {
              const isActive = activeScenarioId === sc.id;
              const isSelected = selectedScenarioId === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                      : isSelected
                      ? 'bg-slate-100 border-slate-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase">
                        {sc.category}
                      </span>
                      <span className="text-emerald-700 font-bold">-{sc.reductionPct}% Shortage</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2">
                      {sc.name}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunTest(sc.id);
                    }}
                    className={`mt-3 w-full py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isActive ? 'Simulating' : 'Simulate'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Scenario Detailed Deep Dive */}
        <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-700 mb-1">
                <span>SCENARIO: {activeScenarioObj.id.toUpperCase()}</span>
                <span>&bull;</span>
                <span className="uppercase font-bold">{activeScenarioObj.category}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {activeScenarioObj.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                {activeScenarioObj.description}
              </p>
            </div>

            <button
              onClick={() => handleRunTest(activeScenarioObj.id)}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start md:self-auto cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Incident</span>
            </button>
          </div>

          {/* Side-by-Side Standard vs Proactive System Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Standard Manual Response Column */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Standard Manual Response
                </span>
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Higher Shortage Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Shortage Duration</span>
                  <span className="text-2xl font-extrabold text-red-600 font-mono">
                    {activeScenarioObj.baselineShortageHours} hrs
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Response Time</span>
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">
                    {Math.round(activeScenarioObj.baselineShortageHours * 0.75 * 10) / 10} hrs
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Pilgrims in Sector</span>
                  <span className="text-xl font-extrabold text-slate-900 font-mono">
                    {Math.round(activeScenarioObj.crowdMultiplier * 450000).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Supply Reliability</span>
                  <span className="text-xl font-extrabold text-amber-600 font-mono">
                    78.2%
                  </span>
                </div>
              </div>
            </div>

            {/* Proactive KumbhSupply-AI System Column */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Proactive KumbhSupply-AI System
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  -{activeScenarioObj.reductionPct}% Shortage Reduction
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Shortage Duration</span>
                  <span className="text-2xl font-extrabold text-emerald-600 font-mono">
                    {activeScenarioObj.aiMitigatedShortageHours} hrs
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Automated Dispatch Time</span>
                  <span className="text-2xl font-extrabold text-emerald-700 font-mono">
                    {Math.round(activeScenarioObj.aiMitigatedShortageHours * 0.65 * 10) / 10} hrs
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Service Level Maintained</span>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">
                    99.4%
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Efficiency Score</span>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">
                    98.2 / 100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  Info,
  CloudRain,
  Route,
  Truck,
  CheckCircle2,
  Trash2,
  ArrowRight
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const {
    alerts,
    dismissAlert,
    acknowledgeAllAlerts,
    simulateWeatherSpike,
    exportData,
    setCurrentPage,
    setSelectedZoneId
  } = useKumbhData();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(
    a => filterType === 'ALL' || a.type === filterType
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL':
        return <AlertOctagon className="w-5 h-5 text-rose-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'ROAD':
        return <Route className="w-5 h-5 text-orange-400" />;
      case 'WEATHER':
        return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'DELIVERY':
        return <Truck className="w-5 h-5 text-purple-400" />;
      default:
        return <Info className="w-5 h-5 text-emerald-400" />;
    }
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-mono text-rose-700 mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Multi-Agency Operational Alert Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Operational Incident Alerts
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Instant alerts synthesized from IoT sensors, meteorological feeds, police traffic advisories, and predictive shortage engines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => simulateWeatherSpike('rain')}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
              title="Simulate sudden rainfall advisory"
            >
              <CloudRain className="w-3.5 h-3.5 text-sky-600" />
              <span>Simulate Rain</span>
            </button>
            <button
              onClick={() => exportData('csv', 'Incident_Alerts_Log')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
              title="Export Incident Log as CSV"
            >
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => acknowledgeAllAlerts()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Acknowledge All</span>
            </button>
          </div>
        </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            {['ALL', 'CRITICAL', 'WARNING', 'ROAD', 'WEATHER', 'DELIVERY', 'OPERATIONAL'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === t
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map(alt => (
            <div
              key={alt.id}
              className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 shadow-sm ${
                alt.type === 'CRITICAL'
                  ? 'bg-rose-50/70 border-rose-200 shadow-rose-100/50'
                  : alt.type === 'WARNING'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex-shrink-0">
                  {getIcon(alt.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono border ${
                      alt.type === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                      alt.type === 'WARNING' ? 'bg-amber-100 text-amber-900 border-amber-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {alt.type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{alt.timeAgo} ({alt.timestamp} IST)</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{alt.title}</h3>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {alt.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {alt.actionRequired && (
                  <button
                    onClick={() => {
                      if (alt.actionTarget === 'redistribution') setCurrentPage('redistribution');
                      if (alt.zoneId) setSelectedZoneId(alt.zoneId);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>{alt.actionLabel || 'Take Action'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={() => dismissAlert(alt.id)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                  title="Acknowledge Alert"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="glass-panel p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl shadow-sm">
              No alerts in "{filterType}" category. All systems operating within nominal buffers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

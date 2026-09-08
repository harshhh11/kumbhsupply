import React from 'react';
import { useKumbhData } from '../../context/KumbhDataContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  AlertTriangle,
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Cross,
  Droplets,
  TrendingUp,
  Boxes,
  Activity
} from 'lucide-react';

export const UspDemoModal: React.FC = () => {
  const {
    isUspDemoOpen,
    closeUspDemoScenario,
    uspDemoStep,
    nextUspDemoStep,
    prevUspDemoStep,
    setUspDemoStep,
    setActiveZoomLevel,
    setFollowedVehicleId,
    setSelectedZoneId,
    approveRecommendation,
    recommendations,
    deliveries
  } = useKumbhData();

  if (!isUspDemoOpen) return null;

  // Handle step-specific 3D camera transitions
  const handleStepTransition = (step: number) => {
    setUspDemoStep(step);
    switch (step) {
      case 1:
        setActiveZoomLevel(1);
        setFollowedVehicleId(null);
        setSelectedZoneId('zone-a');
        break;
      case 2:
        setActiveZoomLevel(2);
        setFollowedVehicleId(null);
        setSelectedZoneId('zone-b');
        break;
      case 3:
        setActiveZoomLevel(3);
        setFollowedVehicleId(null);
        setSelectedZoneId('zone-b');
        break;
      case 4:
        setActiveZoomLevel(4);
        setFollowedVehicleId(null);
        setSelectedZoneId('zone-b');
        break;
      case 5:
        setActiveZoomLevel(3);
        setFollowedVehicleId(null);
        break;
      case 6:
        setActiveZoomLevel(4);
        setFollowedVehicleId(null);
        setSelectedZoneId('warehouse-1');
        break;
      case 7:
        setActiveZoomLevel(5);
        setFollowedVehicleId('veh-1042');
        break;
      case 8:
        setActiveZoomLevel(3);
        setFollowedVehicleId(null);
        setSelectedZoneId('zone-b');
        // Auto-approve the recommendation to drop risk to safe
        if (recommendations[0]) {
          approveRecommendation(recommendations[0].id);
        }
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-[#090d16]/98 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={closeUspDemoScenario}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Step Counter & Brand USP */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KumbhSupply-AI &bull; Guided 3D Digital Twin Operations Demo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            “See the Kumbh. Locate the problem. Move the right supply.”
          </h2>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-mono text-slate-400">Step {uspDemoStep} of 8</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 rounded-full"
                style={{ width: `${(uspDemoStep / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* STEP CONTENT BODY */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 min-h-[220px] flex flex-col justify-between">
          {uspDemoStep === 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-semibold uppercase">
                <Compass className="w-4 h-4" />
                <span>LEVEL 1 &bull; Sky-to-City High-Altitude Perspective</span>
              </div>
              <h3 className="text-lg font-bold text-white">1. Event-Wide Geospatial Overview of Event Environment</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The 3D Digital Twin continuously gathers coarse crowd telemetry, river flow dynamics, and multi-commodity inventory across all operational event zones.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Active Attendees: <strong>4,61,500</strong></span>
                <span className="text-emerald-400">&bull; 100% Verified Geography</span>
              </div>
            </div>
          )}

          {uspDemoStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-semibold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>LEVEL 2 &bull; Shortage Detection & Risk Elevation</span>
              </div>
              <h3 className="text-lg font-bold text-white">2. AI Flags Critical Demand Surge in Zone B (Main Gathering Ghat)</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                As 160,000 pilgrims gather for the ceremonial bath ritual, drinking water consumption velocity escalates. Zone B risk escalates to <strong className="text-rose-400">CRITICAL</strong>.
              </p>
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Zone B Main Ghat: Water deficit projected within 3 hours 12 minutes!</span>
              </div>
            </div>
          )}

          {uspDemoStep === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase">
                <Navigation className="w-4 h-4" />
                <span>LEVEL 3 &bull; Camera Fly-Down into Zone B</span>
              </div>
              <h3 className="text-lg font-bold text-white">3. Smooth 3D Camera Transition into Zone B Riverfront</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The camera smoothly descends through the atmosphere, focusing on Zone B main ghat steps and riverfront contours.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300 flex justify-between">
                <span>Elevation: 560m MSL</span>
                <span className="text-amber-400">Sector Density: High Demand Flow</span>
              </div>
            </div>
          )}

          {uspDemoStep === 4 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-semibold uppercase">
                <Cross className="w-4 h-4" />
                <span>LEVEL 4 &bull; Facility Triage & Inventory Inspection</span>
              </div>
              <h3 className="text-lg font-bold text-white">4. Exact Commodity Deficit Breakdown</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px]">Required</span>
                  <span className="text-white font-bold text-sm">20,000 L</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px]">On-Hand</span>
                  <span className="text-rose-400 font-bold text-sm">24,000 L</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px]">Buffer Risk</span>
                  <span className="text-amber-400 font-bold text-sm">3.2 hrs left</span>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Without rapid replenishment, drinking water kiosks along Zone B will experience total stock-out during evening ceremonies.
              </p>
            </div>
          )}

          {uspDemoStep === 5 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
                <Zap className="w-4 h-4" />
                <span>AI DECISION ENGINE &bull; Multi-Commodity Optimization</span>
              </div>
              <h3 className="text-lg font-bold text-white">5. AI Formulates 20,000 L Rapid Transfer Recommendation</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Evaluating all depot stocks, the engine selects <strong>Central Supply Hub (CW-01)</strong> as the optimal source, preserving 100% safe reserves while covering the entire shortfall.
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                <span>Central Reserve: 185,000 L</span>
                <span className="font-bold">&rarr; Dispatch 20,000 L Potable Water (WT-1042)</span>
              </div>
            </div>
          )}

          {uspDemoStep === 6 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase">
                <Navigation className="w-4 h-4" />
                <span>LEVEL 4 &bull; Route Calculation via River Logistics Corridor</span>
              </div>
              <h3 className="text-lg font-bold text-white">6. Dedicated Logistics Routing over Pontoon Bridge 01</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The camera flies over the route corridor. AI selects the 4.2 km dedicated emergency arterial lane over Pontoon Bridge 01, bypassing pedestrian congestion near the main central bridge.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300 flex justify-between">
                <span>Route Distance: 4.2 km</span>
                <span className="text-sky-400">Estimated Transit: 23 min</span>
              </div>
            </div>
          )}

          {uspDemoStep === 7 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-semibold uppercase">
                <Truck className="w-4 h-4" />
                <span>LEVEL 5 &bull; Close-Up Vehicle Camera Follow Mode</span>
              </div>
              <h3 className="text-lg font-bold text-white">7. Real-Time GPS Tracking of Convoy in Transit</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The 3D camera is now latched to Convoy #1042 / Heavy Tanker WT-1042 as it navigates the primary logistics arterial and pontoon bridge crossing with live GPS telemetry.
              </p>
              <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/30 text-xs text-sky-200 flex items-center justify-between font-mono">
                <span>Vehicle: EV-SUPPLY-1042</span>
                <span>Speed: 36 km/h &bull; ETA 14m</span>
              </div>
            </div>
          )}

          {uspDemoStep === 8 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>MISSION COMPLETE &bull; Risk De-escalated to SAFE</span>
              </div>
              <h3 className="text-lg font-bold text-white">8. Supply Delivered & Readiness Restored to 96%</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                20,000 L Drinking Water safely arrives at Zone B replenishment bays. Zone B risk score drops from 82 (Critical) down to 18 (Safe), fully shielding attendees for the evening ceremonies.
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between font-mono font-bold">
                <span>Zone B Status: SAFE</span>
                <span>Stockout Prevention: 100%</span>
              </div>
            </div>
          )}
        </div>

        {/* MODAL NAVIGATION CONTROLS */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => handleStepTransition(Math.max(1, uspDemoStep - 1))}
            disabled={uspDemoStep === 1}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <button
                key={s}
                onClick={() => handleStepTransition(s)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  uspDemoStep === s
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {uspDemoStep < 8 ? (
            <button
              onClick={() => handleStepTransition(uspDemoStep + 1)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={closeUspDemoScenario}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Finish Demo</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

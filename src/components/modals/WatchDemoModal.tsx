import React, { useState } from 'react';
import { useKumbhData } from '../../context/KumbhDataContext';
import { X, Play, Pause, Volume2, Maximize2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const WatchDemoModal: React.FC = () => {
  const { isDemoVideoOpen, setIsDemoVideoOpen, setCurrentPage } = useKumbhData();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChapter, setActiveChapter] = useState(0);

  if (!isDemoVideoOpen) return null;

  const chapters = [
    {
      title: '01. Mass Gathering Logistics & Demand Forecasting',
      time: '0:00 - 0:45',
      summary: 'Dynamic environment of hundreds of thousands of daily attendees across operational event zones requiring multi-supply coordination.'
    },
    {
      title: '02. 3D Digital Twin & Multi-Supply Ingestion',
      time: '0:45 - 1:30',
      summary: 'Continuous telemetry tracking water, food, medicines, sanitation, fuel, emergency supplies, and infrastructure.'
    },
    {
      title: '03. ML Demand Prediction & Gathering Surges',
      time: '1:30 - 2:15',
      summary: 'Explainable AI forecasting 1h, 3h, 6h, and 24h horizons considering crowd density and ambient weather.'
    },
    {
      title: '04. Smart Redistribution & Human Decision-Support',
      time: '2:15 - 3:00',
      summary: 'Automated transfer suggestions from Central Supply Hub to critical zones with before/after stock impact.'
    },
    {
      title: '05. Crowd-Aware Routing Across River Logistics Corridors',
      time: '3:00 - 3:45',
      summary: 'Dynamic GPS route calculation bypassing congested pedestrian corridors during royal bath days.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center text-xs font-bold font-mono">
              AI
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                KumbhSupply-AI &bull; Executive System Walkthrough
              </h3>
              <p className="text-[11px] text-slate-500">
                Decision Support Prototype Demonstration for Mass Gathering Events
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoVideoOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas / Player Simulation */}
        <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden group">
          <img
            src="/assets/kumbh_cinematic_bg.jpg"
            alt="KumbhSupply-AI Walkthrough"
            className={`w-full h-full object-cover filter transition-all duration-700 ${
              isPlaying ? 'scale-105 brightness-90' : 'scale-100 brightness-75'
            }`}
          />

          {/* Animated HUD overlays simulating real-time AI telemetry */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-[11px] text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SIMULATION FEED • EVENT SECTORS</span>
              </div>
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-[11px] text-amber-300 font-mono">
                {chapters[activeChapter].time}
              </div>
            </div>

            <div className="max-w-lg">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                Active Chapter:
              </span>
              <h4 className="text-lg font-bold text-white drop-shadow-md">
                {chapters[activeChapter].title}
              </h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed drop-shadow">
                {chapters[activeChapter].summary}
              </p>
            </div>
          </div>

          {/* Interactive Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-10 hover:bg-amber-400"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-1" />}
          </button>
        </div>

        {/* Chapters selection */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 overflow-y-auto">
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block mb-3">
            Walkthrough Chapters
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChapter(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeChapter === idx
                    ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500'
                    : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className={activeChapter === idx ? 'text-amber-700 font-bold' : 'text-slate-500'}>
                    Part {idx + 1}
                  </span>
                  <span className="text-slate-500">{ch.time}</span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{ch.title}</h5>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Interactive Prototype Experience &bull; Event-Agnostic Decision Support
            </span>
            <button
              onClick={() => {
                setIsDemoVideoOpen(false);
                setCurrentPage('command');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <span>Launch 3D Operations Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

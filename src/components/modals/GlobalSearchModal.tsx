import React, { useState, useEffect } from 'react';
import { useKumbhData } from '../../context/KumbhDataContext';
import { Search, X, MapPin, Boxes, Warehouse, Truck, AlertCircle, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    zones,
    commodities,
    warehouses,
    deliveries,
    currentPage,
    setCurrentPage,
    setSelectedZoneId,
    setSelectedCommodityId,
    flyToLocation
  } = useKumbhData();

  const [query, setQuery] = useState('');
  const [isFlying, setIsFlying] = useState(false);
  const [flyingTargetName, setFlyingTargetName] = useState('');

  const handleSelectLandmark = (name: string, lat: number, lng: number, zoneId: string) => {
    setFlyingTargetName(name);
    setIsFlying(true);
    flyToLocation({ lat, lng, zoom: 4, label: name, landmarkId: zoneId });
    setTimeout(() => {
      setIsFlying(false);
      setIsSearchOpen(false);
      if (currentPage !== 'home' && currentPage !== 'command') {
        setCurrentPage('command');
      }
    }, 1200);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredZones = zones.filter(
    z => z.name.toLowerCase().includes(trimmed) || z.code.toLowerCase().includes(trimmed) || z.description.toLowerCase().includes(trimmed)
  );

  const filteredCommodities = commodities.filter(
    c => c.name.toLowerCase().includes(trimmed) || c.category.toLowerCase().includes(trimmed)
  );

  const filteredWarehouses = warehouses.filter(
    w => w.name.toLowerCase().includes(trimmed) || w.code.toLowerCase().includes(trimmed) || w.location.toLowerCase().includes(trimmed)
  );

  const filteredDeliveries = deliveries.filter(
    d => d.code.toLowerCase().includes(trimmed) || d.commodityName.toLowerCase().includes(trimmed) || d.destinationName.toLowerCase().includes(trimmed)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-amber-600" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search zones, supplies, warehouses, deliveries, routes..."
            className="flex-1 bg-transparent border-none text-slate-900 text-sm outline-none placeholder-slate-400 font-sans"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Flying Camera HUD Indicator */}
        {isFlying && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-mono font-bold flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
              <span>Flying 3D Camera to {flyingTargetName}...</span>
            </span>
            <span>Target Coordinates Synced</span>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Zones */}
          {filteredZones.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> Operational Zones
              </div>
              <div className="space-y-1">
                {filteredZones.map(z => (
                  <div
                    key={z.id}
                    onClick={() => handleSelectLandmark(z.name, z.coordinates.lat, z.coordinates.lng, z.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 mr-2">{z.name}</span>
                      <span className="text-slate-500">{z.description}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                      {z.coordinates.lat.toFixed(4)}° N, {z.coordinates.lng.toFixed(4)}° E
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commodities */}
          {filteredCommodities.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Boxes className="w-3 h-3 text-sky-600" /> Essential Supplies
              </div>
              <div className="space-y-1">
                {filteredCommodities.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCommodityId(c.id);
                      setCurrentPage('command');
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 mr-2">{c.name}</span>
                      <span className="text-slate-500">{c.description}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono">
                      {c.totalAvailable.toLocaleString()} {c.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warehouses */}
          {filteredWarehouses.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Warehouse className="w-3 h-3 text-amber-600" /> Storage Depots & Hubs
              </div>
              <div className="space-y-1">
                {filteredWarehouses.map(w => (
                  <div
                    key={w.id}
                    onClick={() => handleSelectLandmark(w.name, 19.9820, 73.7650, w.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 mr-2">{w.name}</span>
                      <span className="text-slate-500">{w.location}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                      {w.capacitySqFt.toLocaleString()} sq ft
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliveries */}
          {filteredDeliveries.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-purple-600" /> Active Dispatches
              </div>
              <div className="space-y-1">
                {filteredDeliveries.map(d => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectLandmark(`${d.code} (${d.commodityName})`, 20.0040, 73.8010, 'zone-b')}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 mr-2">{d.code}</span>
                      <span className="text-slate-600">
                        {d.quantity.toLocaleString()} {d.unit} {d.commodityName} &bull; {d.sourceName} &rarr; {d.destinationName}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-mono">
                      ETA {d.etaMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredZones.length === 0 &&
            filteredCommodities.length === 0 &&
            filteredWarehouses.length === 0 &&
            filteredDeliveries.length === 0 && (
              <div className="py-8 text-center text-slate-500">
                No matching telemetry found for "{query}".
              </div>
            )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <span>Navigate with click &bull; Press ESC to exit</span>
          <span className="text-amber-700 font-medium">Event Operations Live Telemetry</span>
        </div>
      </div>
    </div>
  );
};

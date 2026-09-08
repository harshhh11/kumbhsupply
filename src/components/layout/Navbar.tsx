import React from 'react';
import { useKumbhData } from '../../context/KumbhDataContext';
import { Search, ChevronRight, Compass, ShieldAlert, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, setIsSearchOpen, alerts } = useKumbhData();
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'command', label: 'Dashboard' },
    { id: 'inventory', label: 'Supply' },
    { id: 'demand', label: 'Expected Need' },
    { id: 'deliveries', label: 'Deliveries' },
    { id: 'twin', label: 'Map' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'analytics', label: 'Reports' },
    { id: 'admin', label: 'Admin' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-3 pb-2 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Stylized Kumbh Temple Spire Logo */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8 transition-transform group-hover:scale-105">
              <path d="M18 3L28 29H8L18 3Z" fill="#d97706" />
              <path d="M18 10L24 28H12L18 10Z" fill="#0f172a" />
              <circle cx="18" cy="22" r="3" fill="#0284c7" />
              <path d="M4 33H32" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center">
            KumbhSupply<span className="text-amber-600 font-light">-AI</span>
          </span>
        </div>

        {/* Center Floating Pill Menu - Clean Whitish Light */}
        <nav className="hidden md:flex items-center px-1.5 py-1 bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-md rounded-full overflow-x-auto no-scrollbar">
          {navItems.map(item => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'command' && ['zones', 'zone-detail', 'shortage', 'redistribution', 'routes', 'categories'].includes(currentPage)) ||
              (item.id === 'admin' && ['admin', 'research', 'architecture', 'platform', 'about'].includes(currentPage));
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Search + Alerts + CTA button */}
        <div className="flex items-center gap-3">
          {/* Alerts quick badge */}
          <button
            onClick={() => setCurrentPage('alerts')}
            className="relative p-2 rounded-full bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
            title="Operational Alerts"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Quick Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-slate-500 hover:text-slate-900 text-xs border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-normal">Search</span>
            <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">⌘K</kbd>
          </button>

          {/* Primary CTA Button: "Get started →" (shown only on landing page) */}
          {currentPage === 'home' && (
            <button
              onClick={() => setCurrentPage('command')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs hover:shadow transition-all group"
            >
              <span>Get started</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

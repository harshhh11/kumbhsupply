import React from 'react';
import { useKumbhData } from '../../context/KumbhDataContext';
import {
  LayoutDashboard,
  MapPin,
  TrendingUp,
  Boxes,
  AlertOctagon,
  ArrowLeftRight,
  Route,
  Truck,
  Layers,
  Bell,
  BarChart3
} from 'lucide-react';

export const SecondaryNav: React.FC = () => {
  const { currentPage, setCurrentPage, alerts } = useKumbhData();
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const items = [
    { id: 'command', label: 'Overview', icon: LayoutDashboard },
    { id: 'zones', label: 'Zones', icon: MapPin },
    { id: 'inventory', label: 'Supply', icon: Boxes },
    { id: 'demand', label: 'Expected Need', icon: TrendingUp },
    { id: 'shortage', label: 'Shortage Risks', icon: AlertOctagon },
    { id: 'redistribution', label: 'Supply Plan', icon: ArrowLeftRight },
    { id: 'routes', label: 'Best Routes', icon: Route },
    { id: 'deliveries', label: 'Deliveries', icon: Truck },
    { id: 'categories', label: 'Supply Items', icon: Layers },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { id: 'analytics', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-2 sticky top-14 z-40 overflow-x-auto no-scrollbar shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'zones' && currentPage === 'zone-detail');
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

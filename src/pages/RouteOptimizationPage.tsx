import React from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { GoogleMapsDirectionsView } from '../components/routing/GoogleMapsDirectionsView';

export const RouteOptimizationPage: React.FC = () => {
  const { setCurrentPage } = useKumbhData();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* REAL GOOGLE MAPS PLATFORM FULL-SCREEN DIRECTIONS INTERFACE */}
      <GoogleMapsDirectionsView
        initialOriginId="wh-central"
        initialDestId="zone-b"
        onBack={() => setCurrentPage('command')}
      />
    </div>
  );
};

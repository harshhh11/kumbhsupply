import React from 'react';
import { RealGeospatialTwin } from '../components/visual/RealGeospatialTwin';

export const DigitalTwinPage: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#070b12] text-slate-100 select-none">
      {/* FULL-SCREEN 3D GEOSPATIAL OPERATIONAL TWIN CANVAS */}
      <RealGeospatialTwin interactive={true} pageMode="operations" />
    </div>
  );
};


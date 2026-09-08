import React, { useEffect } from 'react';
import { KumbhDataProvider, useKumbhData } from './context/KumbhDataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { WatchDemoModal } from './components/modals/WatchDemoModal';
import { UspDemoModal } from './components/modals/UspDemoModal';
import { ToastContainer } from './components/layout/ToastContainer';

// 17 Complete Pages / Views
import { HomePage } from './pages/HomePage';
import { PlatformPage } from './pages/PlatformPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { ZonesPage } from './pages/ZonesPage';
import { ZoneDetailPage } from './pages/ZoneDetailPage';
import { DemandPage } from './pages/DemandPage';
import { InventoryPage } from './pages/InventoryPage';
import { ShortageRiskPage } from './pages/ShortageRiskPage';
import { RedistributionPage } from './pages/RedistributionPage';
import { RouteOptimizationPage } from './pages/RouteOptimizationPage';
import { DeliveriesPage } from './pages/DeliveriesPage';
import { SupplyCategoriesPage } from './pages/SupplyCategoriesPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ResearchPage } from './pages/ResearchPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AboutPage } from './pages/AboutPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { currentPage } = useKumbhData();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'platform':
        return <PlatformPage />;
      case 'twin':
      case 'map':
      case '3d-operations':
      case 'digital-twin':
        return <DigitalTwinPage />;
      case 'command':
      case 'dashboard':
        return <CommandCenterPage />;
      case 'zones':
        return <ZonesPage />;
      case 'zone-detail':
        return <ZoneDetailPage />;
      case 'demand':
      case 'expected-need':
        return <DemandPage />;
      case 'inventory':
      case 'supply':
        return <InventoryPage />;
      case 'shortage':
      case 'shortages':
        return <ShortageRiskPage />;
      case 'redistribution':
      case 'plan':
      case 'supply-plan':
        return <RedistributionPage />;
      case 'routes':
      case 'best-routes':
        return <RouteOptimizationPage />;
      case 'deliveries':
        return <DeliveriesPage />;
      case 'categories':
      case 'items':
        return <SupplyCategoriesPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'analytics':
      case 'reports':
        return <AnalyticsPage />;
      case 'admin':
      case 'settings':
        return <AdminPage />;
      case 'research':
        return <ResearchPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  };

  const isFullScreenTwin = ['twin', '3d-operations', 'digital-twin'].includes(currentPage);

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-900 ${
      isFullScreenTwin ? 'h-screen overflow-hidden bg-[#070b12]' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Fixed Single Global Navbar */}
      <Navbar />

      {/* Main Page View with smooth transition */}
      <main className={`flex-1 transition-opacity duration-300 ${isFullScreenTwin ? 'h-full w-full overflow-hidden' : ''}`}>
        {renderActivePage()}
      </main>

      {/* Footer (hidden on full-screen 3D operations twin) */}
      {!isFullScreenTwin && <Footer />}

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <GlobalSearchModal />
      <WatchDemoModal />
      <UspDemoModal />
    </div>
  );
};

export function App() {
  return (
    <KumbhDataProvider>
      <AppContent />
    </KumbhDataProvider>
  );
}

export default App;

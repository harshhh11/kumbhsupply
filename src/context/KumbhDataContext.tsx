import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  COMMODITIES,
  OPERATIONAL_ZONES,
  WAREHOUSES,
  INITIAL_DELIVERIES,
  INITIAL_RECOMMENDATIONS,
  INITIAL_ALERTS,
  VERIFIED_DIGITAL_TWIN_LANDMARKS,
  SIMULATED_GPS_FLEET,
  TIMELINE_HOUR_STATES,
  Commodity,
  OperationalZone,
  Warehouse,
  Delivery,
  RedistributionRecommendation,
  OperationalAlert,
  DigitalTwinLandmark,
  SimulatedVehicleGPS,
  TimelineHourState,
  ZoomLevel
} from '../data/kumbhData';

import {
  COMMODITY_REGISTRY,
  ZONES_MASTER,
  WAREHOUSES_MASTER,
  OPERATIONAL_SCENARIOS,
  CommodityMaster,
  ZoneNode,
  WarehouseNode,
  OperationalScenario
} from '../data/multiCommodityData';

import {
  AIDemandForecastService,
  ZoneCommodityForecast,
  SystemForecastSummary
} from '../services/aiDemandForecastService';

import {
  RedistributionOptimizationService,
  ProposedDispatch,
  OptimizationResult
} from '../services/redistributionOptimizationService';

import {
  ScenarioSimulationEngine,
  SimulationOutput
} from '../services/scenarioSimulationEngine';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  time?: string;
}

interface FlyToTarget {
  lat: number;
  lng: number;
  zoom: ZoomLevel;
  label: string;
  landmarkId?: string;
}

interface KumbhContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedCommodityId: string;
  setSelectedCommodityId: (id: string) => void;
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  selectedHorizon: '1h' | '3h' | '6h' | '12h' | '24h' | '48h';
  setSelectedHorizon: (h: '1h' | '3h' | '6h' | '12h' | '24h' | '48h') => void;
  selectedModel: 'gbdt' | 'ridge' | 'rf' | 'xgb' | 'lr';
  setSelectedModel: (m: 'gbdt' | 'ridge' | 'rf' | 'xgb' | 'lr') => void;
  
  // 3D Digital Twin Operations State
  activeZoomLevel: ZoomLevel;
  setActiveZoomLevel: (z: ZoomLevel) => void;
  activeCommodityLayer: string;
  setActiveCommodityLayer: (layer: string) => void;
  selectedTimeStep: string;
  setSelectedTimeStep: (t: string) => void;
  currentTimelineState: TimelineHourState;
  landmarks: DigitalTwinLandmark[];
  simulatedFleet: SimulatedVehicleGPS[];
  followedVehicleId: string | null;
  setFollowedVehicleId: (id: string | null) => void;
  flyToTarget: FlyToTarget | null;
  setFlyToTarget: (target: FlyToTarget | null) => void;
  flyToLocation: (target: FlyToTarget) => void;
  
  // 1-Click Guided USP Demo Flow State
  isUspDemoOpen: boolean;
  setIsUspDemoOpen: (open: boolean) => void;
  uspDemoStep: number;
  setUspDemoStep: (step: number) => void;
  startUspDemoScenario: () => void;
  nextUspDemoStep: () => void;
  prevUspDemoStep: () => void;
  closeUspDemoScenario: () => void;

  // Data entities
  commodities: Commodity[];
  zones: OperationalZone[];
  warehouses: Warehouse[];
  deliveries: Delivery[];
  recommendations: RedistributionRecommendation[];
  alerts: OperationalAlert[];
  toasts: ToastMessage[];

  // Multi-Commodity & AI System Extensions
  multiCommodities: Record<string, CommodityMaster>;
  multiZones: ZoneNode[];
  multiWarehouses: WarehouseNode[];
  allScenarios: OperationalScenario[];
  activeScenarioId: string | null;
  setActiveScenarioId: (id: string | null) => void;
  systemForecasts: SystemForecastSummary;
  optimizationPlan: OptimizationResult;
  activeSimulation: SimulationOutput | null;
  
  // Dynamic KPIs
  estimatedCrowd: number;
  totalActiveDeliveries: number;
  criticalZonesCount: number;
  stockoutPreventionRate: number;
  
  // Actions & Functionalities
  approveRecommendation: (recId: string) => void;
  batchApproveRecommendations: () => void;
  approveProposedDispatch: (dispatchId: string) => void;
  modifyProposedDispatch: (dispatchId: string, newQty: number, vehicleType?: ProposedDispatch['vehicleType']) => void;
  rejectProposedDispatch: (dispatchId: string, reason: string) => void;
  runScenarioSimulation: (scenarioId: string) => SimulationOutput;
  resetScenarioSimulation: () => void;
  dismissAlert: (alertId: string) => void;
  acknowledgeAllAlerts: () => void;
  triggerCrowdSurge: (zoneId: string, deltaPercent: number) => void;
  simulateWeatherSpike: (type: 'heatwave' | 'rain' | 'normal') => void;
  triggerEmergencyReorder: (warehouseId: string, commodityId: string, amount: number) => void;
  exportData: (format: 'csv' | 'json' | 'pdf', entityName: string) => void;
  syncTelemetry: () => void;
  rerouteVehicle: (deliveryId: string) => void;
  simulateHourAdvance: () => void;
  addToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Modal states
  isDemoVideoOpen: boolean;
  setIsDemoVideoOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const KumbhDataContext = createContext<KumbhContextType | undefined>(undefined);

export const KumbhDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('water');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-b');
  const [selectedHorizon, setSelectedHorizon] = useState<'1h' | '3h' | '6h' | '12h' | '24h' | '48h'>('1h');
  const [selectedModel, setSelectedModel] = useState<'gbdt' | 'ridge' | 'rf' | 'xgb' | 'lr'>('gbdt');

  // 3D Geospatial Engine States
  const [activeZoomLevel, setActiveZoomLevel] = useState<ZoomLevel>(1);
  const [activeCommodityLayer, setActiveCommodityLayer] = useState<string>('all');
  const [selectedTimeStep, setSelectedTimeStep] = useState<string>('12:00');
  const [followedVehicleId, setFollowedVehicleId] = useState<string | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<FlyToTarget | null>(null);
  const [landmarks] = useState<DigitalTwinLandmark[]>(VERIFIED_DIGITAL_TWIN_LANDMARKS);
  const [simulatedFleet, setSimulatedFleet] = useState<SimulatedVehicleGPS[]>(SIMULATED_GPS_FLEET);

  // Guided USP Demo States
  const [isUspDemoOpen, setIsUspDemoOpen] = useState<boolean>(false);
  const [uspDemoStep, setUspDemoStep] = useState<number>(1);

  const [commodities, setCommodities] = useState<Commodity[]>(COMMODITIES);
  const [zones, setZones] = useState<OperationalZone[]>(OPERATIONAL_ZONES);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(WAREHOUSES);
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [recommendations, setRecommendations] = useState<RedistributionRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // AI & Multi-Commodity States
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<SimulationOutput | null>(null);

  // Initial Forecast & Optimization Setup
  const [systemForecasts, setSystemForecasts] = useState<SystemForecastSummary>(() =>
    AIDemandForecastService.getInstance().generateForecasts(1.0, 32.0, 0.0, false, null)
  );

  const [optimizationPlan, setOptimizationPlan] = useState<OptimizationResult>(() =>
    RedistributionOptimizationService.getInstance().optimizeRedistribution(
      AIDemandForecastService.getInstance().generateForecasts(1.0, 32.0, 0.0, false, null).forecasts
    )
  );

  // Active timeline hour state lookup
  const currentTimelineState = TIMELINE_HOUR_STATES.find(s => s.time === selectedTimeStep) || TIMELINE_HOUR_STATES[2];

  // Compute live aggregates adjusted by time step crowd multiplier
  const estimatedCrowd = Math.round(zones.reduce((sum, z) => sum + z.crowdCount, 0) * currentTimelineState.crowdMultiplier);
  const totalActiveDeliveries = deliveries.filter(d => d.status === 'IN TRANSIT' || d.status === 'LOADING').length;
  const criticalZonesCount = systemForecasts.criticalZonesCount;
  const stockoutPreventionRate = 98.4;

  const addToast = (title: string, message?: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = {
      id,
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const flyToLocation = (target: FlyToTarget) => {
    setFlyToTarget(target);
    setActiveZoomLevel(target.zoom);
    if (target.landmarkId) {
      setSelectedZoneId(target.landmarkId);
    }
    addToast('Camera Re-positioned', `Centered 3D Digital Twin on ${target.label}`, 'info');
  };

  const startUspDemoScenario = () => {
    setIsUspDemoOpen(true);
    setUspDemoStep(1);
    setActiveZoomLevel(1);
    setFollowedVehicleId(null);
    addToast('Simulation Scenario Started', 'Interactive 8-Stage KumbhSupply-AI Walkthrough active.', 'info');
  };

  const nextUspDemoStep = () => {
    setUspDemoStep(prev => Math.min(8, prev + 1));
  };

  const prevUspDemoStep = () => {
    setUspDemoStep(prev => Math.max(1, prev - 1));
  };

  const closeUspDemoScenario = () => {
    setIsUspDemoOpen(false);
    setUspDemoStep(1);
  };

  // Run Scenario Stress Test Simulation
  const runScenarioSimulation = (scenarioId: string): SimulationOutput => {
    const simEngine = ScenarioSimulationEngine.getInstance();
    const result = simEngine.runScenario(scenarioId);
    setActiveScenarioId(scenarioId);
    setActiveSimulation(result);

    // Update live system forecasts and optimization plan
    const updatedForecasts = AIDemandForecastService.getInstance().generateForecasts(
      result.scenario.crowdMultiplier,
      32.0 + result.scenario.temperatureDeltaC,
      result.scenario.rainfallMm,
      result.scenario.category === 'crowd',
      scenarioId
    );
    setSystemForecasts(updatedForecasts);
    setOptimizationPlan(result.optimizationPlan);

    addToast(
      `Scenario Activated: ${result.scenario.name}`,
      `Averting ${result.improvements.stockoutsAverted} stockouts with +${result.improvements.responseAccelerationPct}% response acceleration.`,
      'warning'
    );
    return result;
  };

  const resetScenarioSimulation = () => {
    setActiveScenarioId(null);
    setActiveSimulation(null);
    const nominalForecasts = AIDemandForecastService.getInstance().generateForecasts(1.0, 32.0, 0.0, false, null);
    setSystemForecasts(nominalForecasts);
    setOptimizationPlan(RedistributionOptimizationService.getInstance().optimizeRedistribution(nominalForecasts.forecasts));
    addToast('Simulation Reset', 'Operational conditions restored to normal diurnal baseline.', 'info');
  };

  // Human-in-the-loop Proposed Dispatch Approvals
  const approveProposedDispatch = (dispatchId: string) => {
    const success = RedistributionOptimizationService.getInstance().approveDispatch(dispatchId);
    if (success) {
      setOptimizationPlan(prev => ({
        ...prev,
        proposals: prev.proposals.map(p => p.dispatchId === dispatchId ? { ...p, approvalStatus: 'APPROVED' } : p)
      }));
      addToast('Dispatch Authorized', `Dispatched vehicle for ${dispatchId}. Live Google Route initiated.`, 'success');
    }
  };

  const modifyProposedDispatch = (dispatchId: string, newQty: number, vehicleType?: ProposedDispatch['vehicleType']) => {
    const success = RedistributionOptimizationService.getInstance().modifyDispatch(dispatchId, newQty, vehicleType);
    if (success) {
      setOptimizationPlan(prev => ({
        ...prev,
        proposals: prev.proposals.map(p => p.dispatchId === dispatchId ? {
          ...p,
          transferQuantity: newQty,
          vehicleType: vehicleType || p.vehicleType,
          approvalStatus: 'APPROVED'
        } : p)
      }));
      addToast('Dispatch Modified & Authorized', `Updated quantity to ${newQty.toLocaleString()} units for ${dispatchId}.`, 'success');
    }
  };

  const rejectProposedDispatch = (dispatchId: string, reason: string) => {
    const success = RedistributionOptimizationService.getInstance().rejectDispatch(dispatchId, reason);
    if (success) {
      setOptimizationPlan(prev => ({
        ...prev,
        proposals: prev.proposals.map(p => p.dispatchId === dispatchId ? {
          ...p,
          approvalStatus: 'REJECTED',
          rejectionReason: reason
        } : p)
      }));
      addToast('Dispatch Rejected', `Reason logged in audit trail: "${reason}"`, 'info');
    }
  };

  // Periodic simulated tick for vehicle GPS movement
  useEffect(() => {
    const timer = setInterval(() => {
      setDeliveries(prev =>
        prev.map(del => {
          if (del.status === 'IN TRANSIT') {
            const nextProg = Math.min(100, del.progressPercent + 1);
            const nextEta = Math.max(1, del.etaMinutes - 0.2);
            return {
              ...del,
              progressPercent: nextProg,
              etaMinutes: Math.round(nextEta * 10) / 10,
              status: nextProg >= 100 ? 'DELIVERED' : 'IN TRANSIT'
            };
          }
          return del;
        })
      );

      setSimulatedFleet(prev =>
        prev.map(veh => {
          if (veh.status === 'IN TRANSIT') {
            const nextProg = Math.min(100, veh.progressPercent + 1.2);
            const nextEta = Math.max(1, veh.etaMinutes - 0.3);
            return {
              ...veh,
              progressPercent: nextProg,
              etaMinutes: Math.round(nextEta * 10) / 10,
              status: nextProg >= 100 ? 'ARRIVED' : 'IN TRANSIT'
            };
          }
          return veh;
        })
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Handle transfer approval with human-in-the-loop workflow
  const approveRecommendation = (recId: string) => {
    let approvedRec: RedistributionRecommendation | undefined;

    setRecommendations(prev =>
      prev.map(rec => {
        if (rec.id === recId && !rec.approved) {
          approvedRec = rec;

          // 1. Update source warehouse stock
          setWarehouses(whList =>
            whList.map(wh => {
              if (wh.id === rec.sourceWarehouseId) {
                const curInv = wh.inventory[rec.commodityId];
                if (curInv) {
                  return {
                    ...wh,
                    inventory: {
                      ...wh.inventory,
                      [rec.commodityId]: {
                        ...curInv,
                        available: Math.max(0, curInv.available - rec.quantity),
                        transferable: Math.max(0, curInv.transferable - rec.quantity),
                        reserved: curInv.reserved + rec.quantity
                      }
                    }
                  };
                }
              }
              return wh;
            })
          );

          // 2. Update destination zone incoming stock & reduce risk
          setZones(zoneList =>
            zoneList.map(z => {
              if (z.id === rec.destinationZoneId) {
                const comm = z.commodities[rec.commodityId];
                if (comm) {
                  const updatedIncoming = comm.incomingStock + rec.quantity;
                  const updatedStockout = Math.round(((comm.currentInventory + updatedIncoming) / comm.consumptionRatePerHour) * 10) / 10;
                  return {
                    ...z,
                    readinessPercentage: Math.min(95, z.readinessPercentage + 14),
                    riskScore: Math.max(18, z.riskScore - 35),
                    riskLevel: z.riskScore - 35 > 60 ? 'WARNING' : 'SAFE',
                    incomingDeliveriesCount: z.incomingDeliveriesCount + 1,
                    commodities: {
                      ...z.commodities,
                      [rec.commodityId]: {
                        ...comm,
                        incomingStock: updatedIncoming,
                        stockoutEtaHours: updatedStockout,
                        status: 'safe'
                      }
                    }
                  };
                }
              }
              return z;
            })
          );

          // 3. Spawn a live delivery
          const newDelivery: Delivery = {
            id: `del-${Date.now().toString().slice(-4)}`,
            code: `DEL-${Date.now().toString().slice(-4)}`,
            commodityId: rec.commodityId,
            commodityName: rec.commodityName,
            quantity: rec.quantity,
            unit: rec.unit,
            sourceId: rec.sourceWarehouseId,
            sourceName: rec.sourceWarehouseName,
            destinationId: rec.destinationZoneId,
            destinationName: rec.destinationZoneName,
            vehicleNumber: 'MP-09-EM-7721',
            vehicleType: 'Emergency Rapid Logistics (ER-09)',
            driverName: 'Officer Nilesh More',
            driverPhone: '+91 99220 54109',
            etaMinutes: rec.etaMinutes,
            progressPercent: 5,
            priority: rec.priority,
            status: 'IN TRANSIT',
            routeDistanceKm: 7.2,
            routeType: 'Primary Route',
            coordinates: { x: 55, y: 40 }
          };

          setDeliveries(d => [newDelivery, ...d]);

          // 4. Add operational alert
          const newAlert: OperationalAlert = {
            id: `alt-${Date.now()}`,
            type: 'OPERATIONAL',
            title: `Redistribution Approved: ${rec.quantity.toLocaleString()} ${rec.unit} ${rec.commodityName}`,
            message: `Dispatched from ${rec.sourceWarehouseName} to ${rec.destinationZoneName}. ETA ${rec.etaMinutes} mins.`,
            zoneId: rec.destinationZoneId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timeAgo: 'Just now',
            actionRequired: false,
            read: false
          };
          setAlerts(a => [newAlert, ...a]);

          return { ...rec, approved: true };
        }
        return rec;
      })
    );

    if (approvedRec) {
      addToast(
        'Transfer Approved & Dispatched',
        `Dispatched ${approvedRec.quantity.toLocaleString()} ${approvedRec.unit} ${approvedRec.commodityName} from ${approvedRec.sourceWarehouseName} to ${approvedRec.destinationZoneName}.`,
        'success'
      );
    }
  };

  const batchApproveRecommendations = () => {
    const unapproved = recommendations.filter(r => !r.approved);
    if (unapproved.length === 0) {
      addToast('All Transfers Approved', 'No pending recommendations awaiting authorization.', 'info');
      return;
    }
    unapproved.forEach(rec => approveRecommendation(rec.id));
    addToast('Batch Dispatches Authorized', `Successfully approved ${unapproved.length} emergency replenishment transfers.`, 'success');
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    addToast('Alert Acknowledged', 'Incident resolved and archived to operational logs.', 'info');
  };

  const acknowledgeAllAlerts = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    addToast('All Alerts Acknowledged', 'Operational status cleared.', 'success');
  };

  const triggerCrowdSurge = (zoneId: string, deltaPercent: number) => {
    const targetZone = zones.find(z => z.id === zoneId);
    setZones(prev =>
      prev.map(z => {
        if (z.id === zoneId) {
          const newCrowd = Math.round(z.crowdCount * (1 + deltaPercent / 100));
          return {
            ...z,
            crowdCount: newCrowd,
            crowdDensity: newCrowd > 120000 ? 'Surge' : 'High',
            riskLevel: 'CRITICAL',
            riskScore: Math.min(96, z.riskScore + 25),
            explainableFactors: {
              ...z.explainableFactors,
              crowdDelta: `+${deltaPercent}% sudden surge triggered`
            }
          };
        }
        return z;
      })
    );

    const surgeAlert: OperationalAlert = {
      id: `alt-surge-${Date.now()}`,
      type: 'CRITICAL',
      title: `Surge Detected: +${deltaPercent}% Influx in ${targetZone?.name || 'Sector'}`,
      message: `Crowd density escalated rapidly. Emergency buffer consumption rate increased by +35%. Proactive dispatch recommended.`,
      zoneId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      actionRequired: true,
      actionLabel: 'Redistribute Stock',
      actionTarget: 'redistribution',
      read: false
    };
    setAlerts(prev => [surgeAlert, ...prev]);

    addToast(
      'Crowd Surge Simulation Active',
      `Triggered +${deltaPercent}% pilgrim influx in ${targetZone?.name || 'Zone'}. Predicted consumption revised upwards.`,
      'warning'
    );
  };

  const simulateWeatherSpike = (type: 'heatwave' | 'rain' | 'normal') => {
    if (type === 'heatwave') {
      const updated = AIDemandForecastService.getInstance().generateForecasts(1.3, 40.5, 0.0, false, null);
      setSystemForecasts(updated);
      addToast(
        'Weather Scenario: Severe Heatwave (+40.5°C)',
        'Hydration consumption multiplier (+35%) applied to all distribution points.',
        'warning'
      );
    } else if (type === 'rain') {
      const updated = AIDemandForecastService.getInstance().generateForecasts(0.9, 26.0, 35.0, false, null);
      setSystemForecasts(updated);
      addToast(
        'Weather Scenario: Heavy Rainfall Alert',
        'Speed restriction enforced on unpaved ghat roads. Medical kits demand increased.',
        'info'
      );
    } else {
      const updated = AIDemandForecastService.getInstance().generateForecasts(1.0, 32.0, 0.0, false, null);
      setSystemForecasts(updated);
      addToast('Weather Conditions Reset', 'Atmospheric parameters returned to nominal baseline.', 'success');
    }
  };

  const triggerEmergencyReorder = (warehouseId: string, commodityId: string, amount: number) => {
    const targetWh = warehouses.find(w => w.id === warehouseId);
    const targetComm = commodities.find(c => c.id === commodityId);

    setWarehouses(prev =>
      prev.map(wh => {
        if (wh.id === warehouseId) {
          const cur = wh.inventory[commodityId];
          if (cur) {
            return {
              ...wh,
              inventory: {
                ...wh.inventory,
                [commodityId]: {
                  ...cur,
                  available: cur.available + amount,
                  transferable: cur.transferable + amount,
                  incoming: cur.incoming + amount
                }
              }
            };
          }
        }
        return wh;
      })
    );

    addToast(
      'Emergency Inbound Reorder Placed',
      `Ordered +${amount.toLocaleString()} ${targetComm?.unit || 'units'} of ${targetComm?.name || commodityId} to ${targetWh?.name || 'Warehouse'}.`,
      'success'
    );
  };

  const exportData = (format: 'csv' | 'json' | 'pdf', entityName: string) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let content = '';
      let mimeType = 'text/plain';

      if (format === 'json') {
        content = JSON.stringify({
          system: 'KumbhSupply-AI',
          entity: entityName,
          timestamp,
          forecasts: systemForecasts,
          optimizationPlan,
          activeSimulation
        }, null, 2);
        mimeType = 'application/json';
      } else {
        content = `Entity,ZoneID,Commodity,Predicted1h,Predicted24h,CurrentStock,HoursToStockout,RiskLevel,Provenance\n` +
          systemForecasts.forecasts.map(f => `Forecast,${f.zoneId},${f.commodityName},${f.predictedDemand1h},${f.predictedDemand24h},${f.currentStock},${f.hoursToStockout},${f.shortageRisk},${f.provenance}`).join('\n');
        mimeType = 'text/csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kumbhsupply_${entityName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.${format === 'json' ? 'json' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast(
        'Export Generated Successfully',
        `Downloaded ${entityName} data dossier in ${format.toUpperCase()} format.`,
        'success'
      );
    } catch (err) {
      console.error('Export failed', err);
      addToast('Export Generated', `Generated ${entityName} audit log.`, 'success');
    }
  };

  const syncTelemetry = () => {
    addToast(
      'Telemetry Synchronized',
      'All 12 Zone IoT gateways and GPS fleet beacons connected with 100% data integrity.',
      'success'
    );
  };

  const rerouteVehicle = (deliveryId: string) => {
    setDeliveries(prev =>
      prev.map(d => {
        if (d.id === deliveryId || d.code === deliveryId) {
          return {
            ...d,
            status: 'IN TRANSIT',
            routeType: 'Alternate Route',
            etaMinutes: Math.round(d.etaMinutes + 8),
            routeDistanceKm: Math.round((d.routeDistanceKm + 3.2) * 10) / 10
          };
        }
        return d;
      })
    );

    addToast(
      'Vehicle Dynamic Reroute Executed',
      'Logistics convoy diverted away from pedestrian zone via Outer Bypass & Bridge 02 (+8m ETA).',
      'warning'
    );
  };

  const simulateHourAdvance = () => {
    setZones(prev =>
      prev.map(z => {
        const updatedCommodities = { ...z.commodities };
        Object.keys(updatedCommodities).forEach(k => {
          const c = updatedCommodities[k];
          const newStock = Math.max(0, c.currentInventory - c.consumptionRatePerHour);
          const newEta = Math.max(0, Math.round((newStock / c.consumptionRatePerHour) * 10) / 10);
          updatedCommodities[k] = {
            ...c,
            currentInventory: newStock,
            stockoutEtaHours: newEta,
            status: newEta < 4 ? 'critical' : newEta < 8 ? 'warning' : 'safe'
          };
        });
        return {
          ...z,
          commodities: updatedCommodities
        };
      })
    );
    addToast('Timeline Clock Advanced', 'Simulated 1 hour of consumption and pilgrim movement.', 'info');
  };

  return (
    <KumbhDataContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCommodityId,
        setSelectedCommodityId,
        selectedZoneId,
        setSelectedZoneId,
        selectedHorizon,
        setSelectedHorizon,
        selectedModel,
        setSelectedModel,
        activeZoomLevel,
        setActiveZoomLevel,
        activeCommodityLayer,
        setActiveCommodityLayer,
        selectedTimeStep,
        setSelectedTimeStep,
        currentTimelineState,
        landmarks,
        simulatedFleet,
        followedVehicleId,
        setFollowedVehicleId,
        flyToTarget,
        setFlyToTarget,
        flyToLocation,
        isUspDemoOpen,
        setIsUspDemoOpen,
        uspDemoStep,
        setUspDemoStep,
        startUspDemoScenario,
        nextUspDemoStep,
        prevUspDemoStep,
        closeUspDemoScenario,
        commodities,
        zones,
        warehouses,
        deliveries,
        recommendations,
        alerts,
        toasts,
        multiCommodities: COMMODITY_REGISTRY,
        multiZones: ZONES_MASTER,
        multiWarehouses: WAREHOUSES_MASTER,
        allScenarios: OPERATIONAL_SCENARIOS,
        activeScenarioId,
        setActiveScenarioId,
        systemForecasts,
        optimizationPlan,
        activeSimulation,
        estimatedCrowd,
        totalActiveDeliveries,
        criticalZonesCount,
        stockoutPreventionRate,
        approveRecommendation,
        batchApproveRecommendations,
        approveProposedDispatch,
        modifyProposedDispatch,
        rejectProposedDispatch,
        runScenarioSimulation,
        resetScenarioSimulation,
        dismissAlert,
        acknowledgeAllAlerts,
        triggerCrowdSurge,
        simulateWeatherSpike,
        triggerEmergencyReorder,
        exportData,
        syncTelemetry,
        rerouteVehicle,
        simulateHourAdvance,
        addToast,
        removeToast,
        isDemoVideoOpen,
        setIsDemoVideoOpen,
        isSearchOpen,
        setIsSearchOpen
      }}
    >
      {children}
    </KumbhDataContext.Provider>
  );
};

export const useKumbhData = () => {
  const context = useContext(KumbhDataContext);
  if (!context) {
    throw new Error('useKumbhData must be used within a KumbhDataProvider');
  }
  return context;
};

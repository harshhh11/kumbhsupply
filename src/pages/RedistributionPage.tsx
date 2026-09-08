import React, { useState } from 'react';
import { useKumbhData } from '../context/KumbhDataContext';
import { SecondaryNav } from '../components/layout/SecondaryNav';
import {
  ArrowRightLeft,
  Truck,
  CheckCircle2,
  XCircle,
  Edit3,
  ShieldAlert,
  Clock,
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
  Database,
  Filter
} from 'lucide-react';
import { ProposedDispatch } from '../services/redistributionOptimizationService';

export const RedistributionPage: React.FC = () => {
  const {
    optimizationPlan,
    approveProposedDispatch,
    modifyProposedDispatch,
    rejectProposedDispatch,
    setCurrentPage,
    exportData,
    addToast
  } = useKumbhData();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [editingDispatchId, setEditingDispatchId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [rejectDispatchId, setRejectDispatchId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const proposals = optimizationPlan.proposals.filter(p =>
    filterStatus === 'ALL' || p.approvalStatus === filterStatus
  );

  const pendingCount = optimizationPlan.proposals.filter(p => p.approvalStatus === 'PENDING').length;
  const approvedCount = optimizationPlan.proposals.filter(p => p.approvalStatus === 'APPROVED').length;

  const handleStartEdit = (d: ProposedDispatch) => {
    setEditingDispatchId(d.dispatchId);
    setEditQty(d.transferQuantity);
  };

  const handleSaveEdit = (dispatchId: string) => {
    modifyProposedDispatch(dispatchId, editQty);
    setEditingDispatchId(null);
  };

  const handleConfirmReject = (dispatchId: string) => {
    if (!rejectReason.trim()) {
      addToast('Rejection Reason Required', 'Please enter a brief reason for rejecting this transfer.', 'warning');
      return;
    }
    rejectProposedDispatch(dispatchId, rejectReason);
    setRejectDispatchId(null);
    setRejectReason('');
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-800 select-none pb-16">
      <div className="pt-20">
        <SecondaryNav />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recommended Action Plan &bull; Human Authorization Required</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Supply Plan & Transfers
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Recommended stock transfers from central storage hubs to sectors running low on essential supplies. Approve with one click or customize quantities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                optimizationPlan.proposals
                  .filter(p => p.approvalStatus === 'PENDING')
                  .forEach(p => approveProposedDispatch(p.dispatchId));
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Approve All Pending ({pendingCount})</span>
            </button>
            <button
              onClick={() => exportData('csv', 'Supply_Transfers_Manifest')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV Manifest</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Transfers Recommended
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {optimizationPlan.totalProposals} <span className="text-sm font-semibold text-slate-500">deliveries</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <span className="text-amber-700 font-bold">{pendingCount} Awaiting Signoff</span> &bull; <span className="text-emerald-700 font-bold">{approvedCount} En Route</span>
            </div>
          </div>

          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              At-Risk Zones Protected
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2">
              {optimizationPlan.criticalDeficitsMitigated} <span className="text-sm font-semibold text-slate-500">zones</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Prevented critical stockout before evening surge
            </div>
          </div>

          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Volume Moving
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {optimizationPlan.totalVolumeRedistributed.toLocaleString()} <span className="text-sm font-semibold text-slate-500">units</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Water, medical kits, food packets, fuel
            </div>
          </div>

          <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Transit Time Saved
            </div>
            <div className="text-3xl font-extrabold text-sky-600 mt-2">
              +{optimizationPlan.estimatedHoursSaved} <span className="text-sm font-semibold text-slate-500">hours</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Faster response via closest available depot
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Filter Status:</span>
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All Plans' : status === 'PENDING' ? 'Pending Signoff' : status === 'APPROVED' ? 'Approved & Dispatched' : 'Rejected'}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            Routes verified with real road navigation geometry
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {proposals.map((dispatch) => (
            <div
              key={dispatch.dispatchId}
              className={`glass-panel p-6 rounded-2xl border transition-all ${
                dispatch.approvalStatus === 'APPROVED'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : dispatch.approvalStatus === 'REJECTED'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      {dispatch.dispatchId}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                      dispatch.priorityLevel === 'CRITICAL_URGENT'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {dispatch.priorityLevel === 'CRITICAL_URGENT' ? 'URGENT PRIORITY' : 'ROUTINE RESTOCK'}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Vehicle: {dispatch.vehicleId} ({dispatch.vehicleType})
                    </span>
                  </div>

                  <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{dispatch.sourceName}</span>
                    <span className="text-slate-400 font-mono">&rarr;</span>
                    <span className="text-amber-800 font-bold">{dispatch.destinationZoneName}</span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                    <span>Supply Item: <strong className="text-slate-900">{dispatch.commodityName}</strong></span>
                    <span>Quantity to Send: <strong className="text-slate-900">{dispatch.transferQuantity.toLocaleString()} {dispatch.unit}</strong></span>
                    <span>Distance: <strong className="text-slate-900 font-mono">{dispatch.distanceKm} km</strong></span>
                    <span>Travel Time: <strong className="text-slate-900 font-mono">{dispatch.estimatedTransitMinutes} mins</strong></span>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                    <span className="font-semibold text-slate-800">Why this is needed: </span>{dispatch.urgencyReason}
                  </div>

                  {dispatch.reviewedBy && (
                    <div className="text-[11px] font-mono text-slate-500">
                      Authorized by: {dispatch.reviewedBy} at {new Date(dispatch.reviewedAt || '').toLocaleTimeString()}
                      {dispatch.rejectionReason && ` (Reason: ${dispatch.rejectionReason})`}
                    </div>
                  )}
                </div>

                {/* Action Buttons / Modals */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                  {dispatch.approvalStatus === 'PENDING' && (
                    <>
                      <button
                        onClick={() => approveProposedDispatch(dispatch.dispatchId)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Dispatch</span>
                      </button>

                      <button
                        onClick={() => handleStartEdit(dispatch)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Change Amount</span>
                      </button>

                      <button
                        onClick={() => setRejectDispatchId(dispatch.dispatchId)}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {dispatch.approvalStatus === 'APPROVED' && (
                    <button
                      onClick={() => setCurrentPage('routes')}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Best Route</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Edit Form */}
              {editingDispatchId === dispatch.dispatchId && (
                <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-xl">
                  <label className="text-xs font-bold text-slate-700">Set Quantity ({dispatch.unit}):</label>
                  <input
                    type="number"
                    value={editQty}
                    onChange={e => setEditQty(Number(e.target.value))}
                    className="px-3 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg w-32"
                  />
                  <button
                    onClick={() => handleSaveEdit(dispatch.dispatchId)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Save & Approve
                  </button>
                  <button
                    onClick={() => setEditingDispatchId(null)}
                    className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Inline Reject Form */}
              {rejectDispatchId === dispatch.dispatchId && (
                <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3 bg-red-50/50 p-3 rounded-xl">
                  <label className="text-xs font-bold text-red-800">Reason for rejection:</label>
                  <input
                    type="text"
                    value={rejectReason}
                    placeholder="e.g. Local road closed or alternative supply available"
                    onChange={e => setRejectReason(e.target.value)}
                    className="px-3 py-1 text-xs bg-white border border-red-200 rounded-lg flex-1 min-w-[200px]"
                  />
                  <button
                    onClick={() => handleConfirmReject(dispatch.dispatchId)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => { setRejectDispatchId(null); setRejectReason(''); }}
                    className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

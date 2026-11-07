import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Building2 
} from 'lucide-react';
import { transferService } from '../api/transferService';
import { useToast } from '../context/ToastContext';

export const TransferTracker = ({ initialReference = '' }) => {
  const [reference, setReference] = useState(initialReference || '');
  const [transfer, setTransfer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (initialReference) {
      setReference(initialReference);
      trackReference(initialReference);
    }
  }, [initialReference]);

  const trackReference = async (ref) => {
    const trimmed = (ref || reference).trim();
    if (!trimmed) {
      toast.error('Please enter a transaction reference.');
      return;
    }
    setLoading(true);
    setTransfer(null);
    try {
      const data = await transferService.getTransferStatus(trimmed);
      setTransfer(data);
    } catch (err) {
      toast.error(err.message || 'Transfer reference not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!transfer?.transactionReference) return;
    navigator.clipboard.writeText(transfer.transactionReference);
    setCopied(true);
    toast.success('Copied reference to clipboard!', 1500);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-600" />
          Transfer Saga Tracker
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Query transfer status across Transfer Service & Saga state repository
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            trackReference();
          }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Paste transaction reference UUID..."
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Track Status <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Transfer Details Card */}
      {transfer && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 animate-slide-in space-y-6">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
            <div>
              <div className="text-xs text-slate-400 font-medium">Transaction Reference</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-base sm:text-lg font-bold text-slate-800 break-all">
                  {transfer.transactionReference}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="self-start sm:self-auto">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  transfer.status === 'SUCCESS'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : transfer.status === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : transfer.status === 'COMPENSATED'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {transfer.status === 'SUCCESS' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : transfer.status === 'REJECTED' ? (
                  <XCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                {transfer.status}
              </span>
            </div>
          </div>

          {/* Transfer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-xs text-slate-400 font-medium uppercase">Source Account</div>
              <div className="font-mono font-bold text-slate-800 text-base mt-1">
                {transfer.sourceAccount}
              </div>
            </div>

            <div className="sm:text-center">
              <div className="text-xs text-slate-400 font-medium uppercase">Transfer Amount</div>
              <div className="font-bold text-indigo-600 text-xl mt-1">
                {transfer.currency} {Number(transfer.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-400 font-medium uppercase">Destination Account</div>
              <div className="font-mono font-bold text-slate-800 text-base mt-1">
                {transfer.destinationAccount}
              </div>
            </div>
          </div>

          {/* Failure / Compensation Reason */}
          {transfer.failureReason && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Orchestration Alert:
              </div>
              <div>{transfer.failureReason}</div>
            </div>
          )}

          {/* Visual Saga Progress Stepper */}
          <div className="pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Saga Stage Progression
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              {/* Step 1: Request & Fraud Check */}
              <div className={`p-4 rounded-xl border text-xs ${
                transfer.status !== 'REJECTED' 
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Fraud Risk Check
                </div>
                <div className="mt-1 text-[11px] opacity-80">
                  {transfer.status === 'REJECTED' ? 'Blocked by Fraud Rules' : 'Passed & Approved'}
                </div>
              </div>

              {/* Step 2: Source Ledger Debit */}
              <div className={`p-4 rounded-xl border text-xs ${
                transfer.status === 'REJECTED'
                  ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
              }`}>
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Source Debit
                </div>
                <div className="mt-1 text-[11px] opacity-80">
                  {transfer.status === 'REJECTED' ? 'Not Executed' : 'Debited with Lock'}
                </div>
              </div>

              {/* Step 3: Destination Ledger Credit */}
              <div className={`p-4 rounded-xl border text-xs ${
                transfer.status === 'SUCCESS'
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : transfer.status === 'COMPENSATED'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}>
                <div className="font-semibold flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Destination Credit
                </div>
                <div className="mt-1 text-[11px] opacity-80">
                  {transfer.status === 'SUCCESS' ? 'Credited to recipient' : transfer.status === 'COMPENSATED' ? 'Failed → Compensated' : 'Pending/Halted'}
                </div>
              </div>

              {/* Step 4: Event Bus Broadcast */}
              <div className={`p-4 rounded-xl border text-xs ${
                transfer.status === 'SUCCESS'
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}>
                <div className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Kafka Event Bus
                </div>
                <div className="mt-1 text-[11px] opacity-80">
                  {transfer.status === 'SUCCESS' ? 'transfer-events Published' : 'Event not dispatched'}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};


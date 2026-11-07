import React, { useState, useEffect } from 'react';
import { 
  Send, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { transferService } from '../api/transferService';
import { beneficiaryService } from '../api/beneficiaryService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const TransferSection = ({ 
  accounts = [], 
  selectedSourceAccount = '', 
  prefilledDestination = '',
  onTransferComplete,
  onNavigateToTracker 
}) => {
  const { user } = useAuth();
  const toast = useToast();

  const [sourceAccount, setSourceAccount] = useState(selectedSourceAccount || '');
  const [destinationMode, setDestinationMode] = useState('beneficiary'); // 'beneficiary' | 'manual'
  const [destinationAccount, setDestinationAccount] = useState(prefilledDestination || '');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Sync prop changes
  useEffect(() => {
    if (selectedSourceAccount) setSourceAccount(selectedSourceAccount);
  }, [selectedSourceAccount]);

  useEffect(() => {
    if (prefilledDestination) {
      setDestinationAccount(prefilledDestination);
      setDestinationMode('manual');
    }
  }, [prefilledDestination]);

  // Load beneficiaries for dropdown
  useEffect(() => {
    if (!user) return;
    const fetchBeneficiaries = async () => {
      setLoadingBeneficiaries(true);
      try {
        const data = await beneficiaryService.getBeneficiaries(user);
        if (Array.isArray(data)) {
          setBeneficiaries(data);
          if (data.length > 0 && !destinationAccount && !prefilledDestination) {
            setDestinationAccount(data[0].beneficiaryAccount);
          }
        }
      } catch (err) {
        console.warn('Could not fetch beneficiaries:', err);
      } finally {
        setLoadingBeneficiaries(false);
      }
    };
    fetchBeneficiaries();
  }, [user]);

  // If no source account selected but accounts available, pick the first
  useEffect(() => {
    if (!sourceAccount && accounts.length > 0) {
      setSourceAccount(accounts[0].accountNumber);
    }
  }, [accounts, sourceAccount]);

  const selectedSourceObj = accounts.find((a) => a.accountNumber === sourceAccount);

  // Fraud detection preview based on backend rules in FraudDetectionService
  const amountNum = parseFloat(amount) || 0;
  let fraudPreview = { level: 'LOW', text: 'Low risk. Transaction eligible for instant processing.', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  
  if (sourceAccount && destinationAccount && sourceAccount === destinationAccount) {
    fraudPreview = { level: 'CRITICAL', text: 'Rejected: Source and destination accounts cannot be identical.', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  } else if (amountNum >= 500000) {
    fraudPreview = { level: 'HIGH', text: 'High Risk (Score 90): Amount ≥ ₹500,000 will be REJECTED by Fraud Service.', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  } else if (amountNum >= 100000) {
    fraudPreview = { level: 'MEDIUM', text: 'Medium Risk (Score 60): Amount ≥ ₹100,000 requires manual review and will be REJECTED in demo.', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  } else if (amountNum >= 50000) {
    fraudPreview = { level: 'MONITORED', text: 'Notice (Score 30): Amount ≥ ₹50,000 flagged for standard monitoring (Approved).', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sourceAccount) {
      toast.error('Please select a source account.');
      return;
    }
    const dest = destinationAccount.trim();
    if (!dest) {
      toast.error('Please specify a destination account.');
      return;
    }
    if (sourceAccount === dest) {
      toast.error('Source and destination accounts must differ.');
      return;
    }
    if (amountNum <= 0) {
      toast.error('Transfer amount must be greater than 0.');
      return;
    }

    setSubmitting(true);
    setLastResult(null);

    try {
      const result = await transferService.initiateTransfer({
        sourceAccount,
        destinationAccount: dest,
        amount: amountNum,
        currency,
      });

      setLastResult(result);

      if (result.status === 'SUCCESS') {
        toast.success(`Transfer of ${currency} ${amountNum} completed successfully!`);
        if (onTransferComplete) onTransferComplete();
      } else if (result.status === 'REJECTED') {
        toast.warning(`Transfer rejected: ${result.failureReason || 'Fraud check failed'}`);
      } else if (result.status === 'COMPENSATED') {
        toast.error(`Transfer failed & compensated: ${result.failureReason}`);
        if (onTransferComplete) onTransferComplete();
      } else {
        toast.error(`Transfer status: ${result.status}`);
      }
    } catch (err) {
      toast.error(err.message || 'Transfer failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyReference = () => {
    if (!lastResult?.transactionReference) return;
    navigator.clipboard.writeText(lastResult.transactionReference);
    setCopiedRef(true);
    toast.success('Reference copied to clipboard!', 2000);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Transfer Form Card */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              Initiate Interbank Fund Transfer
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Synchronous Saga Orchestration (Fraud check → Ledger debit → Ledger credit)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Source Account */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Source Account (Sender)
            </label>
            {accounts.length === 0 ? (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200">
                No active accounts found for user {user}. Please open an account first.
              </div>
            ) : (
              <select
                value={sourceAccount}
                onChange={(e) => setSourceAccount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              >
                {accounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber} — Available: {acc.currency} {Number(acc.balance).toLocaleString()}
                  </option>
                ))}
              </select>
            )}

            {selectedSourceObj && (
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Account Holder: <strong className="text-slate-700">{selectedSourceObj.customerId}</strong></span>
                <span>Current Balance: <strong className="text-indigo-600 font-semibold">{selectedSourceObj.currency} {Number(selectedSourceObj.balance).toLocaleString()}</strong></span>
              </div>
            )}
          </div>

          {/* Destination Account Selection Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Destination Account (Recipient)
              </label>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setDestinationMode('beneficiary')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    destinationMode === 'beneficiary'
                      ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Saved Beneficiary
                </button>
                <button
                  type="button"
                  onClick={() => setDestinationMode('manual')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    destinationMode === 'manual'
                      ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Manual Account No.
                </button>
              </div>
            </div>

            {destinationMode === 'beneficiary' ? (
              beneficiaries.length > 0 ? (
                <select
                  value={destinationAccount}
                  onChange={(e) => setDestinationAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id || b.beneficiaryAccount} value={b.beneficiaryAccount}>
                      {b.beneficiaryName} ({b.beneficiaryAccount}) — {b.bankName || 'Bank'}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex justify-between items-center">
                  <span>No saved beneficiaries yet.</span>
                  <button
                    type="button"
                    onClick={() => setDestinationMode('manual')}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Enter account manually
                  </button>
                </div>
              )
            ) : (
              <input
                type="text"
                placeholder="e.g. ACC2001"
                value={destinationAccount}
                onChange={(e) => setDestinationAccount(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 uppercase"
                required
              />
            )}
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Transfer Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Real-time Fraud Detection Rule Preview */}
          {amountNum > 0 && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${fraudPreview.color}`}>
              {fraudPreview.level === 'LOW' || fraudPreview.level === 'MONITORED' ? (
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              )}
              <div>
                <div className="font-semibold">{fraudPreview.level} Fraud Risk Assessment</div>
                <div className="mt-0.5">{fraudPreview.text}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || accounts.length === 0}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Executing Saga Orchestration...
              </>
            ) : (
              <>
                Confirm & Send Transfer <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>

      {/* Right Column: Saga Flow & Real-time Outcome */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Execution Result Banner */}
        {lastResult && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-slide-in">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {lastResult.status === 'SUCCESS' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : lastResult.status === 'REJECTED' ? (
                  <XCircle className="w-6 h-6 text-rose-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                )}
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Transfer Execution Outcome</h3>
                  <div className="text-[11px] text-slate-500">Orchestrator Response</div>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  lastResult.status === 'SUCCESS'
                    ? 'bg-emerald-100 text-emerald-800'
                    : lastResult.status === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {lastResult.status}
              </span>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Transaction Reference:</span>
                <div className="flex items-center gap-2 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="truncate font-semibold text-slate-800">{lastResult.transactionReference}</span>
                  <button
                    onClick={copyReference}
                    title="Copy Reference"
                    className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {lastResult.failureReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
                  <strong>Reason:</strong> {lastResult.failureReason}
                </div>
              )}

              {onNavigateToTracker && (
                <button
                  type="button"
                  onClick={() => onNavigateToTracker(lastResult.transactionReference)}
                  className="w-full mt-2 py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Detailed Saga Audit Timeline
                </button>
              )}
            </div>
          </div>
        )}

        {/* How It Works Explainer Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-indigo-950">
          <h3 className="font-bold text-sm tracking-wide text-indigo-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            Distributed Saga Flow Engine
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Every transfer triggers a coordinated distributed transaction across independent microservices:
          </p>

          <ol className="mt-4 space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-800/80 text-indigo-200 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
              <span><strong>Fraud Service (:9086):</strong> Evaluates amounts, thresholds, and accounts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-800/80 text-indigo-200 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
              <span><strong>Ledger Debit (:9082):</strong> Pessimistic lock & debit on source account.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-800/80 text-indigo-200 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
              <span><strong>Ledger Credit (:9082):</strong> Credit destination. If destination fails, automatic compensating credit is issued!</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-800/80 text-indigo-200 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
              <span><strong>Kafka Event (:9092):</strong> Emits completed event to notification topic.</span>
            </li>
          </ol>
        </div>

      </div>

    </div>
  );
};


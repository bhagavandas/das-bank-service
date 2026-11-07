import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, AlertCircle } from 'lucide-react';
import { accountService } from '../api/accountService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CreateAccountModal = ({ isOpen, onClose, onAccountCreated }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [accountNumber, setAccountNumber] = useState('');
  const [initialBalance, setInitialBalance] = useState('10000');
  const [currency, setCurrency] = useState('INR');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const generateRandomAccount = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setAccountNumber(`ACC${randomNum}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const accNo = accountNumber.trim();
    if (!accNo) {
      setError('Please provide or generate an account number.');
      return;
    }

    const bal = parseFloat(initialBalance);
    if (isNaN(bal) || bal < 0) {
      setError('Initial balance must be zero or a positive amount.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await accountService.createAccount({
        accountNumber: accNo,
        customerId: user,
        initialBalance: bal,
        currency,
      });

      toast.success(`Account ${created.accountNumber} created successfully with initial deposit!`);
      onAccountCreated(created);
      onClose();
      setAccountNumber('');
      setInitialBalance('10000');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
      toast.error(err.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">Open New Bank Account</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Account Number with Generator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Account Number</label>
              <button
                type="button"
                onClick={generateRandomAccount}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-generate
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. ACC1001"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 uppercase"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">Unique account identifier in the Ledger database.</p>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
            </select>
          </div>

          {/* Initial Balance */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Initial Deposit Balance</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                placeholder="10000"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-medium">
                {currency}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Creates initial credit ledger record with reference <code className="bg-slate-100 px-1 rounded">OPEN-UUID</code>.
            </p>
          </div>

          {/* Customer ID Readonly Tag */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center text-slate-600">
            <span>Linked Customer:</span>
            <span className="font-semibold text-indigo-900 font-mono">{user}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Opening Account...
                </>
              ) : (
                'Confirm & Open'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


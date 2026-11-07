import React, { useState } from 'react';
import { CreditCard, Copy, Check, ArrowUpRight, History, Shield } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AccountCard = ({ account, onSelectHistory, onSelectTransfer }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    toast.success(`Account number ${account.accountNumber} copied to clipboard!`, 2000);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: account.currency || 'INR',
    maximumFractionDigits: 2,
  }).format(account.balance || 0);

  return (
    <div className="relative group overflow-hidden rounded-2xl p-6 text-white card-gradient-primary shadow-xl shadow-indigo-900/10 border border-indigo-700/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-400/30 transition-all"></div>
      
      <div className="relative z-10 flex flex-col justify-between h-48">
        {/* Top Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-300" />
            <span className="text-xs uppercase font-semibold tracking-wider text-indigo-200">
              Interbank Savings
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {account.status || 'ACTIVE'}
          </div>
        </div>

        {/* Center: Balance */}
        <div>
          <div className="text-xs text-indigo-200/80 uppercase font-medium">Available Balance</div>
          <div className="text-3xl font-extrabold tracking-tight text-white mt-1">
            {formattedBalance}
          </div>
        </div>

        {/* Bottom Details & Quick Actions */}
        <div className="flex items-end justify-between pt-2 border-t border-indigo-800/60">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-indigo-300">Account Number</div>
            <div className="flex items-center gap-2 font-mono text-sm tracking-wider font-semibold text-white">
              {account.accountNumber}
              <button
                onClick={handleCopy}
                title="Copy Account Number"
                className="text-indigo-300 hover:text-white transition-colors p-0.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSelectHistory && (
              <button
                onClick={() => onSelectHistory(account.accountNumber)}
                title="View Account Ledger Entries"
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors flex items-center gap-1"
              >
                <History className="w-3.5 h-3.5" />
                Ledger
              </button>
            )}
            {onSelectTransfer && (
              <button
                onClick={() => onSelectTransfer(account.accountNumber)}
                title="Send money from this account"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Transfer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


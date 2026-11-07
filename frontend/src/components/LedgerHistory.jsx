import React, { useState, useEffect } from 'react';
import { 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  RefreshCw, 
  Copy, 
  Check, 
  Filter,
  DollarSign 
} from 'lucide-react';
import { ledgerService } from '../api/ledgerService';
import { useToast } from '../context/ToastContext';

export const LedgerHistory = ({ accounts = [], initialAccount = '' }) => {
  const [selectedAccount, setSelectedAccount] = useState(initialAccount || '');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL | CREDIT | DEBIT
  const [copiedId, setCopiedId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (initialAccount) {
      setSelectedAccount(initialAccount);
    } else if (!selectedAccount && accounts.length > 0) {
      setSelectedAccount(accounts[0].accountNumber);
    }
  }, [initialAccount, accounts]);

  const fetchHistory = async (acc) => {
    if (!acc) return;
    setLoading(true);
    try {
      const data = await ledgerService.getAccountHistory(acc);
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch ledger history');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedAccount) {
      fetchHistory(selectedAccount);
    }
  }, [selectedAccount]);

  const copyRef = (ref, id) => {
    navigator.clipboard.writeText(ref);
    setCopiedId(id);
    toast.success('Transaction reference copied!', 1500);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      (e.transactionReference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.accountNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || e.entryType === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const totalCredits = entries
    .filter((e) => e.entryType === 'CREDIT')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const totalDebits = entries
    .filter((e) => e.entryType === 'DEBIT')
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header & Account Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Ledger & Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable double-entry ledger transactions from Ledger Service (:9082)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Account:
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            {accounts.map((acc) => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountNumber} ({acc.currency} {Number(acc.balance).toLocaleString()})
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchHistory(selectedAccount)}
            disabled={loading}
            title="Refresh Ledger"
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Credits In</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <ArrowDownLeft className="w-5 h-5" />
            +₹{totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Debits Out</div>
          <div className="text-2xl font-bold text-rose-600 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5" />
            -₹{totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transactions</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            {entries.length} entries
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search reference or account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {['ALL', 'CREDIT', 'DEBIT'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                typeFilter === type
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading ledger entries...
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No ledger entries found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Transaction Reference</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Balance After</th>
                  <th className="py-3 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {filteredEntries.map((e) => {
                  const isCredit = e.entryType === 'CREDIT';
                  return (
                    <tr key={e.id || e.transactionReference} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Entry Type Badge */}
                      <td className="py-3.5 px-4 font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isCredit
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                          {e.entryType}
                        </span>
                      </td>

                      {/* Transaction Reference */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="font-semibold">{e.transactionReference}</span>
                          <button
                            onClick={() => copyRef(e.transactionReference, e.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            title="Copy Reference"
                          >
                            {copiedId === e.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Amount */}
                      <td
                        className={`py-3.5 px-4 text-right font-bold text-sm ${
                          isCredit ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isCredit ? '+' : '-'}₹
                        {parseFloat(e.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Balance After */}
                      <td className="py-3.5 px-4 text-right text-slate-800 font-semibold text-sm">
                        ₹{parseFloat(e.balanceAfter).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-right text-slate-400 font-sans text-xs">
                        {e.createdAt ? new Date(e.createdAt).toLocaleString() : 'Recent'}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};


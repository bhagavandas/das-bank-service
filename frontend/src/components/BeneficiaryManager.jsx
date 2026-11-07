import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Send, 
  Building, 
  Hash, 
  CreditCard, 
  Plus, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { beneficiaryService } from '../api/beneficiaryService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const BeneficiaryManager = ({ onSelectPay }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [bank, setBank] = useState('State Bank of India');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchBeneficiaries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await beneficiaryService.getBeneficiaries(user);
      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load beneficiaries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    const bName = name.trim();
    const bAcc = account.trim();

    if (!bName || !bAcc) {
      setError('Please provide beneficiary name and account number.');
      return;
    }

    setSubmitting(true);
    try {
      await beneficiaryService.addBeneficiary({
        customerId: user,
        beneficiaryName: bName,
        beneficiaryAccount: bAcc,
        bankName: bank.trim(),
        ifscCode: ifsc.trim(),
      });

      toast.success(`Beneficiary "${bName}" added successfully!`);
      setShowAddModal(false);
      setName('');
      setAccount('');
      fetchBeneficiaries();
    } catch (err) {
      setError(err.message || 'Failed to add beneficiary');
      toast.error(err.message || 'Failed to add beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, bName) => {
    if (!confirm(`Are you sure you want to remove beneficiary "${bName}"?`)) return;
    try {
      await beneficiaryService.deleteBeneficiary(id, user);
      toast.success(`Beneficiary "${bName}" removed.`);
      fetchBeneficiaries();
    } catch (err) {
      toast.error(err.message || 'Failed to remove beneficiary');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Beneficiary Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Registered payees for instant interbank fund routing (Beneficiary Service :9085)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add Beneficiary
        </button>
      </div>

      {/* Beneficiary Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading beneficiaries...
        </div>
      ) : beneficiaries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-700">No beneficiaries added yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Add frequent transfer recipients to quickly route payments without retyping account numbers.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Beneficiary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {beneficiaries.map((b) => (
            <div
              key={b.id || b.beneficiaryAccount}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{b.beneficiaryName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {b.bankName || 'Partner Bank'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(b.id, b.beneficiaryName)}
                    title="Remove Beneficiary"
                    className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Account:</span>
                    <strong className="text-slate-800">{b.beneficiaryAccount}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="text-slate-700">{b.ifscCode || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onSelectPay(b.beneficiaryAccount)}
                  className="w-full py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Transfer to {b.beneficiaryName.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">Add Beneficiary</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Beneficiary Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Beneficiary Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. ACC2001"
                  value={account}
                  onChange={(e) => setAccount(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="HDFC / SBI / Demo"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="DEMO0001234"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 uppercase"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? 'Saving...' : 'Save Beneficiary'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};


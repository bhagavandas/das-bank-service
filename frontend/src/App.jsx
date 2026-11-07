import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { AccountCard } from './components/AccountCard';
import { CreateAccountModal } from './components/CreateAccountModal';
import { TransferSection } from './components/TransferSection';
import { BeneficiaryManager } from './components/BeneficiaryManager';
import { LedgerHistory } from './components/LedgerHistory';
import { TransferTracker } from './components/TransferTracker';
import { accountService } from './api/accountService';
import { 
  LayoutDashboard, 
  Send, 
  Users, 
  History, 
  Search, 
  Plus, 
  RefreshCw, 
  Layers, 
  AlertCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Server, 
  Database 
} from 'lucide-react';

export function App() {
  const { isAuthenticated, user, backendStatus, checkBackend } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | transfer | beneficiaries | ledger | tracker | architecture
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Selected state for navigation bridging
  const [prefilledTransferSource, setPrefilledTransferSource] = useState('');
  const [prefilledTransferDest, setPrefilledTransferDest] = useState('');
  const [trackedReference, setTrackedReference] = useState('');
  const [ledgerAccountFilter, setLedgerAccountFilter] = useState('');

  const loadAccounts = async () => {
    if (!user) return;
    setLoadingAccounts(true);
    try {
      const data = await accountService.getCustomerAccounts(user);
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to fetch accounts:', err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadAccounts();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Calculate total portfolio balance across user's accounts
  const totalBalance = accounts.reduce((acc, curr) => acc + (parseFloat(curr.balance) || 0), 0);

  // Handlers for cross-tab actions
  const handleTransferFromCard = (accNumber) => {
    setPrefilledTransferSource(accNumber);
    setActiveTab('transfer');
  };

  const handleLedgerFromCard = (accNumber) => {
    setLedgerAccountFilter(accNumber);
    setActiveTab('ledger');
  };

  const handlePayBeneficiary = (destAcc) => {
    setPrefilledTransferDest(destAcc);
    setActiveTab('transfer');
  };

  const handleTrackTransfer = (ref) => {
    setTrackedReference(ref);
    setActiveTab('tracker');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Offline Backend Alert Banner */}
        {backendStatus === 'offline' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 text-xs shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-sm">Backend Gateway Offline (:9080)</strong>
                <span>
                  The React application connects to the Spring Boot API Gateway on port 9080.
                  To start backend services, run <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">docker compose up --build</code> in your terminal.
                </span>
              </div>
            </div>
            <button
              onClick={checkBackend}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition-colors shrink-0"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Tab Navigation Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl w-full sm:w-auto overflow-x-auto mb-8 border border-slate-300/40">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'transfer', label: 'Transfer Funds', icon: Send },
            { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
            { id: 'ledger', label: 'Ledger Audit', icon: History },
            { id: 'tracker', label: 'Track Transfer', icon: Search },
            { id: 'architecture', label: 'Architecture', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ===================== TAB 1: DASHBOARD ===================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Portfolio Summary Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
                    Net Portfolio Balance
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                    ₹{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Managed across <strong className="text-slate-200">{accounts.length}</strong> active bank account(s) for customer <strong className="text-indigo-300 font-mono">{user}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Open New Account
                  </button>

                  <button
                    onClick={() => setActiveTab('transfer')}
                    className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Transfer
                  </button>
                </div>
              </div>
            </div>

            {/* Accounts Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Your Bank Accounts</h3>
                  <p className="text-xs text-slate-500">Accounts synced with the Ledger Service</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAccounts}
                    disabled={loadingAccounts}
                    title="Refresh Accounts"
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingAccounts ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Account
                  </button>
                </div>
              </div>

              {loadingAccounts ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading accounts...
                </div>
              ) : accounts.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No accounts found for {user}</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Open your first account with initial deposit (e.g. ACC1001 with ₹100,000) to start testing transfers and ledger tracking.
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Open First Account
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accounts.map((acc) => (
                    <AccountCard
                      key={acc.accountNumber}
                      account={acc}
                      onSelectTransfer={handleTransferFromCard}
                      onSelectHistory={handleLedgerFromCard}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div 
                onClick={() => setActiveTab('transfer')}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-3">Interbank Transfer</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Send funds across accounts with automated fraud checks & saga coordination.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('beneficiaries')}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-3">Beneficiary Payees</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Manage external payees and quick-transfer recipient accounts.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('ledger')}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <History className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mt-3">Ledger Entries</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Audit chronological double-entry debit/credit ledger records.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ===================== TAB 2: TRANSFER FUNDS ===================== */}
        {activeTab === 'transfer' && (
          <div className="animate-fade-in">
            <TransferSection
              accounts={accounts}
              selectedSourceAccount={prefilledTransferSource}
              prefilledDestination={prefilledTransferDest}
              onTransferComplete={loadAccounts}
              onNavigateToTracker={handleTrackTransfer}
            />
          </div>
        )}

        {/* ===================== TAB 3: BENEFICIARIES ===================== */}
        {activeTab === 'beneficiaries' && (
          <div className="animate-fade-in">
            <BeneficiaryManager onSelectPay={handlePayBeneficiary} />
          </div>
        )}

        {/* ===================== TAB 4: LEDGER AUDIT ===================== */}
        {activeTab === 'ledger' && (
          <div className="animate-fade-in">
            <LedgerHistory
              accounts={accounts}
              initialAccount={ledgerAccountFilter}
            />
          </div>
        )}

        {/* ===================== TAB 5: TRANSFER TRACKER ===================== */}
        {activeTab === 'tracker' && (
          <div className="animate-fade-in">
            <TransferTracker initialReference={trackedReference} />
          </div>
        )}

        {/* ===================== TAB 6: ARCHITECTURE ===================== */}
        {activeTab === 'architecture' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Microservices Architecture Topology
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                How this React frontend communicates with your Spring Boot backend microservices
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">API Gateway</span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Port 9080</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Spring Cloud Gateway with JWT authentication global filter & route proxying.
                </p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">Routes: /api/**</div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">Auth Service</span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Port 9081</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  User registration, BCrypt password hashing, and signed JWT issuance.
                </p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">Routes: /api/auth/**</div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">Ledger Service</span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Port 9082</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Double-entry accounting, pessimistic database locks, accounts and transaction entries.
                </p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">Routes: /api/accounts/**, /api/ledger/**</div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">Transfer Service</span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Port 9083</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Saga orchestrator executing synchronous debit & credit with compensating rollback.
                </p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">Routes: /api/transfers/**</div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">Beneficiary Service</span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Port 9085</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Manages external recipient directory with bank name, IFSC, and account routing.
                </p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">Routes: /api/beneficiaries/**</div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800">Fraud Service</span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Port 9086</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Real-time transaction risk scoring & threshold checks (50k, 100k, 500k thresholds).
                </p>
                <div className="text-[11px] text-slate-400 mt-2 font-mono">Routes: /api/fraud/**</div>
              </div>

            </div>

            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900 space-y-2">
              <strong className="font-semibold block text-sm flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-600" />
                Frontend Connection Configuration
              </strong>
              <p>
                The React Vite development server proxies requests from <code className="bg-indigo-100/80 px-1.5 py-0.5 rounded font-mono">http://localhost:3000/api</code> directly to the API Gateway at <code className="bg-indigo-100/80 px-1.5 py-0.5 rounded font-mono">http://localhost:9080/api</code>, preventing browser CORS preflight blocks.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Modal: Open New Account */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAccountCreated={(newAcc) => {
          loadAccounts();
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          NovaBank Interbank Fund Transfer System — React 18 + Spring Boot 3.3.5 Microservices
        </div>
      </footer>

    </div>
  );
}


import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  LogOut,
  User,
  ShieldCheck,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, backendStatus, checkBackend } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                  DASBank
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Interbank Transfer
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Spring Boot Microservices & Saga Engine</p>
            </div>
          </div>

          {/* Right Header Section */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Backend Gateway Health Indicator */}
            <div
              onClick={checkBackend}
              title="Click to refresh backend connectivity check"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${backendStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : backendStatus === 'checking'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
            >
              {backendStatus === 'online' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden sm:inline">Gateway :9080 Online</span>
                  <span className="sm:hidden">Online</span>
                </>
              ) : backendStatus === 'checking' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline">Gateway Offline</span>
                  <span className="sm:hidden">Offline</span>
                </>
              )}
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {user ? user[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-slate-800">{user}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Authenticated
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign out of bank portal"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};


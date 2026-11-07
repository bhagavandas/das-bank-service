import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Server, 
  Zap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthPage = () => {
  const { login, register, backendStatus } = useAuth();
  const toast = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('customer1');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(username.trim(), password);
        toast.success(`Welcome back, ${username}!`);
      } else {
        await register(username.trim(), password);
        toast.success('Registration successful! Logging you in...');
        await login(username.trim(), password);
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please verify credentials or backend status.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (user = 'customer1', pass = 'Password@123') => {
    setUsername(user);
    setPassword(pass);
    toast.info(`Filled test credentials for ${user}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        
        {/* Brand header */}
        <div className="text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            NovaBank Interbank Portal
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enterprise Transfer Platform & Distributed Ledger
          </p>
        </div>

        {/* Auth Box */}
        <div className="mt-8 bg-slate-800/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-700/80">
          
          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-900/60 p-1 mb-6 border border-slate-700/50">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isLogin
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isLogin
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register New User
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. customer1"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {isLogin ? 'Sign In to Portal' : 'Create Bank Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Preset */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Quick Test Credentials
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('customer1', 'Password@123')}
                className="flex-1 py-1.5 px-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                customer1
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('customer2', 'Password@123')}
                className="flex-1 py-1.5 px-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                customer2
              </button>
            </div>
          </div>

          {/* Gateway Status Note */}
          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-400 inline-flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              Target Gateway: <code className="text-slate-300">http://localhost:9080</code>
            </span>
          </div>

        </div>

        {/* Microservices Architecture Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-[10px] text-slate-400">
          <span className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            Spring Cloud Gateway :9080
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            Auth :9081
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            Ledger :9082
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            Transfer :9083
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            Beneficiary :9085
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
            Fraud :9086
          </span>
        </div>

      </div>

    </div>
  );
};


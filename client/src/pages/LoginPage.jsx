import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { playAgentChime } from '../utils/audio';

export default function LoginPage() {
  const [email, setEmail] = useState('alex@sprintflow.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleQuickDemoLogin = async () => {
    playAgentChime(600);
    const demoEmail = 'alex@sprintflow.ai';
    const demoPass = 'password123';
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');
    const res = await login(demoEmail, demoPass);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden text-white">
      
      {/* Top-Left Back to Home Button */}
      <Link
        to="/"
        onClick={() => playAgentChime(500)}
        className="absolute top-6 left-6 z-20 inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-400 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-lg hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4 text-purple-400" />
        <span>Back to Home</span>
      </Link>

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header with Clickable Logo */}
        <div className="text-center space-y-2">
          <Link to="/" onClick={() => playAgentChime(500)} className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-purple-300 transition-colors">SprintFlow AI</span>
          </Link>
          <h2 className="text-xl font-bold text-white">Welcome back to Agentic OS</h2>
          <p className="text-xs text-slate-400">Sign in to access your autonomous project strategies</p>
        </div>

        {/* 1-Click Hackathon Demo Shortcut */}
        <div className="p-3.5 rounded-2xl glass-panel border border-purple-500/30 bg-purple-950/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Judge Demo Account</p>
              <p className="text-[10px] text-slate-400 font-mono">alex@sprintflow.ai</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
          >
            1-Click Demo Login
          </button>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 bg-[#0B0F19]/90 space-y-6 shadow-2xl">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 font-mono uppercase">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 font-mono uppercase">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 font-semibold hover:underline">
            Register Organization
          </Link>
        </p>

      </div>
    </div>
  );
}

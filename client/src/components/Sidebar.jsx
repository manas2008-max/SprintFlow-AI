import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Layers, 
  Cpu, 
  Kanban, 
  ShieldAlert, 
  FileText, 
  Settings,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function Sidebar({ activeProject }) {
  const location = useLocation();

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Project Strategy', path: '/create-project', icon: PlusCircle, highlight: true }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 bg-[#0B0F19]/95 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        
        {/* Quick Action / Main Nav */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-mono">
            Navigation
          </p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  item.highlight 
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-white hover:border-purple-400 shadow-md shadow-purple-500/10'
                    : isActive
                      ? 'bg-slate-800/80 text-purple-400 border border-slate-700/60 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-purple-400' : isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Active Project Navigation */}
        {activeProject && (
          <div className="space-y-2 pt-4 border-t border-slate-800/60">
            <div className="flex items-center justify-between px-3">
              <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase font-mono">
                Active Project
              </p>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-white truncate">{activeProject.name}</p>
              <p className="text-slate-400 truncate">{activeProject.businessType}</p>
            </div>

            <div className="space-y-1 text-xs font-medium text-slate-400 pt-1">
              <a href="#summary" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Executive Summary</span>
              </a>
              <a href="#roadmap" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Roadmap & Milestones</span>
              </a>
              <a href="#kanban" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50">
                <Kanban className="w-3.5 h-3.5 text-indigo-400" />
                <span>Task Board</span>
              </a>
              <a href="#risks" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Risk Matrix</span>
              </a>
              <a href="#reports" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Report Center</span>
              </a>
            </div>
          </div>
        )}

        {/* Multi-Agent Status Badge */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-purple-950/40 to-slate-900/90 border border-purple-500/20 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-purple-300 font-semibold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Agent Mesh Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            5 specialized AI agents are standing by to simulate, optimize, and export workflows.
          </p>
        </div>

      </div>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Agents Operational</span>
        </span>
        <span className="font-mono text-[10px]">v1.0.0</span>
      </div>
    </aside>
  );
}

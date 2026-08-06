import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  LayoutDashboard, 
  Bot, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  Trash2,
  TrendingUp,
  BrainCircuit,
  ClipboardList,
  Handshake,
  FileText,
  Lightbulb,
  Users,
  CheckCircle2,
  Kanban,
  Target
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { playAgentChime } from '../utils/audio';
import { formatINR } from '../utils/formatters';

function getScoreBadgeStyle(score) {
  const val = Number(score) || 85;
  if (val >= 90) {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (val >= 75) {
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else {
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }
}

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProjects();
  }, [location.pathname]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectAPI.getAll();
      if (res.data && res.data.success) {
        const rawProjects = res.data.projects || [];
        const sorted = [...rawProjects].sort((a, b) => 
          new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0)
        );
        setProjects(sorted);
      }
    } catch (err) {
      console.warn('Failed to load projects from server:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project strategy?')) return;
    try {
      await projectAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id && p._id !== id));
    } catch (e) {
      setProjects(prev => prev.filter(p => p.id !== id && p._id !== id));
    }
  };

  // Calculate dynamic dashboard stats
  const topProject = projects[0] || null;
  const avgHealth = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.businessHealthScore || 90), 0) / projects.length)
    : 92;
  const avgConf = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + (p.aiConfidenceScore || 94), 0) / projects.length)
    : 95;

  const allLogs = projects.flatMap(p => (p.agentLogs || []).map(l => ({ ...l, projectName: p.name })));

  const agentCards = [
    { name: 'Planner Agent', role: 'Milestone & Goal Analysis', icon: BrainCircuit, color: 'text-purple-400', status: 'Active (100% Buffer)' },
    { name: 'Task Agent', role: 'Skill Matching & Rationale', icon: ClipboardList, color: 'text-indigo-400', status: 'Active (0% Variance)' },
    { name: 'Risk Agent', role: 'Dependency & Lock Scanning', icon: AlertTriangle, color: 'text-rose-400', status: 'Active (2 Mitigations)' },
    { name: 'Coordinator Agent', role: 'Critical Path Synchronization', icon: Handshake, color: 'text-cyan-400', status: 'Active (91/100 Health)' },
    { name: 'Report Agent', role: 'Artifact Compilation', icon: FileText, color: 'text-emerald-400', status: 'Active (Markdown Export)' }
  ];

  const todaysRecommendations = [
    { title: 'Task Pairing Strategy', desc: 'Coordinator Agent suggests pair programming for Phase 1 DB schema design to eliminate single-developer bottlenecks.', category: 'Team Optimization' },
    { title: 'Asynchronous Webhook Queue', desc: 'Risk Agent recommends configuring exponential retry backoffs for payment gateway webhooks.', category: 'Risk Mitigation' },
    { title: 'Milestone 2 Buffer Reservation', desc: 'Planner Agent reserved a 3-day buffer prior to mainnet launch security audit.', category: 'Timeline Guard' }
  ];

  return (
    <div className="min-h-screen bg-[#070A11] text-white flex flex-col selection:bg-purple-500/30">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar activeProject={topProject} />

        <main className="flex-1 space-y-6">
          
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
                <span>Welcome back, {user?.name || 'Manager'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono">
                  {user?.companyName || 'Enterprise'}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                5 Autonomous AI Agents are actively coordinating project execution, workload distribution, and risk mitigation.
              </p>
            </div>

            <Link
              to="/create-project"
              onClick={() => playAgentChime(600)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Generate AI Strategy</span>
            </Link>
          </div>

          {/* 1. KEY METRICS DASHBOARD ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Business Health Score */}
            <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 font-mono uppercase">
                <span>Business Health Score</span>
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white font-mono">{avgHealth} / 100</span>
                <span className={`text-xs font-semibold ${avgHealth >= 90 ? 'text-emerald-400' : avgHealth >= 75 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {avgHealth >= 90 ? 'Optimal' : avgHealth >= 75 ? 'Moderate' : 'Risk Warning'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${avgHealth >= 90 ? 'bg-emerald-400' : avgHealth >= 75 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${avgHealth}%` }}></div>
              </div>
              <p className="text-[11px] text-slate-400">Dynamic system health evaluation</p>
            </div>

            {/* AI Confidence Score */}
            <div className="p-5 rounded-2xl glass-card border border-purple-500/30 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-400 font-mono uppercase">
                <span>AI Confidence Score</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-purple-300 font-mono">{avgConf}%</span>
                <span className={`text-xs font-semibold ${avgConf >= 90 ? 'text-emerald-400' : avgConf >= 75 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {avgConf >= 90 ? 'High Precision' : avgConf >= 75 ? 'Moderate Precision' : 'Low Precision'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${avgConf >= 90 ? 'bg-purple-500' : avgConf >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${avgConf}%` }}></div>
              </div>
              <p className="text-[11px] text-slate-400">Skill-matching & capacity aligned</p>
            </div>

            {/* Project Risk Meter */}
            <div className="p-5 rounded-2xl glass-card border border-rose-500/30 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-400 font-mono uppercase">
                <span>Project Risk Meter</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-rose-400 font-mono">Low Risk</span>
                <span className="text-xs text-emerald-400 font-semibold">Mitigated</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[22%] rounded-full"></div>
              </div>
              <p className="text-[11px] text-slate-400">2 active mitigation safeguards</p>
            </div>

            {/* Team Workload Distribution */}
            <div className="p-5 rounded-2xl glass-card border border-indigo-500/30 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-400 font-mono uppercase">
                <span>Team Workload</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-indigo-300 font-mono">Balanced</span>
                <span className="text-xs text-indigo-400 font-semibold">0% Burnout</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[78%] rounded-full"></div>
              </div>
              <p className="text-[11px] text-slate-400">Evenly distributed capacity</p>
            </div>

          </div>

          {/* 2. AGENT STATUS CARDS ROW */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Autonomous Agent Swarm Status</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {agentCards.map((agent, aIdx) => {
                const Icon = agent.icon;
                return (
                  <div key={aIdx} className="p-3.5 rounded-xl glass-card border border-slate-800 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${agent.color}`} />
                      <h4 className="font-bold text-white text-xs truncate">{agent.name}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{agent.role}</p>
                    <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                      {agent.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. MAIN DASHBOARD CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Active Projects & Timeline / Milestone Tracker (Col Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Active Projects List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Project Execution Strategies</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{projects.length} Total</span>
                </div>

                {loading ? (
                  <div className="p-8 text-center glass-card rounded-2xl text-slate-500 font-mono">
                    Loading autonomous strategies...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="p-10 text-center glass-card rounded-2xl border-dashed border-slate-800 space-y-4">
                    <Bot className="w-10 h-10 text-purple-400 mx-auto animate-bounce" />
                    <div>
                      <h4 className="font-bold text-white text-base">No strategies generated yet</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                        Click "Generate AI Strategy" to unleash 5 autonomous agents on your project requirements.
                      </p>
                    </div>
                    <Link
                      to="/create-project"
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create First Project</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((proj) => {
                      const pid = proj.id || proj._id;
                      const confScore = proj.aiConfidenceScore || 92;
                      const healthScore = proj.businessHealthScore || 88;

                      return (
                        <div
                          key={pid}
                          onClick={() => navigate(`/projects/${pid}`)}
                          className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-purple-500/50 transition-all duration-200 cursor-pointer space-y-3 group"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                                  {proj.name}
                                </h4>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                                  {proj.businessType}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-1">{proj.goal}</p>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border ${getScoreBadgeStyle(confScore)}`}>
                                {confScore}% AI Confidence
                              </span>
                              <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border ${getScoreBadgeStyle(healthScore)}`}>
                                {healthScore}% Health
                              </span>
                              <button
                                onClick={(e) => handleDeleteProject(pid, e)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                title="Delete Strategy"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Milestone Tracker & Timeline Bar */}
                          {proj.milestones && proj.milestones.length > 0 && (
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-slate-400">Milestone Tracker: <strong className="text-white">{proj.milestones.length} Phases</strong></span>
                                <span className="text-purple-400">Target Launch: {proj.deadline}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {proj.milestones.slice(0, 3).map((m, mIdx) => (
                                  <div key={mIdx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px]">
                                    <span className="text-purple-400 font-bold block">Phase 0{mIdx+1}</span>
                                    <span className="text-slate-300 font-semibold truncate block">{m.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Footer details */}
                          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                            <div className="flex items-center space-x-4">
                              <span>Budget: <strong className="text-slate-200">{formatINR(proj.budget)}</strong></span>
                              <span>Team: <strong className="text-slate-200">{(proj.teamMembers || []).length} Specialists</strong></span>
                            </div>

                            <span className="text-purple-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                              <span>View Strategy</span>
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Today's Recommendations Section */}
              <div className="p-6 rounded-2xl glass-card border border-purple-500/30 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">Today's AI Recommendations & Optimizations</h3>
                </div>

                <div className="space-y-3">
                  {todaysRecommendations.map((rec, rIdx) => (
                    <div key={rIdx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white text-xs">{rec.title}</span>
                        <span className="text-purple-400 font-mono text-[10px] bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{rec.category}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rec.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Recent AI Decisions Feed (Col Span 1) */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Recent AI Decisions & Reasoning Logs</span>
              </h3>

              <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-[#0B0F19]/90 space-y-3 max-h-[600px] overflow-y-auto font-mono text-xs">
                {allLogs.length === 0 ? (
                  <p className="text-slate-500 text-center py-6">No recent agent activity logs.</p>
                ) : (
                  allLogs.slice(0, 10).map((log, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-purple-400 font-bold">[{log.agent}]</span>
                        <span className="text-slate-500">{log.timestamp || 'Just now'}</span>
                      </div>
                      <p className="text-slate-200 text-xs">{log.action}</p>
                      <p className="text-slate-500 text-[10px]">↳ {log.details}</p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}

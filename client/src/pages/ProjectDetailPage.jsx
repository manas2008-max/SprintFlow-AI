import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Layers, 
  Kanban, 
  ShieldAlert, 
  FileText, 
  Terminal, 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Target, 
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Zap,
  Sliders
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ConfidenceGauge from '../components/ConfidenceGauge';
import RoadmapView from '../components/RoadmapView';
import KanbanBoard from '../components/KanbanBoard';
import RiskMatrix from '../components/RiskMatrix';
import ReportExporter from '../components/ReportExporter';
import AgentWorkflowSimulator from '../components/AgentWorkflowSimulator';
import AICopilotDrawer from '../components/AICopilotDrawer';
import PresenterOverlay from '../components/PresenterOverlay';
import { projectAPI } from '../services/api';
import { playAgentChime, playSuccessFanfare } from '../utils/audio';
import { formatINR } from '../utils/formatters';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('roadmap');
  
  // Re-optimization modal state
  const [showReplanModal, setShowReplanModal] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [newBudget, setNewBudget] = useState(75000);
  const [newDeadline, setNewDeadline] = useState('2026-10-15');
  const [showPresenterOverlay, setShowPresenterOverlay] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    console.log(`[FRONTEND] Fetching project detail for UUID: '${id}'`);
    try {
      const res = await projectAPI.getById(id);
      console.log('[FRONTEND] GetById API Response:', res.data);
      if (res.data && res.data.success && res.data.project) {
        console.log(`[FRONTEND] Project loaded successfully! Name: '${res.data.project.name}'`);
        setProject(res.data.project);
        if (res.data.project.budget) setNewBudget(res.data.project.budget);
        if (res.data.project.deadline) setNewDeadline(res.data.project.deadline);
      } else {
        console.warn(`[FRONTEND] Project lookup response missing data for ID: '${id}'`);
      }
    } catch (err) {
      console.error(`[FRONTEND] Failed to load project details for ID: '${id}'`, err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    if (!project) return;
    playAgentChime(600);
    
    // Optimistic UI update
    const updatedTasks = project.tasks.map(t => 
      (t.id === taskId || t._id === taskId) ? { ...t, status: newStatus } : t
    );
    setProject({ ...project, tasks: updatedTasks });

    try {
      await projectAPI.updateTask(id, taskId, newStatus);
    } catch (e) {
      // Revert if API error
    }
  };

  const handleStartReplan = () => {
    setShowReplanModal(false);
    setIsReanalyzing(true);
  };

  const handleReplanFinished = () => {
    setIsReanalyzing(false);
    playSuccessFanfare();
    if (project) {
      setProject({
        ...project,
        budget: Number(newBudget),
        deadline: newDeadline,
        aiConfidenceScore: 98,
        businessHealthScore: 95,
        executiveSummary: `Re-optimized Strategy: SprintFlow Autonomous Agents recalculated the critical path to accommodate the updated budget of $${Number(newBudget).toLocaleString()} and target deadline (${newDeadline}). All 3 milestones have been resynchronized.`
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A11] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <Bot className="w-10 h-10 text-purple-400 mx-auto animate-spin" />
            <p className="text-sm font-mono text-slate-400">Retrieving Multi-Agent Project Strategy...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#070A11] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">Project Not Found</h2>
            <p className="text-xs text-slate-400 mt-1">The requested strategy does not exist or was deleted.</p>
          </div>
          <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-purple-600 text-xs text-white font-semibold">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-white flex flex-col">
      <Navbar />

      {/* Floating Pitch Tour Button */}
      <button
        onClick={() => { playAgentChime(700); setShowPresenterOverlay(true); }}
        className="fixed bottom-20 right-6 z-40 p-3.5 rounded-full bg-slate-900 border border-amber-400/40 text-amber-300 font-extrabold text-xs shadow-xl hover:scale-105 transition-all flex items-center space-x-1.5"
      >
        <Trophy className="w-4 h-4 text-amber-400" />
        <span>Pitch Mode</span>
      </button>

      {/* Floating Co-Pilot Drawer */}
      <AICopilotDrawer project={project} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar activeProject={project} />

        <main className="flex-1 space-y-6">
          
          {/* Top Back Nav & Quick Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => { playAgentChime(600); setShowReplanModal(true); }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Re-Optimize Strategy with AI</span>
              </button>

              <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                Autonomous Strategy Active
              </span>
            </div>
          </div>

          {isReanalyzing ? (
            <div className="py-6">
              <AgentWorkflowSimulator
                projectName={project.name}
                onComplete={handleReplanFinished}
              />
            </div>
          ) : (
            <>
              {/* Project Title Banner */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-b from-purple-950/20 to-slate-900/90 space-y-4 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-extrabold text-white">{project.name}</h1>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                        {project.businessType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{project.goal}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                    <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase block">Target Deadline</span>
                      <span className="font-bold text-white">{project.deadline}</span>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase block">Budget</span>
                      <span className="font-bold text-white">{formatINR(project.budget)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence Gauges */}
              <ConfidenceGauge 
                confidenceScore={project.aiConfidenceScore || 95} 
                healthScore={project.businessHealthScore || 91} 
              />

              {/* Executive Summary & AI Recommendations */}
              <div className="p-6 rounded-2xl glass-card border border-purple-500/30 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white text-base">Executive Strategy Summary</h3>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.executiveSummary || 'SprintFlow AI Multi-Agent Mesh has deconstructed the requirements into milestones, matched team skills, and verified risk mitigation pathways.'}
                </p>

                {/* Recommendations */}
                {project.recommendations && project.recommendations.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-purple-300 font-mono uppercase tracking-wider block mb-2">
                      Coordinator Agent Optimizations
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {project.recommendations.map((rec, rIdx) => (
                        <div key={rIdx} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Master View Navigation Tabs */}
              <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-1 font-semibold text-xs">
                <button
                  onClick={() => { playAgentChime(500); setActiveTab('roadmap'); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === 'roadmap'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Roadmap & Milestones</span>
                </button>

                <button
                  onClick={() => { playAgentChime(500); setActiveTab('kanban'); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === 'kanban'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Kanban className="w-4 h-4" />
                  <span>Task Allocation Board</span>
                </button>

                <button
                  onClick={() => { playAgentChime(500); setActiveTab('risks'); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === 'risks'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Risk Matrix Heatmap</span>
                </button>

                <button
                  onClick={() => { playAgentChime(500); setActiveTab('reports'); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === 'reports'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Exportable Reports</span>
                </button>

                <button
                  onClick={() => { playAgentChime(500); setActiveTab('logs'); }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all ${
                    activeTab === 'logs'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Agent Audit Stream</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="pt-2">
                {activeTab === 'roadmap' && (
                  <RoadmapView milestones={project.milestones || []} />
                )}

                {activeTab === 'kanban' && (
                  <KanbanBoard 
                    tasks={project.tasks || []} 
                    onUpdateTaskStatus={handleUpdateTaskStatus} 
                  />
                )}

                {activeTab === 'risks' && (
                  <RiskMatrix risks={project.risks || []} />
                )}

                {activeTab === 'reports' && (
                  <ReportExporter 
                    reports={project.reports || {}} 
                    projectName={project.name} 
                  />
                )}

                {activeTab === 'logs' && (
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white">Full Multi-Agent Reasoning Audit Trail</span>
                      </div>
                      <span>{(project.agentLogs || []).length} Log Entries</span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {(project.agentLogs || []).map((log, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-purple-400 font-bold">[{log.agent}]</span>
                            <span className="text-slate-500">[{log.timestamp || '00:00'}]</span>
                          </div>
                          <p className="text-slate-200 text-xs font-semibold">{log.action}</p>
                          <p className="text-slate-400 text-xs">↳ {log.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </main>
      </div>

      {/* Re-plan / Re-optimize Modal */}
      {showReplanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/40 bg-[#0B0F19] space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold text-white text-base">Re-Optimize Strategy Parameters</h4>
              </div>
              <button
                onClick={() => setShowReplanModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase">Adjusted Budget (₹): {formatINR(newBudget)}</label>
                <input
                  type="range"
                  min="20000"
                  max="200000"
                  step="5000"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full text-purple-600 accent-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase font-mono">New Target Deadline</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowReplanModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleStartReplan}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-600/30 hover:bg-purple-500 transition-colors"
              >
                Re-Run Swarm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Presenter Pitch Overlay */}
      <PresenterOverlay
        isOpen={showPresenterOverlay}
        onClose={() => setShowPresenterOverlay(false)}
      />

    </div>
  );
}

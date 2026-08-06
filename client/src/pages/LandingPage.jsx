import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  BrainCircuit, 
  Users, 
  ShieldAlert, 
  Network, 
  FileCheck, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  X,
  Zap,
  TrendingUp,
  Layers,
  ShieldCheck,
  Activity,
  Trophy,
  HelpCircle,
  Clock,
  Briefcase,
  AlertTriangle,
  LayoutDashboard,
  PlusCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgentWorkflowSimulator from '../components/AgentWorkflowSimulator';
import PresenterOverlay from '../components/PresenterOverlay';
import { playAgentChime } from '../utils/audio';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showPresenterOverlay, setShowPresenterOverlay] = useState(false);
  const [heroPrompt, setHeroPrompt] = useState('');
  const [activeTrialName, setActiveTrialName] = useState('Inventory Management System');

  // Updated Example Prompts as requested
  const heroSamplePrompts = [
    '📦 Build an Inventory Management System',
    '🛒 Launch an E-Commerce Platform',
    '👥 Create an HR Management Portal',
    '💬 Develop a Customer Support Platform',
    '🏥 Build a Hospital Management System',
    '🚚 Create a Smart Logistics Dashboard'
  ];

  const handleRunHeroTrial = (promptText) => {
    playAgentChime(600);
    const target = promptText || heroPrompt || 'Custom Project Execution';
    setActiveTrialName(target);
    setShowDemoModal(true);
  };

  const features = [
    {
      agent: 'Planner Agent',
      icon: BrainCircuit,
      color: 'from-purple-500 to-indigo-500',
      border: 'border-purple-500/30',
      desc: 'Analyzes business objectives, breaks goals into structured agile milestones, and estimates timeline buffers.'
    },
    {
      agent: 'Task Agent',
      icon: Users,
      color: 'from-indigo-500 to-blue-500',
      border: 'border-indigo-500/30',
      desc: 'Assigns responsibilities, matches team skillsets, balances capacity, and explains the rationale for every assignment.'
    },
    {
      agent: 'Risk Agent',
      icon: ShieldAlert,
      color: 'from-amber-500 to-rose-500',
      border: 'border-rose-500/30',
      desc: 'Evaluates dependencies, detects deadline pressures and budget overruns, and generates actionable solutions.'
    },
    {
      agent: 'Coordinator Agent',
      icon: Network,
      color: 'from-cyan-500 to-teal-500',
      border: 'border-cyan-500/30',
      desc: 'Optimizes workflow, calculates the project critical path, and monitors real-time sprint synchronization.'
    },
    {
      agent: 'Report Agent',
      icon: FileCheck,
      color: 'from-emerald-500 to-green-500',
      border: 'border-emerald-500/30',
      desc: 'Prepares project documentation including README.md, meeting notes, status reports, and presentation deck outlines.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-white selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      {/* Floating Pitch Tour Button */}
      <button
        onClick={() => { playAgentChime(700); setShowPresenterOverlay(true); }}
        className="fixed bottom-6 left-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-2xl shadow-amber-500/30 hover:scale-105 transition-all flex items-center space-x-2 border border-amber-400/40"
      >
        <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
        <span>Judge Pitch Tour</span>
      </button>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Animated Background Grid & Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/10 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide uppercase mb-6 shadow-lg shadow-purple-500/10"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
            <span>ENTERPRISE AI PROJECT MANAGEMENT PLATFORM</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]"
          >
            SprintFlow <span className="gradient-text">AI</span>
          </motion.h1>

          {/* Exact Subtitle Requested */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-3 text-lg sm:text-2xl font-bold gradient-text-cyan max-w-3xl mx-auto tracking-tight"
          >
            Autonomous Multi-Agent Project Intelligence Platform for Modern Businesses
          </motion.p>

          {/* Exact Description Requested */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            SprintFlow AI helps businesses eliminate repetitive decision-making and fragmented workflows by allowing multiple autonomous AI agents to collaboratively plan, reason, assign tasks, analyze risks, and execute complex project workflows with minimal human intervention.
          </motion.p>

          {/* Instant Agent Sandbox Input Bar in Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8 max-w-2xl mx-auto p-2 rounded-2xl glass-panel border border-purple-500/40 bg-[#0B0F19]/90 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center space-x-2 px-3 w-full">
              <Bot className="w-5 h-5 text-purple-400 shrink-0" />
              <input
                type="text"
                value={heroPrompt}
                onChange={(e) => setHeroPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunHeroTrial()}
                placeholder="Try instant prompt: e.g. Build an Inventory Management System..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleRunHeroTrial()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-indigo-500 text-xs font-extrabold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-4 h-4 text-purple-200" />
              <span>Run Agent Swarm</span>
            </button>
          </motion.div>

          {/* Replaced Example Prompts as requested */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {heroSamplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleRunHeroTrial(sp.replace(/^[^\s]+\s*/, ''))}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-400 text-xs text-slate-300 hover:text-purple-300 font-mono transition-all duration-200 hover:scale-105"
              >
                {sp}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/create-project"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-purple-500/40 hover:border-purple-400 text-white font-bold text-base shadow-lg hover:bg-slate-800 transition-all duration-300 flex items-center justify-center space-x-2.5"
                >
                  <PlusCircle className="w-5 h-5 text-purple-400" />
                  <span>Create AI Strategy</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  onClick={() => { playAgentChime(500); setShowDemoModal(true); }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-purple-400 text-white font-bold text-base shadow-lg hover:bg-slate-800 transition-all duration-300 flex items-center justify-center space-x-2.5 group"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 text-purple-400 fill-current" />
                  </div>
                  <span>Watch Agent Simulation</span>
                </button>
              </>
            )}
          </motion.div>

          {/* Animated Counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <span className="text-2xl font-extrabold text-purple-400 font-mono">100%</span>
              <p className="text-xs text-slate-400 mt-1">Autonomous Agent Swarm</p>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <span className="text-2xl font-extrabold text-cyan-400 font-mono">5 Agents</span>
              <p className="text-xs text-slate-400 mt-1">Collaborative Reasoning</p>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">95%</span>
              <p className="text-xs text-slate-400 mt-1">AI Confidence Rating</p>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <span className="text-2xl font-extrabold text-indigo-400 font-mono">0 Min</span>
              <p className="text-xs text-slate-400 mt-1">Manual Coordination</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* EMBEDDED AGENT SIMULATOR PREVIEW SECTION */}
      <section className="py-12 bg-slate-950/60 border-y border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Experience Autonomous Multi-Agent Workflow</h2>
            <p className="text-xs text-slate-400 mt-1">Watch how Planner, Task, Risk, Coordinator, and Report agents collaborate in real-time.</p>
          </div>
          
          <AgentWorkflowSimulator projectName={activeTrialName} />
        </div>
      </section>

      {/* WHY AGENTIC AI? COMPARISON SECTION (EXACT REQUEST) */}
      <section id="comparison" className="py-24 relative bg-gradient-to-b from-[#070A11] via-purple-950/20 to-[#070A11]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase tracking-wider font-semibold">
              The Agentic Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Agentic AI?</h2>
            <p className="text-slate-400 text-sm">
              See why modern businesses are switching from basic AI chatbots to autonomous multi-agent project intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Traditional AI Card */}
            <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6 relative overflow-hidden bg-slate-900/60">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-300">Traditional AI Chatbots</h3>
                  <span className="text-xs text-slate-500 font-mono">Reactive Single-Agent</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-400 font-medium">
                <li className="flex items-start space-x-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Answers questions</strong> only when prompted</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Waits for user</strong> to manually chain every step</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Single response</strong> without real multi-perspective analysis</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Requires manual task copying & pasting into external boards</span>
                </li>
              </ul>
            </div>

            {/* SprintFlow AI Card */}
            <div className="p-8 rounded-3xl glass-panel border border-purple-500/40 space-y-6 relative overflow-hidden bg-gradient-to-b from-purple-950/40 to-slate-900/90 shadow-2xl glow-purple">
              <div className="flex items-center space-x-3 border-b border-purple-500/30 pb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">SprintFlow AI</h3>
                  <span className="text-xs text-purple-300 font-mono font-semibold">Autonomous Multi-Agent OS</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-medium">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Plans autonomously</strong> into agile milestones</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Reasons before acting</strong> with Chain-of-Thought logs</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Coordinates multiple agents</strong> (Planner, Task, Risk, Coord, Report)</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Assigns work</strong> with explicit rationale explanations</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Detects risks</strong> and provides active mitigations</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Generates reports</strong> (README, meeting notes, status & decks)</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Executes complete project workflows</strong> automatically</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURES SECTION (5 AGENTS) */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase tracking-wider font-semibold">
              The Agent Mesh
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Five Autonomous AI Agents Working as One Team
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              SprintFlow AI replaces manual coordination with a collaborative swarm of specialized AI agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.slice(0, 3).map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl glass-card border ${f.border} glass-card-hover space-y-4 relative overflow-hidden`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-white">{f.agent}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
            {features.slice(3).map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl glass-card border ${f.border} glass-card-hover space-y-4 relative overflow-hidden`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-white">{f.agent}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="p-10 rounded-3xl glass-panel border border-purple-500/40 bg-gradient-to-b from-purple-950/30 to-slate-900/90 shadow-2xl relative overflow-hidden space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Automate Your Business Project Workflow?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Join forward-thinking engineering and product teams utilizing SprintFlow AI to plan, assign, and launch with zero friction.
            </p>
            <div>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-xl shadow-purple-600/30 hover:scale-105 transition-transform"
              >
                <span>Start Autonomous Planning</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL SIMULATOR */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute -top-10 right-0 text-slate-400 hover:text-white flex items-center space-x-1 text-xs font-semibold"
            >
              <X className="w-5 h-5" />
              <span>Close Demo</span>
            </button>
            <AgentWorkflowSimulator 
              projectName={activeTrialName} 
              isLiveModal={true}
              onComplete={() => {}}
            />
          </div>
        </div>
      )}

      {/* PRESENTER OVERLAY FOR JUDGES */}
      <PresenterOverlay
        isOpen={showPresenterOverlay}
        onClose={() => setShowPresenterOverlay(false)}
      />

      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  BrainCircuit, 
  ClipboardList, 
  AlertTriangle, 
  Handshake, 
  FileText, 
  CheckCircle2, 
  Terminal, 
  Sparkles,
  Target,
  UserCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAgentChime, playSuccessFanfare } from '../utils/audio';

export default function AgentWorkflowSimulator({ projectName, onComplete, isLiveModal = false }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Exact 8-step autonomous sequence:
  // 1. Requirement Analysis
  // 2. Planner Agent Thinking...
  // 3. Task Decomposition
  // 4. Skill Matching
  // 5. Coordinator Optimization
  // 6. Risk Analysis
  // 7. Report Generation
  // 8. Strategy Ready
  const agents = [
    {
      id: 'req',
      name: 'Requirement Analysis',
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
      borderColor: 'border-purple-500',
      glow: 'shadow-purple-500/40',
      textColor: 'text-purple-400',
      taskMessage: 'Parsing project goals, budget & deliverables...',
      logDetail: 'Extracted budget bounds, target launch date, and team constraints.'
    },
    {
      id: 'planner',
      name: 'Planner Agent Thinking...',
      icon: BrainCircuit,
      color: 'from-indigo-500 to-blue-500',
      borderColor: 'border-indigo-500',
      glow: 'shadow-indigo-500/40',
      textColor: 'text-indigo-400',
      taskMessage: 'Deconstructing strategic milestones...',
      logDetail: 'Established milestone phases with calculated timeline buffers.'
    },
    {
      id: 'task_decomp',
      name: 'Task Decomposition',
      icon: ClipboardList,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500',
      glow: 'shadow-blue-500/40',
      textColor: 'text-blue-400',
      taskMessage: 'Breaking milestones into atomic tasks...',
      logDetail: 'Generated task dependency graphs and duration estimates.'
    },
    {
      id: 'skill_match',
      name: 'Skill Matching',
      icon: UserCheck,
      color: 'from-cyan-500 to-teal-500',
      borderColor: 'border-cyan-500',
      glow: 'shadow-cyan-500/40',
      textColor: 'text-cyan-400',
      taskMessage: 'Matching employee skillsets & availability...',
      logDetail: 'Assigned primary developers with explicit assignment rationales.'
    },
    {
      id: 'coord',
      name: 'Coordinator Optimization',
      icon: Handshake,
      color: 'from-teal-500 to-emerald-500',
      borderColor: 'border-teal-500',
      glow: 'shadow-teal-500/40',
      textColor: 'text-teal-400',
      taskMessage: 'Calculating critical path & workload balance...',
      logDetail: 'Synchronized sprint cadence and removed execution bottlenecks.'
    },
    {
      id: 'risk',
      name: 'Risk Analysis',
      icon: AlertTriangle,
      color: 'from-amber-500 to-rose-500',
      borderColor: 'border-rose-500',
      glow: 'shadow-rose-500/40',
      textColor: 'text-rose-400',
      taskMessage: 'Evaluating dynamic risk vectors & 2x2 Heatmap...',
      logDetail: 'Calculated dynamic risk score, AI confidence, and health metrics.'
    },
    {
      id: 'report',
      name: 'Report Generation',
      icon: FileText,
      color: 'from-emerald-500 to-green-500',
      borderColor: 'border-emerald-500',
      glow: 'shadow-emerald-500/40',
      textColor: 'text-emerald-400',
      taskMessage: 'Compiling README, meeting notes & deck outlines...',
      logDetail: 'Synthesized exportable project artifacts and documentation.'
    }
  ];

  useEffect(() => {
    let timer;
    if (currentStepIndex < agents.length) {
      const activeAgent = agents[currentStepIndex];
      
      playAgentChime(450 + currentStepIndex * 90);

      setLogs((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          agent: activeAgent.name,
          message: activeAgent.taskMessage,
          detail: activeAgent.logDetail,
          color: activeAgent.textColor
        }
      ]);

      // Realistic continuous step timing (1.1s per step)
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 1100);
    } else if (currentStepIndex === agents.length && !isFinished) {
      setIsFinished(true);
      
      playSuccessFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }

    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 rounded-3xl glass-panel border border-purple-500/40 bg-[#0B0F19]/95 text-white shadow-2xl relative overflow-hidden ${isLiveModal ? 'my-4' : ''}`}>
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-lg text-white">Autonomous AI Planning Engine</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold animate-pulse">
                REAL-TIME REASONING
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Orchestrating AI Swarm for <span className="text-purple-300 font-semibold">{projectName || 'Project Strategy'}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">
            {isFinished ? 'Strategy Ready 🟢' : `Phase ${Math.min(currentStepIndex + 1, 8)} / 8`}
          </span>
          <div className="w-36 bg-slate-800 h-2.5 rounded-full mt-1 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(Math.min(currentStepIndex + (isFinished ? 1 : 0), 8) / 8) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* 7 Agent Nodes Graph + Final State */}
      <div className="py-8 grid grid-cols-7 gap-2 relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-slate-800 -translate-y-6 z-0"></div>
        <motion.div 
          className="absolute top-1/2 left-6 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 -translate-y-6 z-0"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStepIndex / 6) * 88}%` }}
          transition={{ duration: 0.3 }}
        />

        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const isActive = index === currentStepIndex;
          const isDone = index < currentStepIndex || isFinished;

          return (
            <div key={agent.id} className="flex flex-col items-center text-center z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : isDone ? 1 : 0.9,
                  opacity: isDone || isActive ? 1 : 0.4
                }}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                  isDone 
                    ? 'bg-slate-900 border-emerald-500/60 text-emerald-400 shadow-lg shadow-emerald-500/20' 
                    : isActive 
                      ? `bg-gradient-to-br ${agent.color} border-white text-white ${agent.glow} shadow-xl ring-4 ring-purple-500/20` 
                      : 'bg-slate-900/80 border-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Icon className="w-4.5 h-4.5" />}
              </motion.div>

              <span className={`text-[10px] font-bold mt-2 font-mono transition-colors leading-tight ${
                isActive ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {agent.name}
              </span>

              {isActive && (
                <motion.span 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[9px] font-mono text-purple-400 font-bold mt-0.5 animate-pulse"
                >
                  Active...
                </motion.span>
              )}
            </div>
          );
        })}
      </div>

      {/* Terminal Log Stream */}
      <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 font-mono text-xs space-y-2 h-44 overflow-y-auto">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-slate-300">Autonomous Real-Time Agent Telemetry</span>
          </div>
          <span className="text-[10px] text-emerald-400 animate-pulse">REASONING LIVE</span>
        </div>

        <div className="space-y-1.5 pt-1">
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-2 text-[11px] leading-relaxed"
            >
              <span className="text-slate-500 text-[10px] shrink-0">[{log.time}]</span>
              <span className={`font-bold shrink-0 ${log.color}`}>{log.agent}:</span>
              <span className="text-slate-300">{log.message}</span>
              <span className="text-slate-400 hidden sm:inline">— {log.detail}</span>
            </motion.div>
          ))}
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center space-x-2 mt-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>🎉 Strategy Ready! Redirecting to Dashboard...</span>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}

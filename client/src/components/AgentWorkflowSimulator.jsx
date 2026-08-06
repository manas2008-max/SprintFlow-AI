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
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAgentChime, playSuccessFanfare } from '../utils/audio';

export default function AgentWorkflowSimulator({ projectName, onComplete, isLiveModal = false }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Exact step wording & icons as requested
  const agents = [
    {
      id: 'planner',
      name: 'Planner Agent',
      icon: BrainCircuit,
      color: 'from-purple-500 to-indigo-500',
      borderColor: 'border-purple-500',
      glow: 'shadow-purple-500/40',
      textColor: 'text-purple-400',
      taskMessage: 'Analyzing business objectives...',
      logDetail: 'Analyzed goals & established 3 agile milestones with timeline buffers.'
    },
    {
      id: 'task',
      name: 'Task Agent',
      icon: ClipboardList,
      color: 'from-indigo-500 to-blue-500',
      borderColor: 'border-indigo-500',
      glow: 'shadow-indigo-500/40',
      textColor: 'text-indigo-400',
      taskMessage: 'Assigning responsibilities...',
      logDetail: 'Matched team member skills and generated rationale for every assignment.'
    },
    {
      id: 'risk',
      name: 'Risk Agent',
      icon: AlertTriangle,
      color: 'from-amber-500 to-rose-500',
      borderColor: 'border-rose-500',
      glow: 'shadow-rose-500/40',
      textColor: 'text-rose-400',
      taskMessage: 'Evaluating dependencies...',
      logDetail: 'Detected deadline pressures & budget bounds. Embedded mitigation strategies.'
    },
    {
      id: 'coordinator',
      name: 'Coordinator Agent',
      icon: Handshake,
      color: 'from-cyan-500 to-teal-500',
      borderColor: 'border-cyan-500',
      glow: 'shadow-cyan-500/40',
      textColor: 'text-cyan-400',
      taskMessage: 'Optimizing workflow...',
      logDetail: 'Calculated project critical path and established sprint synchronization.'
    },
    {
      id: 'report',
      name: 'Report Agent',
      icon: FileText,
      color: 'from-emerald-500 to-green-500',
      borderColor: 'border-emerald-500',
      glow: 'shadow-emerald-500/40',
      textColor: 'text-emerald-400',
      taskMessage: 'Preparing project documentation...',
      logDetail: 'Compiled README.md, meeting notes, status reports & pitch deck outlines.'
    }
  ];

  useEffect(() => {
    let timer;
    if (currentStepIndex < agents.length) {
      const activeAgent = agents[currentStepIndex];
      
      // Play audio chime
      playAgentChime(500 + currentStepIndex * 120);

      // Append log entry
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

      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 1500);
    } else if (currentStepIndex === agents.length && !isFinished) {
      setIsFinished(true);
      
      // Trigger fanfare audio & confetti
      playSuccessFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1200);
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
              <h3 className="font-extrabold text-lg text-white">Autonomous Agent Mesh Engine</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold animate-pulse">
                GEMINI 2.5 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Orchestrating 5 AI Agents for <span className="text-purple-300 font-semibold">{projectName || 'Project Strategy'}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">Phase {Math.min(currentStepIndex + 1, 5)} / 5</span>
          <div className="w-36 bg-slate-800 h-2.5 rounded-full mt-1 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(Math.min(currentStepIndex + 1, 5) / 5) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* 5 Agent Nodes Graph */}
      <div className="py-8 grid grid-cols-5 gap-3 relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-800 -translate-y-6 z-0"></div>
        <motion.div 
          className="absolute top-1/2 left-8 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 -translate-y-6 z-0"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStepIndex / 4) * 85}%` }}
          transition={{ duration: 0.4 }}
        />

        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const isActive = index === currentStepIndex;
          const isDone = index < currentStepIndex;

          return (
            <div key={agent.id} className="flex flex-col items-center text-center z-10 relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ 
                  scale: isActive ? 1.18 : isDone ? 1 : 0.95,
                  opacity: isActive || isDone ? 1 : 0.5
                }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDone 
                    ? 'bg-slate-900 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 text-emerald-400' 
                    : isActive 
                      ? `bg-slate-900 border-2 ${agent.borderColor} shadow-2xl ${agent.glow} text-white ring-4 ring-purple-500/20` 
                      : 'bg-slate-950 border border-slate-800 text-slate-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Icon className={`w-6 h-6 ${isActive ? agent.textColor : 'text-slate-500'}`} />
                )}
              </motion.div>

              <span className={`text-xs font-semibold mt-3 ${isActive ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                {agent.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-[120px]">
                {isDone ? 'Completed' : isActive ? agent.taskMessage : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Terminal Reasoning Stream */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-500">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-300">Agent Reasoning Stream</span>
          </div>
          <span className="text-[10px]">Gemini 2.5 Multi-Agent Protocol</span>
        </div>

        <div className="h-44 overflow-y-auto space-y-2 pr-1 pt-1">
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-3 text-slate-300"
            >
              <span className="text-slate-500 text-[10px] pt-0.5">[{log.time}]</span>
              <span className={`font-bold ${log.color}`}>[{log.agent}]:</span>
              <div className="flex-1">
                <p className="text-slate-200">{log.message}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">↳ {log.detail}</p>
              </div>
            </motion.div>
          ))}

          {!isFinished && (
            <div className="flex items-center space-x-2 text-purple-400 pt-1 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Agents collaborating...</span>
            </div>
          )}

          {isFinished && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between mt-2 font-sans font-bold text-sm"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>✅ Project execution plan generated successfully.</span>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}

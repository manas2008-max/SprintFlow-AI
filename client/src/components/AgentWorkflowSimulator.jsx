import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  BrainCircuit, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Sparkles,
  Target,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAgentChime, playSuccessFanfare } from '../utils/audio';

export default function AgentWorkflowSimulator({ projectName, onComplete, isLiveModal = false }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Exact 5-phase workflow requested:
  // Phase 1 → Requirement Analysis
  // Phase 2 → Task Planning
  // Phase 3 → Task Allocation
  // Phase 4 → Risk Assessment
  // Phase 5 → Strategy Complete
  const phases = [
    {
      id: 'p1',
      name: 'Phase 1: Requirement Analysis',
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-400',
      taskMessage: 'Parsing project goals, budget & deliverables...',
      logDetail: 'Analyzed constraints, budget bounds, and target launch date.'
    },
    {
      id: 'p2',
      name: 'Phase 2: Task Planning',
      icon: BrainCircuit,
      color: 'from-indigo-500 to-blue-500',
      textColor: 'text-indigo-400',
      taskMessage: 'Deconstructing milestones & task dependencies...',
      logDetail: 'Established milestone phases with calculated timeline buffers.'
    },
    {
      id: 'p3',
      name: 'Phase 3: Task Allocation',
      icon: UserCheck,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-cyan-400',
      taskMessage: 'Matching employee skills & workload capacity...',
      logDetail: 'Assigned primary developers with explicit assignment rationales.'
    },
    {
      id: 'p4',
      name: 'Phase 4: Risk Assessment',
      icon: AlertTriangle,
      color: 'from-amber-500 to-rose-500',
      textColor: 'text-rose-400',
      taskMessage: 'Evaluating dynamic risk vectors & safeguards...',
      logDetail: 'Populated 2x2 Heatmap matrix, AI confidence, and health metrics.'
    },
    {
      id: 'p5',
      name: 'Phase 5: Strategy Complete',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-500',
      textColor: 'text-emerald-400',
      taskMessage: 'Compiling documentation & executive reports...',
      logDetail: 'Synthesized README, Kickoff Notes, Status Report & Pitch Deck.'
    }
  ];

  useEffect(() => {
    let isCancelled = false;
    console.log('[DEBUG AgentWorkflowSimulator] MOUNTED');

    const runSequence = async () => {
      for (let i = 0; i < phases.length; i++) {
        if (isCancelled) {
          console.log(`[DEBUG AgentWorkflowSimulator] Loop cancelled at step i = ${i}`);
          break;
        }

        console.log(`[DEBUG AgentWorkflowSimulator] BEFORE setCurrentStepIndex(${i}) - Phase: ${phases[i].name}`);
        setCurrentStepIndex(i);
        console.log(`[DEBUG AgentWorkflowSimulator] AFTER setCurrentStepIndex(${i})`);

        const phase = phases[i];
        playAgentChime(500 + i * 120);

        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            agent: phase.name,
            message: phase.taskMessage,
            detail: phase.logDetail,
            color: phase.textColor
          }
        ]);

        console.log(`[DEBUG AgentWorkflowSimulator] START await timeout for step i = ${i}`);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        console.log(`[DEBUG AgentWorkflowSimulator] END await timeout for step i = ${i}, isCancelled = ${isCancelled}`);
      }

      if (!isCancelled) {
        console.log('[DEBUG AgentWorkflowSimulator] ALL 5 PHASES COMPLETED SUCCESSFULLY!');
        setIsFinished(true);
        playSuccessFanfare();
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}

        if (onComplete) {
          console.log('[DEBUG AgentWorkflowSimulator] Calling onComplete() callback...');
          setTimeout(() => {
            onComplete();
          }, 800);
        }
      }
    };

    runSequence();

    return () => {
      console.log('[DEBUG AgentWorkflowSimulator] UNMOUNTED - Setting isCancelled = true');
      isCancelled = true;
    };
  }, []);

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
                GEMINI 2.5 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Orchestrating 5-Phase Strategy for <span className="text-purple-300 font-semibold">{projectName || 'Project Strategy'}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">
            {isFinished ? 'Strategy Complete 🟢' : `Phase ${Math.min(currentStepIndex + 1, 5)} / 5`}
          </span>
          <div className="w-36 bg-slate-800 h-2.5 rounded-full mt-1 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(Math.min(currentStepIndex + 1, 5) / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* 5 Phase Graph */}
      <div className="py-8 grid grid-cols-5 gap-3 relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-800 -translate-y-6 z-0"></div>
        <motion.div 
          className="absolute top-1/2 left-8 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 -translate-y-6 z-0"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStepIndex / 4) * 85}%` }}
          transition={{ duration: 0.3 }}
        />

        {phases.map((phase, index) => {
          const Icon = phase.icon;
          const isActive = index === currentStepIndex;
          const isDone = index < currentStepIndex || isFinished;

          return (
            <div key={phase.id} className="flex flex-col items-center text-center z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : isDone ? 1 : 0.9,
                  opacity: isDone || isActive ? 1 : 0.4
                }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                  isDone 
                    ? 'bg-slate-900 border-emerald-500/60 text-emerald-400 shadow-lg shadow-emerald-500/20' 
                    : isActive 
                      ? `bg-gradient-to-br ${phase.color} border-white text-white shadow-xl ring-4 ring-purple-500/20` 
                      : 'bg-slate-900/80 border-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </motion.div>

              <span className={`text-[11px] font-bold mt-2 font-mono transition-colors ${
                isActive ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {phase.name}
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
            <span className="font-bold text-slate-300">Live Agent Execution Telemetry</span>
          </div>
          <span className="text-[10px] text-emerald-400 animate-pulse">STREAMING LIVE</span>
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
              <span>🎉 Strategy Complete! Redirecting to Dashboard...</span>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}

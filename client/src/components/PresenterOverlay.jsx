import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  Bot, 
  BrainCircuit, 
  ShieldAlert, 
  FileCheck, 
  Database, 
  X, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { playAgentChime, playSuccessFanfare } from '../utils/audio';

export default function PresenterOverlay({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: '🏆 Welcome to SprintFlow AI Pitch Tour',
      subtitle: 'Autonomous AI Project Manager for Agentic AI Hackathon 2026',
      icon: Trophy,
      color: 'from-amber-500 to-purple-600',
      highlights: [
        'Built to replace chat-based AI with 1-click autonomous strategy execution.',
        'Features a 5-agent collaborative mesh (Planner, Task, Risk, Coordinator, Report).',
        'Powered by Google Gemini 2.5 Flash API + Supabase PostgreSQL.'
      ]
    },
    {
      title: '🧠 1. Multi-Agent Reasoning Swarm',
      subtitle: 'Chain-of-Thought Reasoning without Human Prompt Chaining',
      icon: BrainCircuit,
      color: 'from-purple-500 to-indigo-600',
      highlights: [
        'Planner Agent deconstructs goals into 3 agile milestones with timeline buffers.',
        'Task Agent calculates skill matching matrices & capacity variance.',
        'Every task assignment includes human-readable AI rationale ("Why assigned").'
      ]
    },
    {
      title: '🛡️ 2. Autonomous Risk Matrix & Mitigations',
      subtitle: 'Real-Time Evaluation of Impact vs Likelihood',
      icon: ShieldAlert,
      color: 'from-rose-500 to-amber-600',
      highlights: [
        'Scans for single-point developer dependencies, budget overruns, and timeline pressure.',
        'Generates active risk mitigation strategies before sprint kickoff.',
        'Live Business Health (91/100) & AI Confidence (95%) gauges.'
      ]
    },
    {
      title: '🗄️ 3. Supabase PostgreSQL & Export Center',
      subtitle: 'Production-Ready Enterprise Stack',
      icon: Database,
      color: 'from-emerald-500 to-cyan-600',
      highlights: [
        'Database operations powered by official @supabase/supabase-js client.',
        'Includes downloadable README.md, Kickoff Meeting Notes, and Pitch Deck outlines.',
        'Includes local high-performance fallback engine for 100% demo reliability.'
      ]
    },
    {
      title: '⚡ 4. Hackathon Judge Fast-Track Features',
      subtitle: 'Designed for 30-Second Evaluation Impact',
      icon: Sparkles,
      color: 'from-cyan-500 to-purple-600',
      highlights: [
        '1-Click Judge Demo Login on sign-in screen.',
        '1-Click Quick Strategy Templates (SaaS MVP, FinTech Settlement, HealthTech App).',
        'Live Re-Optimization AI engine to adjust budget and deadline sliders.'
      ]
    }
  ];

  if (!isOpen) return null;

  const activeSlide = slides[currentSlide];
  const Icon = activeSlide.icon;

  const handleNext = () => {
    playAgentChime(600 + currentSlide * 100);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      playSuccessFanfare();
      onClose();
    }
  };

  const handlePrev = () => {
    playAgentChime(450);
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-purple-500/40 bg-[#0B0F19] text-white shadow-2xl relative overflow-hidden"
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>HACKATHON PITCH OVERLAY • STEP {currentSlide + 1} OF 5</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="py-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${activeSlide.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">{activeSlide.title}</h3>
              <p className="text-xs text-purple-300 font-mono mt-0.5">{activeSlide.subtitle}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {activeSlide.highlights.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex space-x-1.5">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === currentSlide ? 'bg-purple-400' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-extrabold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-2"
            >
              <span>{currentSlide === slides.length - 1 ? 'Finish Tour 🚀' : 'Next Insight'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

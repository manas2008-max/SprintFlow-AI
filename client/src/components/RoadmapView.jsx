import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Calendar, CheckSquare, Clock, ArrowRight } from 'lucide-react';

export default function RoadmapView({ milestones = [] }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl text-slate-400">
        No milestones generated yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Autonomous Roadmap & Milestone Architecture</span>
          </h3>
          <p className="text-xs text-slate-400">
            Deconstructed by Planner Agent to ensure critical path alignment and buffer protection.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
          {milestones.length} Strategic Phases
        </span>
      </div>

      <div className="relative pl-6 md:pl-8 border-l-2 border-slate-800 space-y-8">
        {milestones.map((m, idx) => (
          <motion.div
            key={m.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="relative group"
          >
            {/* Timeline Dot Indicator */}
            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-purple-500 flex items-center justify-center group-hover:scale-125 transition-transform duration-300 shadow-md shadow-purple-500/30">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            </div>

            {/* Card Content */}
            <div className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-purple-500/40 transition-all duration-300 space-y-3">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-purple-400 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    Phase 0{idx + 1}
                  </span>
                  <h4 className="font-bold text-white text-base">{m.title}</h4>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{m.durationWeeks || 2} Weeks</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Target: {m.targetDate || '2026-09-01'}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {m.description}
              </p>

              {/* Expected Deliverables */}
              {m.deliverables && m.deliverables.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono block mb-2">
                    Key Deliverables
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {m.deliverables.map((deliv, dIdx) => (
                      <span
                        key={dIdx}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-200 text-xs"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{deliv}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

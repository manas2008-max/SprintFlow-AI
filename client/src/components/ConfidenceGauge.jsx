import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Award } from 'lucide-react';

export default function ConfidenceGauge({ confidenceScore = 95, healthScore = 91 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      
      {/* AI Confidence Gauge */}
      <div className="p-5 rounded-2xl glass-card border border-purple-500/20 flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Confidence Index</span>
          </div>
          <div className="text-3xl font-extrabold text-white flex items-baseline space-x-1">
            <span>{confidenceScore}%</span>
            <span className="text-xs text-emerald-400 font-normal">High Precision</span>
          </div>
          <p className="text-xs text-slate-400 leading-tight">
            Based on skill-matrix alignment & timeline risk bounds.
          </p>
        </div>

        {/* Circular Gauge Graphic */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="text-purple-500"
              strokeWidth="3.5"
              strokeDasharray={`${confidenceScore}, 100`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${confidenceScore}, 100` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <Award className="w-5 h-5 text-purple-400 absolute" />
        </div>
      </div>

      {/* Business Health Gauge */}
      <div className="p-5 rounded-2xl glass-card border border-cyan-500/20 flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Business Health Score</span>
          </div>
          <div className="text-3xl font-extrabold text-white flex items-baseline space-x-1">
            <span>{healthScore}/100</span>
            <span className="text-xs text-emerald-400 font-normal">Optimal</span>
          </div>
          <p className="text-xs text-slate-400 leading-tight">
            Balanced budget allocation & zero critical bottlenecks.
          </p>
        </div>

        {/* Circular Gauge Graphic */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="text-cyan-400"
              strokeWidth="3.5"
              strokeDasharray={`${healthScore}, 100`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${healthScore}, 100` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <Activity className="w-5 h-5 text-cyan-400 absolute animate-pulse" />
        </div>
      </div>

    </div>
  );
}

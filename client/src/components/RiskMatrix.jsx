import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, Lightbulb, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { playAgentChime, playSuccessFanfare } from '../utils/audio';

export default function RiskMatrix({ risks = [] }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [isSimulatingMitigation, setIsSimulatingMitigation] = useState(false);
  const [mitigationComplete, setMitigationComplete] = useState(false);

  if (!risks || risks.length === 0) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl text-slate-400">
        No critical risks detected. System operates with optimal safety parameters.
      </div>
    );
  }

  // Categories extracted dynamically from actual risks
  const rawCategories = Array.from(new Set(risks.map(r => r.category || 'General')));
  const categories = ['All', ...rawCategories];

  const filteredRisks = filterCategory === 'All' 
    ? risks 
    : risks.filter(r => (r.category || 'General').toLowerCase().includes(filterCategory.toLowerCase()));

  // Helper functions for impact & likelihood evaluation
  const getImpact = (r) => mitigationComplete ? 'Low' : (r.impact || 'Medium');
  const getLikelihood = (r) => mitigationComplete ? 'Low' : (r.likelihood || 'Medium');

  const isHighStr = (val) => {
    const s = (val || '').toLowerCase();
    return s.includes('high') || s.includes('critical');
  };

  const isMedStr = (val) => {
    const s = (val || '').toLowerCase();
    return s.includes('med');
  };

  // Synchronized 2x2 Heatmap Bucketing
  const hhRisks = risks.filter(r => isHighStr(getImpact(r)) && isHighStr(getLikelihood(r)));
  const hlRisks = risks.filter(r => isHighStr(getImpact(r)) && !isHighStr(getLikelihood(r)));
  const lhRisks = risks.filter(r => !isHighStr(getImpact(r)) && isHighStr(getLikelihood(r)));
  const llRisks = risks.filter(r => !isHighStr(getImpact(r)) && !isHighStr(getLikelihood(r)));

  // Determine overall dominant heatmap status
  const maxImpactHigh = risks.some(r => isHighStr(getImpact(r)));
  const maxImpactMed = risks.some(r => isMedStr(getImpact(r)));

  const handleSimulateMitigation = () => {
    playAgentChime(600);
    setIsSimulatingMitigation(true);
    setTimeout(() => {
      setIsSimulatingMitigation(false);
      setMitigationComplete(true);
      playSuccessFanfare();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Autonomous Risk Matrix & Mitigation System</span>
          </h3>
          <p className="text-xs text-slate-400">
            Detected and evaluated in real-time by Risk Agent based on generated project requirements.
          </p>
        </div>

        <button
          onClick={handleSimulateMitigation}
          disabled={isSimulatingMitigation}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:scale-105"
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulatingMitigation ? 'animate-spin' : ''}`} />
          <span>{isSimulatingMitigation ? 'Recalculating Risk...' : 'Simulate AI Risk Mitigation'}</span>
        </button>
      </div>

      {/* Dynamic 2x2 Heatmap Matrix Preview */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            2x2 Impact vs Likelihood Heatmap Grid
          </span>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${
            mitigationComplete 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : maxImpactHigh
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : maxImpactMed
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {mitigationComplete ? 'All Mitigated 🟢' : maxImpactHigh ? 'High Impact Vectors Detected' : maxImpactMed ? 'Medium Risk Profile' : 'Low Impact Buffer Zone'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
          
          {/* High Impact / High Likelihood */}
          <div className={`p-4 rounded-xl border transition-all ${
            hhRisks.length > 0
              ? 'bg-rose-950/50 border-rose-500/40 text-rose-300 shadow-md shadow-rose-950/50'
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <span className="font-extrabold block">High Impact / High Likelihood</span>
            <span className="text-[10px] mt-1 block">
              {hhRisks.length > 0 
                ? `${hhRisks.length} Vector(s) (${hhRisks.map(r => r.title.split(' ')[0]).join(', ')})`
                : '0 Active Vectors'}
            </span>
          </div>

          {/* High Impact / Low Likelihood */}
          <div className={`p-4 rounded-xl border transition-all ${
            hlRisks.length > 0
              ? 'bg-amber-950/50 border-amber-500/40 text-amber-300 shadow-md shadow-amber-950/50'
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <span className="font-extrabold block">High Impact / Low-Med Likelihood</span>
            <span className="text-[10px] mt-1 block">
              {hlRisks.length > 0 
                ? `${hlRisks.length} Vector(s) (${hlRisks.map(r => r.title.split(' ')[0]).join(', ')})`
                : '0 Active Vectors'}
            </span>
          </div>

          {/* Low Impact / High Likelihood */}
          <div className={`p-4 rounded-xl border transition-all ${
            lhRisks.length > 0
              ? 'bg-indigo-950/50 border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-950/50'
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <span className="font-extrabold block">Low-Med Impact / High Likelihood</span>
            <span className="text-[10px] mt-1 block">
              {lhRisks.length > 0 
                ? `${lhRisks.length} Vector(s) (${lhRisks.map(r => r.title.split(' ')[0]).join(', ')})`
                : '0 Active Vectors'}
            </span>
          </div>

          {/* Low Impact / Low Likelihood */}
          <div className={`p-4 rounded-xl border transition-all ${
            llRisks.length > 0
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/50'
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <span className="font-extrabold block">Low Impact / Low Likelihood</span>
            <span className="text-[10px] mt-1 block">
              {llRisks.length > 0 
                ? `${llRisks.length} Vector(s) (Optimal Buffer)`
                : 'Optimal Buffer Zone'}
            </span>
          </div>

        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { playAgentChime(500); setFilterCategory(cat); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRisks.map((risk, idx) => {
          const impactVal = getImpact(risk);
          const likelihoodVal = getLikelihood(risk);
          const isHighRisk = isHighStr(impactVal) || isHighStr(likelihoodVal);
          const isMedRisk = isMedStr(impactVal) || isMedStr(likelihoodVal);

          return (
            <motion.div
              key={risk.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-rose-500/40 transition-all duration-300 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    mitigationComplete
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : isHighRisk
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : isMedRisk
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}>
                    {mitigationComplete ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{risk.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Category: <strong className="text-slate-300">{risk.category || 'General'}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    mitigationComplete 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : isHighStr(impactVal)
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isMedStr(impactVal)
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    Impact: {impactVal}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    mitigationComplete 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : isHighStr(likelihoodVal)
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isMedStr(likelihoodVal)
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    Likelihood: {likelihoodVal}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {risk.description}
              </p>

              {risk.mitigationStrategy && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-mono text-[11px] font-bold">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Risk Agent Safeguard Strategy</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                    {risk.mitigationStrategy}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, Lightbulb, Zap, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import { playAgentChime, playSuccessFanfare } from '../utils/audio';

export default function RiskMatrix({ risks = [], overallRiskScore = 0 }) {
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

  // Synchronized 2x2 Heatmap Quadrant Bucketing
  const hhRisks = risks.filter(r => isHighStr(getImpact(r)) && isHighStr(getLikelihood(r)));
  const hmRisks = risks.filter(r => isHighStr(getImpact(r)) && isMedStr(getLikelihood(r)));
  const mhRisks = risks.filter(r => isMedStr(getImpact(r)) && isHighStr(getLikelihood(r)));
  const llRisks = risks.filter(r => (!isHighStr(getImpact(r)) && !isMedStr(getImpact(r))) || (!isHighStr(getLikelihood(r)) && !isMedStr(getLikelihood(r))));

  // Calculate dynamic overall risk classification
  const calculatedScore = overallRiskScore || (
    hhRisks.length * 25 + hmRisks.length * 15 + mhRisks.length * 15 + llRisks.length * 5
  );

  let riskClass = { label: 'Low', color: 'emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  if (calculatedScore >= 76) {
    riskClass = { label: 'Critical', color: 'rose', bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/50' };
  } else if (calculatedScore >= 51) {
    riskClass = { label: 'High', color: 'orange', bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' };
  } else if (calculatedScore >= 26) {
    riskClass = { label: 'Medium', color: 'amber', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
  }

  if (mitigationComplete) {
    riskClass = { label: 'Low (Mitigated)', color: 'emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  }

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
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Autonomous Risk Matrix & Mitigation Engine</span>
            </h3>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${riskClass.bg} ${riskClass.text} ${riskClass.border}`}>
              Overall Risk: {riskClass.label} ({calculatedScore}/100)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Calculated dynamically by Risk Agent based on team capacity, deadline, budget, skill gap, and task allocation.
          </p>
        </div>

        <button
          onClick={handleSimulateMitigation}
          disabled={isSimulatingMitigation}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:scale-105"
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulatingMitigation ? 'animate-spin' : ''}`} />
          <span>{isSimulatingMitigation ? 'Recalculating Risk...' : 'Simulate AI Risk Safeguards'}</span>
        </button>
      </div>

      {/* Dynamic 2x2 Heatmap Matrix Grid */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            2x2 Impact vs Likelihood Heatmap Grid
          </span>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${riskClass.bg} ${riskClass.text} ${riskClass.border}`}>
            {mitigationComplete ? 'All Safeguards Applied 🟢' : `${risks.length} Dynamic Risk Vectors Active`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
          
          {/* High Impact / High Likelihood */}
          <div className={`p-4 rounded-xl border transition-all ${
            !mitigationComplete && hhRisks.length > 0
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-950/60 ring-1 ring-rose-500/30'
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-rose-400">High Impact / High Likelihood</span>
              {hhRisks.length > 0 && !mitigationComplete && <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />}
            </div>
            <span className="text-xs font-bold mt-1 block">
              {mitigationComplete ? '0 Active Vectors' : `${hhRisks.length} Active Vector(s)`}
            </span>
            {hhRisks.length > 0 && !mitigationComplete && (
              <span className="text-[10px] text-rose-300/80 block mt-1 truncate">
                {hhRisks.map(r => r.title).join(', ')}
              </span>
            )}
          </div>

          {/* High Impact / Medium Likelihood */}
          <div className={`p-4 rounded-xl border transition-all ${
            !mitigationComplete && hmRisks.length > 0
              ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-950/60'
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-amber-400">High Impact / Medium Likelihood</span>
              {hmRisks.length > 0 && !mitigationComplete && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <span className="text-xs font-bold mt-1 block">
              {mitigationComplete ? '0 Active Vectors' : `${hmRisks.length} Active Vector(s)`}
            </span>
            {hmRisks.length > 0 && !mitigationComplete && (
              <span className="text-[10px] text-amber-300/80 block mt-1 truncate">
                {hmRisks.map(r => r.title).join(', ')}
              </span>
            )}
          </div>

          {/* Medium Impact / High Likelihood */}
          <div className={`p-4 rounded-xl border transition-all ${
            !mitigationComplete && mhRisks.length > 0
              ? 'bg-orange-950/60 border-orange-500/50 text-orange-300 shadow-lg shadow-orange-950/60'
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-orange-400">Medium Impact / High Likelihood</span>
              {mhRisks.length > 0 && !mitigationComplete && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
            </div>
            <span className="text-xs font-bold mt-1 block">
              {mitigationComplete ? '0 Active Vectors' : `${mhRisks.length} Active Vector(s)`}
            </span>
            {mhRisks.length > 0 && !mitigationComplete && (
              <span className="text-[10px] text-orange-300/80 block mt-1 truncate">
                {mhRisks.map(r => r.title).join(', ')}
              </span>
            )}
          </div>

          {/* Low Impact / Low Likelihood */}
          <div className={`p-4 rounded-xl border transition-all ${
            mitigationComplete || llRisks.length > 0 || risks.length === 0
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/60'
              : 'bg-slate-900/40 border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-emerald-400">Low Impact / Low Likelihood</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold mt-1 block">
              {mitigationComplete ? `${risks.length} Mitigated Vector(s)` : `${llRisks.length} Active Vector(s)`}
            </span>
            <span className="text-[10px] text-emerald-300/80 block mt-1">
              Optimal Buffer Zone
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

              {/* Empirical Reason */}
              {risk.reason && (
                <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs text-rose-300/90 font-mono">
                  <strong className="text-rose-400">Trigger Reason:</strong> {risk.reason}
                </div>
              )}

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

import React from 'react';
import { Bot, Github, Twitter, Linkedin, ShieldCheck, Sparkles, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070A11] pt-16 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">SprintFlow AI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The Autonomous AI Operating System for modern businesses. Replacing manual project management with collaborative multi-agent intelligence.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>Gemini 2.5 Agents Active</span>
              </span>
            </div>
          </div>

          {/* Column 1: AI Agents */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Autonomous Agents</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Planner Agent</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Task Allocation Agent</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Risk & Mitigation Agent</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Coordinator Agent</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Report Generation Agent</li>
            </ul>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Kanban & Roadmap</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Risk Matrix Heatmap</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Report Center</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">AI Confidence Gauges</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Enterprise API</li>
            </ul>
          </div>

          {/* Column 3: Security & Hackathon */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Hackathon 2026</h4>
            <div className="glass-card p-4 rounded-xl border border-purple-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Agentic AI Theme</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Built for real-world autonomous decision-making and business workflow automation.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 SprintFlow AI. All rights reserved. Powered by Google Gemini API.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">System Status</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

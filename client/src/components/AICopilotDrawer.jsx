import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Send, X, Terminal, CheckCircle2, MessageSquare, Zap } from 'lucide-react';
import { playAgentChime } from '../utils/audio';

export default function AICopilotDrawer({ project }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      name: 'SprintFlow Assistant',
      text: `Hello! I am your AI Project Manager Co-Pilot for '${project?.name || 'SprintFlow Strategy'}'. Ask me anything about critical path, risk mitigation, or task rationale!`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'What is our critical path?',
    'How can we reduce risk?',
    'Explain task rationale',
    'Summarize budget burn'
  ];

  const handleSend = (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    playAgentChime(700);

    const newMessages = [
      ...messages,
      { sender: 'user', text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Simulate Agentic Copilot response
    setTimeout(() => {
      let reply = '';
      const query = textToSend.toLowerCase();

      if (query.includes('critical path') || query.includes('path')) {
        reply = `Coordinator Agent analysis: The critical path spans Phase 1 Schema Design -> Phase 2 API Microservices -> Phase 3 Security Audit. Total estimated duration is 6 weeks.`;
      } else if (query.includes('risk') || query.includes('mitigate')) {
        reply = `Risk Agent assessment: Primary risk vector is '${project?.risks?.[0]?.title || 'Deadline Pressure'}'. Recommended mitigation: '${project?.risks?.[0]?.mitigationStrategy || 'Deploy pair programming during Phase 1.'}'`;
      } else if (query.includes('task') || query.includes('rationale') || query.includes('assign')) {
        reply = `Task Agent rationale: Tasks are assigned based on skill-matching tags. Lead Devs are assigned to architecture, while specialists handle design tokens and DevOps pipeline.`;
      } else {
        reply = `SprintFlow AI Swarm evaluated your query "${textToSend}". Project status is currently GREEN (91/100 Health Score) with ${project?.milestones?.length || 3} milestones active.`;
      }

      playAgentChime(900, 'triangle');
      setMessages(prev => [
        ...prev,
        { sender: 'agent', name: 'Coordinator Agent', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setLoading(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => { playAgentChime(500); setIsOpen(true); }}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-2xl shadow-purple-600/40 hover:scale-110 transition-all duration-300 flex items-center space-x-2 group"
      >
        <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-xs hidden sm:inline">AI Co-Pilot</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
      </button>

      {/* Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[550px] glass-panel p-5 rounded-3xl border border-purple-500/40 bg-[#0B0F19] text-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">SprintFlow Co-Pilot</h4>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Multi-Agent Mesh Online</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5 py-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800 transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1 font-sans text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl space-y-1 ${
                      m.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none shadow-md shadow-purple-600/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {m.sender === 'agent' && (
                      <span className="text-[10px] font-mono text-purple-400 font-bold block">
                        [{m.name}]
                      </span>
                    )}
                    <p className="leading-relaxed">{m.text}</p>
                    <span className="text-[9px] text-slate-400 font-mono block text-right">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-2 text-purple-400 text-xs animate-pulse">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>Agent reasoning...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Co-Pilot about strategy, risk, or roadmap..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Users, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Target, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AgentWorkflowSimulator from '../components/AgentWorkflowSimulator';
import { projectAPI } from '../services/api';
import { playAgentChime } from '../utils/audio';

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('SaaS Enterprise');
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [budget, setBudget] = useState(50000);
  const [priority, setPriority] = useState('High');

  const [teamMembers, setTeamMembers] = useState([
    { id: 'tm1', name: 'Rahul Sharma', role: 'Fullstack Lead', skills: ['Node.js', 'React', 'API Architecture'], availability: 100 },
    { id: 'tm2', name: 'Sarah Chen', role: 'UI/UX Specialist', skills: ['Framer Motion', 'Tailwind CSS', 'Figma'], availability: 100 }
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberSkills, setNewMemberSkills] = useState('');

  const [deliverables, setDeliverables] = useState(['System Architecture Blueprint', 'Production API Service', 'Security & Compliance Certification']);
  const [newDeliverable, setNewDeliverable] = useState('');

  const [isSimulating, setIsSimulating] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState(null);
  const [error, setError] = useState('');
  const [generationStep, setGenerationStep] = useState(1);

  const presets = [
    {
      title: '📦 Inventory Management System',
      name: 'OmniStock Inventory Management',
      businessType: 'Retail & Logistics',
      goal: 'Build an automated multi-warehouse inventory management system with stock prediction and supplier API integration',
      budget: 55000,
      deadline: '2026-09-30',
      priority: 'High',
      team: [
        { id: 'tm1', name: 'Rahul Sharma', role: 'Backend Dev', skills: ['Node.js', 'PostgreSQL', 'Redis'], availability: 100 },
        { id: 'tm2', name: 'Sarah Chen', role: 'Frontend Dev', skills: ['React', 'Tailwind CSS', 'Chart.js'], availability: 100 }
      ],
      deliverables: ['Real-time Warehouse API', 'Stock Forecasting Engine', 'Supplier Portal']
    },
    {
      title: '🛒 E-Commerce Platform',
      name: 'NexShop Global E-Commerce',
      businessType: 'E-Commerce Platform',
      goal: 'Launch high-scale multi-vendor e-commerce platform with automated payment settlement and cart checkout',
      budget: 75000,
      deadline: '2026-10-15',
      priority: 'Critical',
      team: [
        { id: 'tm1', name: 'Devon Vance', role: 'Fullstack Engineer', skills: ['React', 'Node.js', 'Stripe API'], availability: 100 },
        { id: 'tm2', name: 'Aria Chen', role: 'DevOps Specialist', skills: ['Docker', 'AWS', 'Kubernetes'], availability: 90 }
      ],
      deliverables: ['Storefront UI', 'Payment Gateway Integration', 'Vendor Dashboard']
    },
    {
      title: '👥 HR Management Portal',
      name: 'PeoplePulse HR Portal',
      businessType: 'Enterprise HR',
      goal: 'Develop an automated employee onboarding, attendance tracking, and payroll processing portal',
      budget: 45000,
      deadline: '2026-09-20',
      priority: 'High',
      team: [
        { id: 'tm1', name: 'Elena Rostova', role: 'Lead Architect', skills: ['React', 'Node.js', 'PostgreSQL'], availability: 100 },
        { id: 'tm2', name: 'Marcus Vance', role: 'UI/UX Designer', skills: ['Tailwind CSS', 'Figma', 'Framer'], availability: 100 }
      ],
      deliverables: ['Employee Directory API', 'Payroll Module', 'Onboarding Workflow']
    },
    {
      title: '💬 Customer Support Platform',
      name: 'DeskAI Customer Support',
      businessType: 'SaaS Platform',
      goal: 'Build an AI ticket routing and automated response platform for enterprise support teams',
      budget: 60000,
      deadline: '2026-10-01',
      priority: 'Medium',
      team: [
        { id: 'tm1', name: 'Alex Rivera', role: 'AI Engineer', skills: ['Python', 'LangChain', 'FastAPI'], availability: 100 },
        { id: 'tm2', name: 'Sarah Chen', role: 'Frontend Engineer', skills: ['React', 'Tailwind CSS', 'WebSockets'], availability: 100 }
      ],
      deliverables: ['Ticket Routing Engine', 'Agent Workspace UI', 'Analytics Dashboard']
    }
  ];

  const applyPreset = (p) => {
    playAgentChime(600);
    setName(p.name);
    setBusinessType(p.businessType);
    setGoal(p.goal);
    setBudget(p.budget);
    setDeadline(p.deadline);
    setPriority(p.priority);
    setTeamMembers(p.team);
    setDeliverables(p.deliverables);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName) return;
    const member = {
      id: 'tm_' + Math.random().toString(36).substring(2, 7),
      name: newMemberName,
      role: newMemberRole || 'Specialist',
      skills: newMemberSkills ? newMemberSkills.split(',').map(s => s.trim()) : ['Development'],
      availability: 100
    };
    setTeamMembers([...teamMembers, member]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberSkills('');
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const handleAddDeliverable = (e) => {
    e.preventDefault();
    if (!newDeliverable) return;
    setDeliverables([...deliverables, newDeliverable]);
    setNewDeliverable('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !goal) {
      setError('Please provide project name and primary goal.');
      return;
    }

    const payload = {
      name,
      businessType,
      goal,
      deadline,
      budget: Number(budget),
      priority,
      teamMembers,
      expectedDeliverables: deliverables
    };

    console.log('[CREATE_PROJECT_PAGE] 1. Validating input parameters...', payload);
    setGenerationStep(1);
    setIsSimulating(true);

    // Timeout guard (30 Seconds Max) to prevent infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setIsSimulating(false);
      setError('Generation Timeout (30s limit exceeded). The server took too long to respond. Please check your network or try again.');
    }, 30000);

    try {
      console.log('[CREATE_PROJECT_PAGE] 2. Calling Gemini AI & Multi-Agent Swarm...');
      setGenerationStep(2);

      const res = await projectAPI.create(payload);
      clearTimeout(timeoutId);

      console.log('[CREATE_PROJECT_PAGE] 3. Backend Create Response:', res.data);

      if (res.data && res.data.success && res.data.project) {
        const pid = res.data.project.id || res.data.project._id;
        setCreatedProjectId(pid);
        setGenerationStep(7); // Redirecting to Dashboard step
        console.log('[CREATE_PROJECT_PAGE] 4. Returned Project UUID:', pid);
        
        setTimeout(() => {
          navigate(`/projects/${pid}`);
        }, 1500);
      } else {
        const dbErr = res.data?.message || 'Database project generation failed.';
        console.error('[CREATE_PROJECT_PAGE] Project Generation Error:', dbErr);
        setIsSimulating(false);
        setError(`Project Generation Error: ${dbErr}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setIsSimulating(false);
      if (err.name === 'AbortError') {
        setError('Generation Timeout: Request aborted after 30 seconds.');
      } else {
        const dbErr = err.response?.data?.message || err.message || 'Server error creating project';
        console.error('[CREATE_PROJECT_PAGE] Exception during project creation:', dbErr, err.response?.data);
        setError(`Error: ${dbErr}`);
      }
    }
  };

  const handleSimulationFinished = () => {
    if (createdProjectId) {
      console.log('[CREATE_PROJECT_PAGE] Navigating to created project:', `/projects/${createdProjectId}`);
      navigate(`/projects/${createdProjectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 pt-16">
        <Sidebar activeTab="create" />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Autonomous AI Project Blueprint Generator</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Create AI-Managed Project</h1>
              <p className="text-slate-400 text-sm mt-1">
                Input your business goals and let our 5 specialized AI agents build the architecture, task matrix, risk mitigation, and reports.
              </p>
            </div>
          </div>

          {/* Error Alert Display */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 text-sm"
            >
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-bold block text-white">Generation Error</strong>
                <p className="text-xs text-rose-300 mt-0.5">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="mt-2 text-xs font-semibold text-rose-400 hover:text-rose-200 underline flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Dismiss & Retry</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Quick Presets */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Quick Hackathon Demo Presets</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-purple-500/50 text-left transition-all hover:scale-102 group space-y-1"
                >
                  <span className="font-bold text-xs text-white block group-hover:text-purple-300 transition-colors">
                    {p.title}
                  </span>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                    {p.goal}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Creation Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Project Identity */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Target className="w-5 h-5 text-purple-400" />
                <span>1. Project Identity & Objectives</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. OmniStock Inventory Management"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-purple-500 focus:outline-none text-sm text-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Business Industry / Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-purple-500 focus:outline-none text-sm text-white transition-colors"
                  >
                    <option value="SaaS Enterprise">SaaS Enterprise</option>
                    <option value="E-Commerce Platform">E-Commerce Platform</option>
                    <option value="Retail & Logistics">Retail & Logistics</option>
                    <option value="Fintech & Banking">Fintech & Banking</option>
                    <option value="Healthcare & AI">Healthcare & AI</option>
                    <option value="Government & National">Government & National</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Goal & Scope Description *</label>
                <textarea
                  rows={3}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Describe what the system needs to accomplish..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-purple-500 focus:outline-none text-sm text-white transition-colors leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Allocated Budget (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-purple-500 focus:outline-none text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Target Launch Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-purple-500 focus:outline-none text-sm text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-purple-500 focus:outline-none text-sm text-white font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Team Members & Skills */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>2. Team Member Roster & Skill Matrix</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">{teamMembers.length} Members Assigned</span>
              </div>

              {/* Existing Team Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamMembers.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl glass-card border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-white">{m.name}</h4>
                      <p className="text-xs text-purple-400 font-medium">{m.role}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(m.skills || []).map((skill, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Member Input */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h5 className="text-xs font-mono font-bold text-slate-300">Add Team Specialist</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Rahul Sharma)"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Fullstack Lead)"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Skills (e.g. React, Node.js)"
                    value={newMemberSkills}
                    onChange={(e) => setNewMemberSkills(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>

            {/* Step 3: Expected Deliverables */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>3. Expected Key Deliverables</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {deliverables.map((del, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 flex items-center space-x-2">
                    <span>{del}</span>
                    <button type="button" onClick={() => setDeliverables(deliverables.filter((_, i) => i !== idx))} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2 max-w-md">
                <input
                  type="text"
                  placeholder="Add custom deliverable requirement..."
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Submit Action CTA */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSimulating}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 flex items-center space-x-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Start Autonomous AI Planning Engine</span>
              </button>
            </div>

          </form>

          {/* Interactive Agent Simulator Modal */}
          {isSimulating && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-4xl space-y-4">
                <AgentWorkflowSimulator 
                  projectName={name} 
                  onComplete={handleSimulationFinished}
                  isLiveModal={true}
                />
                
                {/* Visible Progress Step Bar */}
                <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center text-xs font-mono text-slate-300 flex items-center justify-around">
                  <span className={generationStep >= 1 ? 'text-purple-400 font-bold' : 'text-slate-600'}>1. Validating Input</span>
                  <span>➔</span>
                  <span className={generationStep >= 2 ? 'text-indigo-400 font-bold' : 'text-slate-600'}>2. Calling Gemini AI</span>
                  <span>➔</span>
                  <span className={generationStep >= 3 ? 'text-cyan-400 font-bold' : 'text-slate-600'}>3. Generating Milestones</span>
                  <span>➔</span>
                  <span className={generationStep >= 4 ? 'text-blue-400 font-bold' : 'text-slate-600'}>4. Task Rationale</span>
                  <span>➔</span>
                  <span className={generationStep >= 5 ? 'text-rose-400 font-bold' : 'text-slate-600'}>5. Risk Agent</span>
                  <span>➔</span>
                  <span className={generationStep >= 6 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>6. Saving Supabase</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

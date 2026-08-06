import React, { useState } from 'react';
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
  CheckCircle2
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

  // Updated presets to match requested prompt categories
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
      priority: 'High',
      team: [
        { id: 'tm1', name: 'Rahul Sharma', role: 'Backend Lead', skills: ['Node.js', 'Gemini API', 'Express'], availability: 100 },
        { id: 'tm2', name: 'Sarah Chen', role: 'UI Specialist', skills: ['React', 'Tailwind', 'WebSockets'], availability: 100 }
      ],
      deliverables: ['Ticket Routing Engine', 'Real-time Chat Widget', 'Analytics Suite']
    },
    {
      title: '🏥 Hospital Management System',
      name: 'HealthCore Hospital System',
      businessType: 'HealthTech Platform',
      goal: 'Create HIPAA-compliant electronic health record (EHR) and patient appointment scheduling system',
      budget: 85000,
      deadline: '2026-10-30',
      priority: 'Critical',
      team: [
        { id: 'tm1', name: 'Dr. Lucas Thorne', role: 'Clinical Architect', skills: ['HL7 FHIR', 'HIPAA Vault'], availability: 80 },
        { id: 'tm2', name: 'Devon Vance', role: 'Senior Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'Security'], availability: 100 }
      ],
      deliverables: ['Patient Portal', 'EHR Microservice', 'HIPAA Audit Logs']
    },
    {
      title: '🚚 Smart Logistics Dashboard',
      name: 'FleetVision Logistics Dashboard',
      businessType: 'Logistics Enterprise',
      goal: 'Build GPS fleet tracking and route optimization dashboard for real-time delivery management',
      budget: 65000,
      deadline: '2026-09-25',
      priority: 'High',
      team: [
        { id: 'tm1', name: 'Elena Rostova', role: 'Fullstack Lead', skills: ['React', 'Leaflet Maps', 'Node.js'], availability: 100 },
        { id: 'tm2', name: 'Aria Chen', role: 'Data Engineer', skills: ['Python', 'Kafka', 'Redis'], availability: 90 }
      ],
      deliverables: ['Real-time Fleet Map', 'Route Optimization Engine', 'Driver Dispatch App']
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

    console.log('[FRONTEND] 1. Incoming Request Body:', payload);
    setIsSimulating(true);

    try {
      const res = await projectAPI.create(payload);
      console.log('[FRONTEND] 2. Backend Create Response:', res.data);

      if (res.data && res.data.success && res.data.project) {
        const pid = res.data.project.id || res.data.project._id;
        setCreatedProjectId(pid);
        console.log('[FRONTEND] 3. Returned Project UUID:', pid);
        console.log('[FRONTEND] 4. React navigation target:', `/projects/${pid}`);
      } else {
        const dbErr = res.data?.message || 'Database insert failed.';
        console.error('[FRONTEND] Database Insert Error:', dbErr);
        setIsSimulating(false);
        setError(`Database Error: ${dbErr}`);
      }
    } catch (err) {
      const dbErr = err.response?.data?.message || err.message || 'Server error creating project';
      console.error('[FRONTEND] Database Insert Exception:', dbErr, err.response?.data);
      setIsSimulating(false);
      setError(`Database Error: ${dbErr}`);
    }
  };

  const handleSimulationFinished = () => {
    if (createdProjectId) {
      console.log('[FRONTEND] Navigating now to target:', `/projects/${createdProjectId}`);
      navigate(`/projects/${createdProjectId}`);
    } else {
      console.warn('[FRONTEND] Cannot navigate - missing createdProjectId. Displaying error in UI.');
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-white flex flex-col selection:bg-purple-500/30">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          
          {/* Header */}
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 mb-1">
              <Bot className="w-4 h-4" />
              <span>AUTONOMOUS AGENT ORCHESTRATOR WIZARD</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Create New AI Execution Strategy</h1>
            <p className="text-xs text-slate-400 mt-1">
              Define your business requirements. SprintFlow AI agents will autonomously generate your roadmap, assign tasks with reasoning, evaluate risks, and compile documentation.
            </p>
          </div>

          {/* If Simulating multi-agent execution */}
          {isSimulating ? (
            <div className="py-8">
              <AgentWorkflowSimulator 
                projectName={name} 
                onComplete={handleSimulationFinished} 
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Preset Buttons Bar */}
              <div className="p-4 rounded-2xl glass-card border border-purple-500/30 space-y-2">
                <span className="text-xs font-semibold text-purple-300 font-mono flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Quick Template Presets (1-Click Fill for Instant Evaluation):</span>
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-purple-400 text-xs font-medium transition-all hover:scale-105"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {error}
                </div>
              )}

              {/* SECTION 1: Business Requirements */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <h3 className="font-bold text-base text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span>1. Business Context & Goal</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 font-mono uppercase">Project Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. OmniStock Inventory Management"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 font-mono uppercase">Business Type / Industry</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="SaaS Enterprise">SaaS Enterprise</option>
                      <option value="Retail & Logistics">Retail & Logistics</option>
                      <option value="E-Commerce Platform">E-Commerce Platform</option>
                      <option value="Enterprise HR">Enterprise HR</option>
                      <option value="HealthTech Platform">HealthTech Platform</option>
                      <option value="Logistics Enterprise">Logistics Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 font-mono uppercase">Primary Business Goal & Scope</label>
                  <textarea
                    required
                    rows={3}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Describe what this project needs to achieve, target deliverables, and main constraints..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 font-mono uppercase">Target Deadline</label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 font-mono uppercase">Allocated Budget (₹)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 font-mono uppercase">Priority Level</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Team Members & Skillsets */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-base text-white flex items-center space-x-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>2. Team Members & Skillsets (For Task Agent Skill Matching)</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">{teamMembers.length} Members</span>
                </div>

                {/* Team List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teamMembers.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-white text-sm">{m.name}</p>
                        <p className="text-xs text-purple-400 font-mono">{m.role}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {m.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Member Form Inline */}
                <div className="pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Member Name (e.g. Rahul)"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Backend Dev)"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Skills (e.g. Node.js, API)"
                    value={newMemberSkills}
                    onChange={(e) => setNewMemberSkills(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3: Deliverables */}
              <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <h3 className="font-bold text-base text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>3. Expected Deliverables (For Report Agent Documentation)</span>
                </h3>

                <div className="flex flex-wrap gap-2">
                  {deliverables.map((deliv, idx) => (
                    <span key={idx} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                      <span>{deliv}</span>
                      <button
                        type="button"
                        onClick={() => setDeliverables(deliverables.filter((_, i) => i !== idx))}
                        className="hover:text-rose-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add expected deliverable..."
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 flex items-center space-x-2"
                >
                  <Sparkles className="w-5 h-5 text-purple-200 animate-spin" />
                  <span>Start Autonomous AI Planning Engine</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </form>
          )}

        </main>
      </div>

    </div>
  );
}

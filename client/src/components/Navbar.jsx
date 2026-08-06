import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  Sparkles, 
  LayoutDashboard, 
  LogOut, 
  ArrowRight, 
  FolderKanban, 
  User, 
  Building, 
  Settings, 
  ChevronDown, 
  ShieldCheck 
} from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { playAgentChime } from '../utils/audio';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState('profile');

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openProfileModal = (tab = 'profile') => {
    playAgentChime(600);
    setModalInitialTab(tab);
    setIsEditModalOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#070A11]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white">SprintFlow</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold tracking-wider uppercase">AI</span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider font-mono">AGENTIC OS</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
              {user ? (
                <>
                  <Link to="/dashboard" className="hover:text-purple-400 transition-colors flex items-center space-x-1.5">
                    <LayoutDashboard className="w-4 h-4 text-purple-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/dashboard" className="hover:text-purple-400 transition-colors flex items-center space-x-1.5">
                    <FolderKanban className="w-4 h-4 text-cyan-400" />
                    <span>My Projects</span>
                  </Link>
                  <a href="#features" className="hover:text-purple-400 transition-colors">Swarm Agents</a>
                </>
              ) : (
                <>
                  <a href="#features" className="hover:text-purple-400 transition-colors">Agents</a>
                  <a href="#workflow" className="hover:text-purple-400 transition-colors">Workflow</a>
                  <a href="#comparison" className="hover:text-purple-400 transition-colors">Why Agentic</a>
                  <a href="#testimonials" className="hover:text-purple-400 transition-colors">Testimonials</a>
                </>
              )}
            </div>

            {/* Action Buttons & Profile Avatar */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  
                  {/* Clickable Profile Pill */}
                  <button
                    onClick={() => { playAgentChime(500); setIsDropdownOpen(!isDropdownOpen); }}
                    className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/40 text-xs font-mono transition-all group"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-lg object-cover border border-purple-500/30" />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-xs shadow-md">
                        {(user.name || 'A').charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="font-bold text-white leading-tight truncate max-w-[110px] group-hover:text-purple-300 transition-colors">
                        {user.name || 'User'}
                      </span>
                      <span className="text-[9px] text-purple-400 leading-tight truncate max-w-[110px]">
                        {user.companyName || 'Enterprise'}
                      </span>
                    </div>

                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-purple-400' : ''}`} />
                  </button>

                  {/* Modern Profile Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-800 bg-[#0B0F19]/95 shadow-2xl py-2 space-y-1 z-50 text-xs font-mono">
                      
                      {/* Header Info */}
                      <div className="px-4 py-2.5 border-b border-slate-800/80 space-y-0.5">
                        <span className="font-extrabold text-white block text-xs truncate">{user.name || 'User'}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{user.email || 'alex@sprintflow.ai'}</span>
                        <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold uppercase">
                          {user.role || 'Manager'}
                        </span>
                      </div>

                      {/* Dropdown Options */}
                      <div className="px-1 py-1 space-y-0.5">
                        <button
                          onClick={() => openProfileModal('profile')}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                        >
                          <User className="w-4 h-4 text-purple-400" />
                          <span>Edit Profile</span>
                        </button>

                        <button
                          onClick={() => openProfileModal('org')}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                        >
                          <Building className="w-4 h-4 text-cyan-400" />
                          <span>Change Organization</span>
                        </button>

                        <button
                          onClick={() => openProfileModal('settings')}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                        >
                          <Settings className="w-4 h-4 text-indigo-400" />
                          <span>Account Settings</span>
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-800/80 my-1 px-1">
                        <button
                          onClick={() => { logout(); navigate('/'); }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-bold"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Logout</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white overflow-hidden bg-slate-900 border border-purple-500/40 hover:border-purple-400 shadow-lg shadow-purple-500/10 transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Profile Edit Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTab={modalInitialTab}
      />
    </>
  );
}

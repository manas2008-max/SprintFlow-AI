import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Kanban, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  HelpCircle, 
  ArrowRight,
  Sparkles,
  CheckSquare,
  Plus
} from 'lucide-react';
import { playAgentChime } from '../utils/audio';

export default function KanbanBoard({ tasks = [], onUpdateTaskStatus }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskSubtasks, setTaskSubtasks] = useState({});

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-slate-700 bg-slate-900/40 text-slate-400' },
    { id: 'in_progress', title: 'In Progress', color: 'border-purple-500/50 bg-purple-950/20 text-purple-400' },
    { id: 'review', title: 'Review / QA', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400' }
  ];

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'High': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Medium': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const toggleSubtask = (taskId, subtaskIdx) => {
    playAgentChime(800);
    setTaskSubtasks(prev => {
      const list = prev[taskId] || [true, false];
      const updated = [...list];
      updated[subtaskIdx] = !updated[subtaskIdx];
      return { ...prev, [taskId]: updated };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Kanban className="w-5 h-5 text-indigo-400" />
            <span>Autonomous Task Allocation Board</span>
          </h3>
          <p className="text-xs text-slate-400">
            Assigned by Task Agent with candidate matching scores and rationale tooltips.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            Total Tasks: <strong className="text-white">{tasks.length}</strong>
          </span>
        </div>
      </div>

      {/* 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => (t.status || 'todo') === col.id);

          return (
            <div
              key={col.id}
              className="p-3.5 rounded-2xl glass-panel border border-slate-800/80 bg-[#0B0F19]/80 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className={`text-xs font-bold uppercase tracking-wider font-mono ${col.color.split(' ')[2]}`}>
                  {col.title}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-300">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colTasks.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl glass-card border border-slate-800 hover:border-purple-500/50 transition-all duration-200 cursor-pointer space-y-3 group"
                    onClick={() => { playAgentChime(650); setSelectedTask(t); }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-md border ${getPriorityStyle(t.priority)}`}>
                        {t.priority || 'Medium'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {t.estimatedDays || 3}d est.
                      </span>
                    </div>

                    <h5 className="font-semibold text-white text-sm group-hover:text-purple-300 transition-colors">
                      {t.title}
                    </h5>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>

                    {/* Subtask Checkoff Preview */}
                    <div className="pt-1 flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Subtasks: 2/2 Complete</span>
                    </div>

                    {/* Skill Tag & Assignee */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 truncate max-w-[110px]">
                        {t.skillRequired || 'General'}
                      </span>

                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-medium truncate max-w-[90px]">
                          {t.assignedToName || 'Unassigned'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Move Status Buttons */}
                    <div className="pt-1 flex items-center justify-between gap-1 text-[10px] opacity-80 group-hover:opacity-100 transition-opacity">
                      {col.id !== 'todo' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playAgentChime(500);
                            onUpdateTaskStatus && onUpdateTaskStatus(t.id, col.id === 'in_progress' ? 'todo' : col.id === 'review' ? 'in_progress' : 'review');
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          ← Prev
                        </button>
                      )}
                      {col.id !== 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playAgentChime(600);
                            onUpdateTaskStatus && onUpdateTaskStatus(t.id, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'review' : 'completed');
                          }}
                          className="ml-auto px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/30 transition-colors"
                        >
                          Next →
                        </button>
                      )}
                    </div>

                  </motion.div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-xs text-slate-600 font-mono">
                    Empty Stage
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Rationale & Candidate Match Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/40 bg-[#0B0F19] space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold text-white text-base">Task Agent Assignment Rationale</h4>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Task Title</span>
                <p className="font-semibold text-white text-sm">{selectedTask.title}</p>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Assigned Specialist</span>
                <p className="font-medium text-emerald-400 text-sm flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>{selectedTask.assignedToName} (Candidate Match Score: 95%)</span>
                </p>
              </div>

              {/* Subtask Checkoff List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">Interactive Subtask Checklist</span>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center space-x-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={() => toggleSubtask(selectedTask.id, 0)}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Verify primary skill token matching</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={() => toggleSubtask(selectedTask.id, 1)}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0"
                    />
                    <span>Validate zero dependency locks</span>
                  </label>
                </div>
              </div>

              {/* Rationale card */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1">
                <span className="text-xs font-semibold text-purple-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Agent Reasoning & Trade-off Analysis</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  "{selectedTask.assignmentRationale || 'Assigned automatically based on workload balancing and matching skill tags.'}"
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">Status: {selectedTask.status}</span>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

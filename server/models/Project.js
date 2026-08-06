const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  id: String,
  name: String,
  role: String,
  skills: [String],
  availability: Number, // Percentage e.g. 100
  avatar: String
});

const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  assignedTo: String,
  assignedToName: String,
  skillRequired: String,
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  estimatedDays: Number,
  milestoneId: String,
  dependencies: [String],
  assignmentRationale: String
});

const milestoneSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  durationWeeks: Number,
  deliverables: [String],
  targetDate: String
});

const riskSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String, // Deadline, Skill Gap, Budget, Dependency
  impact: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
  likelihood: { type: String, enum: ['Low', 'Medium', 'High'] },
  description: String,
  mitigationStrategy: String
});

const reportSchema = new mongoose.Schema({
  readme: String,
  meetingNotes: String,
  statusReport: String,
  presentationOutline: String,
  clientReport: String
});

const agentLogSchema = new mongoose.Schema({
  timestamp: String,
  agent: String, // Planner, Task, Risk, Coordinator, Report
  action: String,
  details: String,
  type: { type: String, enum: ['info', 'success', 'warning', 'reasoning'] }
});

const projectSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  businessType: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'High'
  },
  teamMembers: [teamMemberSchema],
  expectedDeliverables: [String],
  
  // AI Agent Generated Strategy
  status: {
    type: String,
    enum: ['draft', 'analyzing', 'planned', 'active', 'archived'],
    default: 'planned'
  },
  executiveSummary: String,
  aiConfidenceScore: { type: Number, default: 94 },
  businessHealthScore: { type: Number, default: 88 },
  milestones: [milestoneSchema],
  tasks: [taskSchema],
  risks: [riskSchema],
  recommendations: [String],
  reports: reportSchema,
  agentLogs: [agentLogSchema],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);

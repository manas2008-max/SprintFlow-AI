const { z } = require('zod');
const { getSupabase, getIsConfigured } = require('../config/supabase');
const { runMultiAgentWorkflow } = require('../services/agentEngine');

// Memory store fallback when Supabase is unconfigured
const memoryProjects = [];

// Helper to ensure user exists in Supabase users table before inserting project
async function ensureUserExistsInSupabase(supabase, userId, reqUser) {
  try {
    // 1. Check if user row exists by UUID
    const { data: userById } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (userById) return userId;

    // 2. Check if user row exists by Email (to avoid unique constraint violation)
    const cleanEmail = (reqUser?.email || '').toLowerCase().trim();
    if (cleanEmail) {
      const { data: userByEmail } = await supabase
        .from('users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (userByEmail) {
        console.log(`[Database Auto-Sync] Updating existing profile for email '${cleanEmail}' to UUID '${userId}'...`);
        // Delete old orphan row with mismatched ID and insert clean UUID record
        await supabase.from('users').delete().eq('email', cleanEmail);
      }
    }

    console.log(`[Database Auto-Sync] Creating user profile in Supabase for UUID: ${userId}...`);
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        name: reqUser?.name || 'User',
        email: cleanEmail || `user_${userId.substring(0, 8)}@sprintflow.ai`,
        password_hash: 'managed_by_supabase_auth',
        role: reqUser?.role || 'manager',
        company_name: reqUser?.companyName || 'SprintFlow Enterprise'
      }])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[Database Auto-Sync Warning] Could not auto-insert user record:', error.message);
    }
  } catch (err) {
    console.error('[Database Auto-Sync Exception]', err.message);
  }
  return userId;
}

const projectValidationSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  businessType: z.string().min(2, 'Business type is required'),
  goal: z.string().min(5, 'Project description is too short'),
  deadline: z.string().min(1, 'Target deadline is required'),
  budget: z.number().min(1000, 'Budget must be at least ₹1000'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('High'),
  teamMembers: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    role: z.string(),
    skills: z.array(z.string()),
    availability: z.number().optional()
  })).min(1, 'Please add at least one team member'),
  expectedDeliverables: z.array(z.string()).min(1, 'Please add at least one expected deliverable')
});

const createProject = async (req, res) => {
  console.log('\n=======================================================');
  console.log('[CREATE_PROJECT] 1. Incoming Request Body:');
  console.dir(req.body, { depth: null });
  console.log('=======================================================\n');

  try {
    const parseResult = projectValidationSchema.safeParse(req.body);
    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const firstErrorMsg = Object.values(fieldErrors).flat()[0] || 'Invalid project payload';
      console.error('[CREATE_PROJECT] Validation Error:', fieldErrors);
      return res.status(400).json({
        success: false,
        message: firstErrorMsg,
        errors: fieldErrors
      });
    }

    const input = parseResult.data;
    const userId = req.user.id;

    console.log(`[CREATE_PROJECT] 2. Invoking Gemini Multi-Agent Workflow for '${input.name}'...`);
    const agentStrategy = await runMultiAgentWorkflow(input);
    console.log('[CREATE_PROJECT] 2. Gemini Response Overview:');
    console.log(`- Executive Summary: ${agentStrategy.executiveSummary?.substring(0, 100)}...`);
    console.log(`- Milestones Generated: ${agentStrategy.milestones?.length || 0}`);
    console.log(`- Tasks Generated: ${agentStrategy.tasks?.length || 0}`);
    console.log(`- Risks Identified: ${agentStrategy.risks?.length || 0}`);

    if (getIsConfigured()) {
      const supabase = getSupabase();

      // Ensure valid foreign key user_id exists in users table
      await ensureUserExistsInSupabase(supabase, userId, req.user);

      // 1. Insert into projects table
      const projectRow = {
        user_id: userId,
        name: input.name,
        business_type: input.businessType,
        goal: input.goal,
        deadline: input.deadline,
        budget: input.budget,
        priority: input.priority,
        status: 'planned',
        team_members: input.teamMembers || [],
        expected_deliverables: input.expectedDeliverables || [],
        executive_summary: agentStrategy.executiveSummary,
        ai_confidence_score: agentStrategy.aiConfidenceScore || 95,
        business_health_score: agentStrategy.businessHealthScore || 91
      };

      console.log('[DATABASE_QUERY] Authorization Header before database request:', req.headers.authorization || 'Service Role Client');
      console.log('[CREATE_PROJECT] 3. Inserting into Supabase projects table...');
      const { data: savedProject, error: projErr } = await supabase
        .from('projects')
        .insert([projectRow])
        .select()
        .single();

      if (projErr) {
        console.error('[CREATE_PROJECT] 4. Supabase Error:', projErr.message);
        console.error('[CREATE_PROJECT] Detailed Error Code:', projErr.code, projErr.details);
        return res.status(400).json({
          success: false,
          message: `Supabase Database Error: ${projErr.message}`,
          errorDetails: projErr
        });
      }

      console.log('[SUPABASE_INSERT_SUCCESS] Row successfully inserted into public.projects table!');
      const projectId = savedProject.id;
      console.log(`[CREATE_PROJECT] 5. Returned Project UUID: ${projectId}`);

      // 2. Insert Timelines (Milestones)
      const milestones = agentStrategy.milestones || [];
      if (milestones.length > 0) {
        const timelineRows = milestones.map(m => ({
          project_id: projectId,
          title: m.title,
          description: m.description,
          duration_weeks: m.durationWeeks || 2,
          target_date: m.targetDate || input.deadline,
          deliverables: m.deliverables || []
        }));
        const { error: tmErr } = await supabase.from('timelines').insert(timelineRows);
        if (tmErr) console.warn('[CREATE_PROJECT] Timelines Insert Warning:', tmErr.message);
      }

      // 3. Insert Tasks
      const tasks = agentStrategy.tasks || [];
      if (tasks.length > 0) {
        const taskRows = tasks.map(t => ({
          project_id: projectId,
          title: t.title,
          description: t.description,
          assigned_to: t.assignedTo || 'tm1',
          assigned_to_name: t.assignedToName || 'Specialist',
          skill_required: t.skillRequired || 'Development',
          status: t.status || 'todo',
          priority: t.priority || 'Medium',
          estimated_days: t.estimatedDays || 3,
          assignment_rationale: t.assignmentRationale || 'Skill matching & capacity balance',
          dependencies: t.dependencies || []
        }));
        const { error: taskErr } = await supabase.from('tasks').insert(taskRows);
        if (taskErr) console.warn('[CREATE_PROJECT] Tasks Insert Warning:', taskErr.message);
      }

      // 4. Insert Risk Analysis
      const risks = agentStrategy.risks || [];
      if (risks.length > 0) {
        const riskRows = risks.map(r => ({
          project_id: projectId,
          title: r.title,
          category: r.category || 'General',
          impact: r.impact || 'High',
          likelihood: r.likelihood || 'Medium',
          description: r.description,
          mitigation_strategy: r.mitigationStrategy
        }));
        const { error: riskErr } = await supabase.from('risk_analysis').insert(riskRows);
        if (riskErr) console.warn('[CREATE_PROJECT] Risks Insert Warning:', riskErr.message);
      }

      // 5. Insert Reports
      const reportsObj = agentStrategy.reports || {};
      await supabase.from('reports').insert([{
        project_id: projectId,
        readme: reportsObj.readme || `# ${input.name}`,
        meeting_notes: reportsObj.meetingNotes || `### Kickoff Notes`,
        status_report: reportsObj.statusReport || `### Weekly Status`,
        presentation_outline: reportsObj.presentationOutline || `### Deck Outline`,
        client_report: reportsObj.clientReport || `### Client Summary`
      }]);

      // 6. Insert Activity Logs
      const logs = agentStrategy.agentLogs || [];
      if (logs.length > 0) {
        const logRows = logs.map(l => ({
          project_id: projectId,
          agent_name: l.agent,
          action: l.action,
          details: l.details,
          type: l.type || 'info',
          timestamp_str: l.timestamp || '00:00'
        }));
        await supabase.from('activity_logs').insert(logRows);
      }

      // Fetch full assembled project
      const fullProject = await fetchFullProjectFromSupabase(projectId);

      console.log(`[CREATE_PROJECT] Final Assembled Project Payload Ready for UUID: ${projectId}`);
      return res.status(201).json({
        success: true,
        message: 'Project strategy autonomously generated by AI Agents!',
        project: fullProject || savedProject
      });
    } else {
      // Memory Fallback
      const newProject = {
        ...input,
        id: 'proj_' + Math.random().toString(36).substring(2, 9),
        userId,
        status: 'planned',
        executiveSummary: agentStrategy.executiveSummary,
        aiConfidenceScore: agentStrategy.aiConfidenceScore || 94,
        businessHealthScore: agentStrategy.businessHealthScore || 90,
        milestones: agentStrategy.milestones || [],
        tasks: agentStrategy.tasks || [],
        risks: agentStrategy.risks || [],
        recommendations: agentStrategy.recommendations || [],
        reports: agentStrategy.reports || {},
        agentLogs: agentStrategy.agentLogs || [],
        createdAt: new Date().toISOString()
      };
      memoryProjects.unshift(newProject);

      console.log(`[CREATE_PROJECT] Returned Project UUID (Memory Mode): ${newProject.id}`);
      return res.status(201).json({
        success: true,
        message: 'Project strategy autonomously generated by AI Agents!',
        project: newProject
      });
    }
  } catch (error) {
    console.error('[CREATE_PROJECT Fatal Error]', error);
    return res.status(500).json({
      success: false,
      message: `Failed to generate project strategy: ${error.message}`
    });
  }
};

/**
 * GET PROJECTS - STRICT DATA ISOLATION PER AUTHENTICATED USER
 */
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[GET_PROJECTS] Querying projects for authenticated user_id: ${userId}`);

    if (getIsConfigured()) {
      const supabase = getSupabase();

      // Query ONLY projects created by this specific user
      const { data: projectRows, error } = await supabase
        .from('projects')
        .select('id, created_at, user_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[GET_PROJECTS Supabase Error]', error.message);
        throw error;
      }

      console.log(`[GET_PROJECTS] Found ${projectRows?.length || 0} isolated project records for user_id: ${userId}`);
      if (!projectRows || projectRows.length === 0) {
        return res.json({ success: true, projects: [] });
      }

      const projects = await Promise.all(
        projectRows.map(row => fetchFullProjectFromSupabase(row.id))
      );

      const validProjects = projects
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));

      return res.json({ success: true, projects: validProjects });
    } else {
      const userProjects = memoryProjects
        .filter(p => p.userId === userId)
        .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
      return res.json({ success: true, projects: userProjects });
    }
  } catch (error) {
    console.error('[GET_PROJECTS Error]', error);
    return res.json({ success: true, projects: [] });
  }
};

/**
 * GET PROJECT BY ID - STRICT OWNERSHIP CHECK
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`[GET_PROJECT_BY_ID] Looking up project UUID: '${id}' for user: ${userId}`);

    if (getIsConfigured()) {
      const project = await fetchFullProjectFromSupabase(id);
      if (!project) {
        return res.status(404).json({ success: false, message: `Project Not Found for ID: ${id}` });
      }

      // Strict Ownership Check
      if (project.userId !== userId) {
        console.warn(`[GET_PROJECT_BY_ID Access Denied] User '${userId}' attempted to access project '${id}' owned by '${project.userId}'`);
        return res.status(403).json({ success: false, message: 'Access Denied: You do not have permission to view this project.' });
      }

      return res.json({ success: true, project });
    } else {
      const project = memoryProjects.find(p => p.id === id || p._id === id);
      if (!project) {
        return res.status(404).json({ success: false, message: `Project Not Found for ID: ${id}` });
      }
      if (project.userId !== userId) {
        return res.status(403).json({ success: false, message: 'Access Denied: You do not have permission to view this project.' });
      }
      return res.json({ success: true, project });
    }
  } catch (error) {
    console.error('[GET_PROJECT_BY_ID Error]', error);
    return res.status(500).json({ success: false, message: 'Error retrieving project' });
  }
};

/**
 * UPDATE TASK STATUS - STRICT OWNERSHIP CHECK
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (getIsConfigured()) {
      const supabase = getSupabase();

      // Verify project ownership
      const { data: projectRow } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', id)
        .maybeSingle();

      if (!projectRow || projectRow.user_id !== userId) {
        return res.status(403).json({ success: false, message: 'Access Denied: You cannot modify this project.' });
      }

      await supabase
        .from('tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      const updatedProject = await fetchFullProjectFromSupabase(id);
      return res.json({ success: true, project: updatedProject });
    } else {
      const project = memoryProjects.find(p => p.id === id || p._id === id);
      if (!project || project.userId !== userId) return res.status(403).json({ success: false, message: 'Access Denied' });
      const task = project.tasks.find(t => t.id === taskId || t._id === taskId);
      if (task) task.status = status;
      return res.json({ success: true, project });
    }
  } catch (error) {
    console.error('[Update Task Error]', error);
    return res.status(500).json({ success: false, message: 'Failed to update task status' });
  }
};

/**
 * DELETE PROJECT - STRICT OWNERSHIP CHECK
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (getIsConfigured()) {
      const supabase = getSupabase();

      const { data: projectRow } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', id)
        .maybeSingle();

      if (!projectRow || projectRow.user_id !== userId) {
        return res.status(403).json({ success: false, message: 'Access Denied: You cannot delete this project.' });
      }

      await supabase.from('projects').delete().eq('id', id).eq('user_id', userId);
    } else {
      const index = memoryProjects.findIndex(p => (p.id === id || p._id === id) && p.userId === userId);
      if (index !== -1) memoryProjects.splice(index, 1);
    }
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

// Helper function to assemble project from Supabase tables
async function fetchFullProjectFromSupabase(projectId) {
  try {
    const supabase = getSupabase();

    const { data: projectRow, error: pErr } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (pErr || !projectRow) {
      console.warn(`[fetchFullProjectFromSupabase] Lookup Error for ID ${projectId}:`, pErr?.message || 'No row');
      return null;
    }

    const [
      { data: timelines },
      { data: tasks },
      { data: risks },
      { data: reportsRows },
      { data: activityLogs }
    ] = await Promise.all([
      supabase.from('timelines').select('*').eq('project_id', projectId),
      supabase.from('tasks').select('*').eq('project_id', projectId),
      supabase.from('risk_analysis').select('*').eq('project_id', projectId),
      supabase.from('reports').select('*').eq('project_id', projectId),
      supabase.from('activity_logs').select('*').eq('project_id', projectId)
    ]);

    const reportRow = reportsRows && reportsRows[0] ? reportsRows[0] : {};

    return {
      id: projectRow.id,
      userId: projectRow.user_id,
      name: projectRow.name,
      businessType: projectRow.business_type,
      goal: projectRow.goal,
      deadline: projectRow.deadline,
      budget: Number(projectRow.budget),
      priority: projectRow.priority,
      status: projectRow.status,
      teamMembers: projectRow.team_members || [],
      expectedDeliverables: projectRow.expected_deliverables || [],
      executiveSummary: projectRow.executive_summary,
      aiConfidenceScore: projectRow.ai_confidence_score || 95,
      businessHealthScore: projectRow.business_health_score || 91,

      milestones: (timelines || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        durationWeeks: t.duration_weeks,
        targetDate: t.target_date,
        deliverables: t.deliverables || []
      })),

      tasks: (tasks || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        assignedTo: t.assigned_to,
        assignedToName: t.assigned_to_name,
        skillRequired: t.skill_required,
        status: t.status,
        priority: t.priority,
        estimatedDays: t.estimated_days,
        assignmentRationale: t.assignment_rationale,
        dependencies: t.dependencies || []
      })),

      risks: (risks || []).map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        impact: r.impact,
        likelihood: r.likelihood,
        description: r.description,
        mitigationStrategy: r.mitigation_strategy
      })),

      recommendations: [
        'Deploy dedicated Redis cluster for idempotent transaction deduplication.',
        'Enforce automated linting for PCI-DSS data leakage in repository CI/CD.'
      ],

      reports: {
        readme: reportRow.readme || `# ${projectRow.name}`,
        meetingNotes: reportRow.meeting_notes || `### Kickoff Notes`,
        statusReport: reportRow.status_report || `### Weekly Status`,
        presentationOutline: reportRow.presentation_outline || `### Presentation Deck`,
        clientReport: reportRow.client_report || `### Client Summary`
      },

      agentLogs: (activityLogs || []).map(l => ({
        timestamp: l.timestamp_str || '00:00',
        agent: l.agent_name,
        action: l.action,
        details: l.details,
        type: l.type || 'info'
      })),

      createdAt: projectRow.created_at
    };
  } catch (err) {
    console.error('[fetchFullProjectFromSupabase Error]', err.message);
    return null;
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateTaskStatus,
  deleteProject
};

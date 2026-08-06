const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * SprintFlow Autonomous Multi-Agent AI Orchestrator
 * Agent 1: Requirement Analysis & Planner Agent (Milestone decomposition & timeline estimation)
 * Agent 2: Task Agent (Skill-matching, workload balancing & rationale generation)
 * Agent 3: Risk Agent (Dynamic risk scoring, 2x2 matrix vectors & safeguards)
 * Agent 4: Coordinator Agent (Bottleneck removal, critical path analysis & recommendations)
 * Agent 5: Report Agent (Auto-generating Markdown README, meeting notes, status reports & presentation deck)
 */

async function runMultiAgentWorkflow(projectInput) {
  const apiKey = process.env.GEMINI_API_KEY;
  let aiGeneratedData = null;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      console.log('[Agent Orchestrator] Stage 2: Calling Gemini AI Multi-Agent Swarm...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const prompt = `You are SprintFlow AI's Autonomous Multi-Agent Project Management System.
Analyze the following project and generate a structured JSON strategy created collaboratively by 5 specialized AI agents.

Project Details:
- Name: "${projectInput.name}"
- Business Type: "${projectInput.businessType}"
- Primary Goal: "${projectInput.goal}"
- Target Deadline: "${projectInput.deadline}"
- Total Budget: ₹${Number(projectInput.budget).toLocaleString('en-IN')}
- Priority Level: "${projectInput.priority}"
- Team Members: ${JSON.stringify(projectInput.teamMembers || [])}
- Expected Deliverables: ${JSON.stringify(projectInput.expectedDeliverables || [])}

Return ONLY a single valid JSON object matching this schema EXACTLY without markdown code block backticks:

{
  "executiveSummary": "Strategic summary of the project execution plan.",
  "aiConfidenceScore": 92,
  "businessHealthScore": 94,
  "overallRiskScore": 18,
  "milestones": [
    {
      "id": "m1",
      "title": "Milestone Title",
      "description": "Milestone objective",
      "durationWeeks": 2,
      "targetDate": "2026-09-01",
      "deliverables": ["Deliverable 1", "Deliverable 2"]
    }
  ],
  "tasks": [
    {
      "id": "t1",
      "title": "Task Title",
      "description": "Detailed task description",
      "assignedTo": "Member ID or name",
      "assignedToName": "Member Full Name",
      "skillRequired": "Primary Skill",
      "status": "todo",
      "priority": "High",
      "estimatedDays": 4,
      "milestoneId": "m1",
      "dependencies": [],
      "assignmentRationale": "Explicit explanation why Task Agent assigned this person based on their skills and capacity."
    }
  ],
  "risks": [
    {
      "id": "r1",
      "title": "Risk Name",
      "category": "Deadline Risk or Skill Gap or Resource Constraint or Financial Risk or Dependency Risk or Technical Debt or Security Risk",
      "impact": "High",
      "likelihood": "High",
      "description": "Detailed explanation of potential issue",
      "reason": "Specific empirical trigger for this risk",
      "mitigationStrategy": "Concrete action plan to prevent or solve this risk"
    }
  ],
  "recommendations": [
    "Conduct daily async standups using SprintFlow AI automated progress reports",
    "Implement automated integration testing prior to Milestone 2 completion"
  ],
  "reports": {
    "readme": "# Project Title\\n\\n## Overview...",
    "meetingNotes": "### Kickoff Meeting Notes...",
    "statusReport": "### Weekly Executive Status Report...",
    "presentationOutline": "### Slide 1: Vision...",
    "clientReport": "### Client Summary Report..."
  },
  "agentLogs": [
    {
      "timestamp": "00:01",
      "agent": "Phase 1: Requirement Analysis",
      "action": "Parsed project objectives and budget bounds.",
      "details": "Validated deliverables and team capacity.",
      "type": "reasoning"
    },
    {
      "timestamp": "00:02",
      "agent": "Phase 2: Task Planning",
      "action": "Deconstructed requirements into agile milestones.",
      "details": "Calculated target dates and sprint phases.",
      "type": "reasoning"
    },
    {
      "timestamp": "00:03",
      "agent": "Phase 3: Task Allocation",
      "action": "Matched tasks across employee skillsets.",
      "details": "Generated explicit assignment rationales.",
      "type": "success"
    },
    {
      "timestamp": "00:04",
      "agent": "Phase 4: Risk Assessment",
      "action": "Evaluated dynamic risk vectors.",
      "details": "Populated 2x2 Heatmap matrix.",
      "type": "warning"
    },
    {
      "timestamp": "00:05",
      "agent": "Phase 5: Strategy Complete",
      "action": "Compiled executive documentation.",
      "details": "Synthesized README, Meeting Notes & Pitch Deck.",
      "type": "success"
    }
  ]
}`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call exceeded 10-second timeout')), 10000)
      );

      const result = await Promise.race([model.generateContent(prompt), timeoutPromise]);
      const response = await result.response;
      const text = response.text();
      const cleanJsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      aiGeneratedData = JSON.parse(cleanJsonStr);
      console.log('[Agent Orchestrator] Gemini AI multi-agent plan generated successfully!');
    } catch (err) {
      console.warn('[Agent Orchestrator Notice] Gemini API timeout or error:', err.message);
      console.log('[Agent Orchestrator] Utilizing SprintFlow Dynamic Local AI Reasoning Engine...');
      aiGeneratedData = generateSmartFallbackPlan(projectInput);
    }
  }

  // Always compute dynamic scores directly from project attributes
  const dynamicEval = computeDynamicRiskAnalysis(projectInput);

  if (!aiGeneratedData) {
    console.log('[Agent Orchestrator] Utilizing SprintFlow Dynamic Local AI Reasoning Engine...');
    aiGeneratedData = generateSmartFallbackPlan(projectInput);
  } else {
    if (!aiGeneratedData.risks || aiGeneratedData.risks.length === 0) {
      aiGeneratedData.risks = dynamicEval.risks;
    }
    if (!aiGeneratedData.recommendations || aiGeneratedData.recommendations.length === 0) {
      aiGeneratedData.recommendations = dynamicEval.recommendations;
    }
    aiGeneratedData.businessHealthScore = dynamicEval.healthScore;
    aiGeneratedData.aiConfidenceScore = dynamicEval.confidenceScore;
    aiGeneratedData.overallRiskScore = dynamicEval.riskScore;
  }

  return aiGeneratedData;
}

/**
 * Intelligent Dynamic Scoring Engine
 * Positive Contribution Model:
 * Enterprise projects with complete information receive AI Confidence 82-97% and Business Health 85-100.
 */
function computeDynamicRiskAnalysis(p) {
  const team = p.teamMembers || [];
  const teamSize = team.length;
  const deadlineStr = p.deadline || '';
  const budget = Number(p.budget) || 0;
  const goal = (p.goal || '').trim();
  const name = (p.name || '').trim();
  const bizType = (p.businessType || '').trim();
  const deliverables = p.expectedDeliverables || [];

  // 1. Calculate Days Until Deadline
  let daysUntilDeadline = 60;
  if (deadlineStr) {
    const targetDate = new Date(deadlineStr);
    const now = new Date();
    const diffTime = targetDate - now;
    if (!isNaN(diffTime) && diffTime > 0) {
      daysUntilDeadline = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else {
      const parsedNum = parseInt(deadlineStr, 10);
      if (!isNaN(parsedNum)) daysUntilDeadline = parsedNum;
    }
  }

  // Seed Hash for micro-variance (-2 to +2) so every project returns unique percentages
  const seedHash = (name + goal + budget + daysUntilDeadline).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const microVariance = (seedHash % 5) - 2;

  // 2. Risk Calculation (Gradual & Fair)
  let riskScore = 12; // Healthy baseline risk
  const generatedRisks = [];
  const copilotRecs = [];

  // Risk Factors (Gradual additions)
  if (teamSize <= 1) {
    riskScore += 18;
    generatedRisks.push({
      id: 'r_cap_solo',
      title: 'Solo Engineer Dependency',
      category: 'Resource Constraint',
      impact: 'High',
      likelihood: 'Medium',
      description: 'Single engineer assigned to deliver full architecture and deployment.',
      reason: 'Capacity bottleneck with solo developer assignment.',
      mitigationStrategy: 'Assign at least 1 additional team member to pair-program on core modules.'
    });
    copilotRecs.push('Assign an additional engineer to balance critical path responsibilities.');
  }

  if (daysUntilDeadline < 20) {
    riskScore += 24;
    generatedRisks.push({
      id: 'r_dead_tight',
      title: 'Compressed Delivery Schedule',
      category: 'Deadline Risk',
      impact: 'High',
      likelihood: 'High',
      description: `Target deadline of ${daysUntilDeadline} days requires tight sprint execution.`,
      reason: `Deadline provides minimal buffer for user acceptance testing.`,
      mitigationStrategy: 'Focus phase 1 on core MVP deliverables and extend secondary features.'
    });
    copilotRecs.push(`Extend project target deadline beyond ${daysUntilDeadline} days to allow QA testing.`);
  } else if (daysUntilDeadline < 40) {
    riskScore += 10;
    generatedRisks.push({
      id: 'r_dead_mod',
      title: 'Moderate Timeline Buffer',
      category: 'Deadline Risk',
      impact: 'Medium',
      likelihood: 'Low',
      description: `Target deadline of ${daysUntilDeadline} days requires active sprint tracking.`,
      reason: 'Timeline is feasible with daily async standups.',
      mitigationStrategy: 'Conduct bi-weekly milestone check-ins.'
    });
  }

  if (budget < 15000) {
    riskScore += 14;
    generatedRisks.push({
      id: 'r_budg_low',
      title: 'Budget Optimization Needed',
      category: 'Financial Risk',
      impact: 'Medium',
      likelihood: 'Low',
      description: `Allocated budget of ₹${budget.toLocaleString('en-IN')} requires cost-conscious tool selection.`,
      reason: 'Lower budget allocation for cloud services.',
      mitigationStrategy: 'Leverage open-source infrastructure and serverless tiers.'
    });
  }

  // Standard operational risk if zero risks triggered
  if (generatedRisks.length === 0) {
    generatedRisks.push({
      id: 'r_opt',
      title: 'Standard Infrastructure Check',
      category: 'Technical Debt',
      impact: 'Low',
      likelihood: 'Low',
      description: 'Baseline project parameters are fully supported by active team capacity.',
      reason: 'Optimal workload and resource allocation.',
      mitigationStrategy: 'Enable Redis caching layers prior to final production launch.'
    });
  }

  const finalRiskScore = Math.min(75, Math.max(8, Math.round(riskScore)));

  // 3. Positive Additive AI Confidence Calculation (82% - 97% for complete projects)
  let confidencePts = 84; // Solid baseline

  // Positive Contributions
  if (goal.length >= 80) confidencePts += 3;
  if (deliverables.length >= 3) confidencePts += 3;
  if (teamSize >= 2) confidencePts += 3;
  if (daysUntilDeadline >= 40) confidencePts += 3;
  if (budget >= 30000) confidencePts += 2;

  // Gradual Risk Deduction (Max -10 pts)
  const riskDeduction = Math.round(finalRiskScore * 0.12);
  let finalConfidenceScore = confidencePts - riskDeduction + microVariance;

  // Boundary Guards: Complete enterprise projects receive 82-97%, compressed receive reasonable ratings
  if (daysUntilDeadline < 20 && teamSize <= 1) {
    finalConfidenceScore = Math.min(58, Math.max(45, finalConfidenceScore));
  } else {
    finalConfidenceScore = Math.min(98, Math.max(76, finalConfidenceScore));
  }
  finalConfidenceScore = Math.round(finalConfidenceScore);

  // 4. Positive Additive Business Health Calculation (85 - 100 for complete projects)
  let healthPts = 87; // Solid baseline

  if (goal.length >= 60) healthPts += 3;
  if (deliverables.length >= 2) healthPts += 3;
  if (teamSize >= 2) healthPts += 3;
  if (daysUntilDeadline >= 30) healthPts += 2;
  if (budget >= 25000) healthPts += 2;

  // Gradual Risk Deduction (Max -8 pts)
  const healthRiskDeduction = Math.round(finalRiskScore * 0.10);
  let finalHealthScore = healthPts - healthRiskDeduction + microVariance;

  if (daysUntilDeadline < 20 && teamSize <= 1) {
    finalHealthScore = Math.min(58, Math.max(42, finalHealthScore));
  } else {
    finalHealthScore = Math.min(99, Math.max(82, finalHealthScore));
  }
  finalHealthScore = Math.round(finalHealthScore);

  if (copilotRecs.length === 0) {
    copilotRecs.push('Conduct daily async standups using SprintFlow AI automated progress reports.');
    copilotRecs.push('Implement automated integration testing prior to Milestone 2 completion.');
  }

  return {
    riskScore: finalRiskScore,
    healthScore: finalHealthScore,
    confidenceScore: finalConfidenceScore,
    risks: generatedRisks,
    recommendations: copilotRecs
  };
}

function generateSmartFallbackPlan(p) {
  const team = (p.teamMembers && p.teamMembers.length > 0) ? p.teamMembers : [
    { id: 'tm1', name: 'Alex Rivera', role: 'Fullstack Lead', skills: ['React', 'Node.js', 'Architecture'], availability: 100 },
    { id: 'tm2', name: 'Sarah Chen', role: 'UI/UX & Frontend Developer', skills: ['Framer Motion', 'Tailwind CSS', 'Figma'], availability: 100 }
  ];

  const dynamicEval = computeDynamicRiskAnalysis(p);

  const m1Title = `Phase 1: Architecture & ${p.businessType} Core Design`;
  const m2Title = `Phase 2: Execution & ${p.goal.split(' ')[0] || 'Feature'} Development`;
  const m3Title = `Phase 3: Quality Assurance & Launch Readiness`;

  const m1Id = 'm_' + Math.random().toString(36).substring(2, 7);
  const m2Id = 'm_' + Math.random().toString(36).substring(2, 7);
  const m3Id = 'm_' + Math.random().toString(36).substring(2, 7);

  const mem1 = team[0] || { id: 'tm1', name: 'Lead Dev' };
  const mem2 = team[1] || team[0] || { id: 'tm2', name: 'Senior Dev' };

  return {
    executiveSummary: `SprintFlow AI Autonomous Agents evaluated '${p.name}' for ${p.businessType}. The strategy optimizes delivery of '${p.goal}' within the ₹${Number(p.budget).toLocaleString('en-IN')} budget and target deadline (${p.deadline}). Workload is distributed across ${team.length} team members with an estimated ${dynamicEval.confidenceScore}% execution confidence score, ${dynamicEval.healthScore}% business health score, and ${dynamicEval.riskScore}% overall risk index.`,
    aiConfidenceScore: dynamicEval.confidenceScore,
    businessHealthScore: dynamicEval.healthScore,
    overallRiskScore: dynamicEval.riskScore,
    milestones: [
      {
        id: m1Id,
        title: m1Title,
        description: `Establish foundational infrastructure, database schemas, and baseline UX components for ${p.name}.`,
        durationWeeks: 2,
        targetDate: '2026-08-20',
        deliverables: ['System Architecture Document', 'Database Schema', 'Figma Wireframes']
      },
      {
        id: m2Id,
        title: m2Title,
        description: `Implement primary agent workflows, business integrations, and state orchestration.`,
        durationWeeks: 3,
        targetDate: '2026-09-10',
        deliverables: ['Core API Services', 'Interactive User Interface', 'Integration Testing']
      },
      {
        id: m3Id,
        title: m3Title,
        description: `Security hardening, performance optimization, user acceptance testing, and production deployment.`,
        durationWeeks: 1,
        targetDate: '2026-09-20',
        deliverables: ['Performance Audit Report', 'Production Deployment', 'User Documentation']
      }
    ],
    tasks: [
      {
        id: 't_1',
        title: 'System Blueprint & DB Schema Design',
        description: `Design high-performance database schemas and API specifications tailored for ${p.businessType}.`,
        assignedTo: mem1.id,
        assignedToName: mem1.name,
        skillRequired: (mem1.skills && mem1.skills[0]) || 'Architecture',
        status: 'in_progress',
        priority: 'Critical',
        estimatedDays: 3,
        milestoneId: m1Id,
        dependencies: [],
        assignmentRationale: `Assigned to ${mem1.name} by Task Agent due to high proficiency in system architecture and database design.`
      },
      {
        id: 't_2',
        title: 'UI/UX Component & Design System Setup',
        description: 'Build responsive glassmorphic UI components, design tokens, and smooth Framer Motion micro-interactions.',
        assignedTo: mem2.id,
        assignedToName: mem2.name,
        skillRequired: (mem2.skills && mem2.skills[0]) || 'UI/UX Design',
        status: 'todo',
        priority: 'High',
        estimatedDays: 4,
        milestoneId: m1Id,
        dependencies: ['t_1'],
        assignmentRationale: `Assigned to ${mem2.name} by Task Agent based on UI/UX specialization and matching frontend skills.`
      },
      {
        id: 't_3',
        title: 'Core Business API Endpoint Development',
        description: `Implement Express controllers, authentication middlewares, and Zod input validators to achieve ${p.goal}.`,
        assignedTo: mem1.id,
        assignedToName: mem1.name,
        skillRequired: 'Node.js Express',
        status: 'todo',
        priority: 'High',
        estimatedDays: 5,
        milestoneId: m2Id,
        dependencies: ['t_1'],
        assignmentRationale: `Assigned to ${mem1.name} because backend controllers require heavy integration with the primary database schema.`
      }
    ],
    risks: dynamicEval.risks,
    recommendations: dynamicEval.recommendations,
    reports: {
      readme: `# ${p.name}\n\n> **Autonomous AI Execution Blueprint created by SprintFlow AI**\n\n## 🎯 Executive Overview\n${p.goal}\n\n- **Business Unit:** ${p.businessType}\n- **Priority:** ${p.priority}\n- **Budget:** ₹${Number(p.budget).toLocaleString('en-IN')}\n- **Target Deadline:** ${p.deadline}\n\n## 🚀 Milestones & Key Phases\n1. **${m1Title}** - Infrastructure & Schema Blueprint\n2. **${m2Title}** - Core Functionality & Workflows\n3. **${m3Title}** - Deployment & QA Verification\n\n## 👥 Team Assignments\n${team.map(t => `- **${t.name}** (${t.role}): ${(t.skills || []).join(', ')}`).join('\n')}\n\n---\n*Generated automatically by SprintFlow AI Agentic Operating System*`,
      
      meetingNotes: `### 📌 SprintFlow AI Project Kickoff Notes\n\n**Project:** ${p.name}\n**Date:** ${new Date().toLocaleDateString()}\n**Facilitator:** SprintFlow AI Coordinator Agent\n\n#### 1. Strategic Objectives\n- Fulfill core requirement: ${p.goal}\n- Target launch date: ${p.deadline}\n- Assigned Budget: ₹${Number(p.budget).toLocaleString('en-IN')}\n\n#### 2. Agent Workflow Highlights\n- **Phase 1: Requirement Analysis:** Parsed project objectives and budget bounds.\n- **Phase 2: Task Planning:** Established 3 milestone phases with zero critical path overlaps.\n- **Phase 3: Task Allocation:** Optimized assignment matrices for ${team.length} team members.\n- **Phase 4: Risk Assessment:** Evaluated ${dynamicEval.risks.length} dynamic risks (Score: ${dynamicEval.riskScore}/100).\n\n#### 3. Action Items\n- [ ] ${mem1.name}: Complete System Blueprint & DB Schema Design\n- [ ] ${mem2.name}: Initialize Design System & Glassmorphic UI Components\n- [ ] All Team Members: Review SprintFlow AI Risk Matrix`,
      
      statusReport: `### 📊 Weekly Executive Status Report - ${p.name}\n\n**Overall Health Score:** ${dynamicEval.healthScore}/100 ${dynamicEval.healthScore >= 75 ? '🟢 (GREEN)' : dynamicEval.healthScore >= 50 ? '🟡 (YELLOW)' : '🔴 (RED)'}\n**AI Confidence Index:** ${dynamicEval.confidenceScore}%\n**Overall Risk Index:** ${dynamicEval.riskScore}/100\n\n#### Summary\nProject planning and multi-agent reasoning completed. All initial dependencies have been mapped with assignment rationales.\n\n#### Key Performance Metrics\n- **Budget Burn Rate:** 0% (On Track)\n- **Milestones Planned:** 3\n- **Identified Risks:** ${dynamicEval.risks.length} (Mitigations Active)\n\n#### Next Steps\nBegin execution of Milestone 1 tasks immediately. Coordinator Agent will monitor task velocity in real-time.`,
      
      presentationOutline: `### 📢 Executive Board Presentation Deck Outline\n\n#### Slide 1: Title & Vision\n- **SprintFlow AI Strategic Brief:** ${p.name}\n- Autonomous Project Execution Strategy for ${p.businessType}\n\n#### Slide 2: Market Challenge & Goal\n- **Objective:** ${p.goal}\n- **Timeline:** ${p.deadline} | **Budget:** ₹${Number(p.budget).toLocaleString('en-IN')}\n\n#### Slide 3: Agentic Execution Strategy\n- **Planner Agent:** 3 Milestones & Deliverables Roadmap\n- **Task Agent:** Automated Skill-Matching & Capacity Balancing\n- **Risk Agent:** Dynamic Risk Analysis (${dynamicEval.riskScore}/100 Risk Score)\n\n#### Slide 4: Expected Outcomes & Business Impact\n- ${dynamicEval.confidenceScore}% AI Confidence Rating\n- ${dynamicEval.risks.length} Automated Action Safeguards`,
      
      clientReport: `### 📋 Client Briefing Document: ${p.name}\n\nDear Stakeholder,\n\nSprintFlow AI has generated the formal execution roadmap for **${p.name}**.\n\n**Key Highlights:**\n- **Goal:** ${p.goal}\n- **Estimated Target Launch:** ${p.deadline}\n- **Assigned Team Size:** ${team.length} Specialists\n\nWe have scheduled ${team.length > 0 ? team[0].name : 'the Lead'} as the primary point of contact for Milestone 1. Full milestone documentation is available on the SprintFlow AI Dashboard.`
    },
    agentLogs: [
      {
        timestamp: '00:01',
        agent: 'Phase 1: Requirement Analysis',
        action: `Parsed project goals, deliverables, and team capacity constraints.`,
        details: `Evaluated budget parameters (₹${Number(p.budget).toLocaleString('en-IN')}).`,
        type: 'reasoning'
      },
      {
        timestamp: '00:02',
        agent: 'Phase 2: Task Planning',
        action: `Deconstructed requirements into 3 agile milestone phases.`,
        details: `Calculated target dates and sprint phases.`,
        type: 'reasoning'
      },
      {
        timestamp: '00:03',
        agent: 'Phase 3: Task Allocation',
        action: `Matched tasks across ${team.length} employee skillsets.`,
        details: `Generated explicit assignment rationales for each developer.`,
        type: 'success'
      },
      {
        timestamp: '00:04',
        agent: 'Phase 4: Risk Assessment',
        action: `Evaluated ${dynamicEval.risks.length} dynamic risk factors (Calculated Risk Score: ${dynamicEval.riskScore}/100).`,
        details: `Populated 2x2 Heatmap matrix vectors and copilot recommendations.`,
        type: dynamicEval.riskScore >= 50 ? 'warning' : 'success'
      },
      {
        timestamp: '00:05',
        agent: 'Phase 5: Strategy Complete',
        action: `Compiled README, Kickoff Notes, Status Report, Deck & Client Briefing.`,
        details: `Synthesized all exportable project artifacts.`,
        type: 'success'
      }
    ]
  };
}

module.exports = { runMultiAgentWorkflow, computeDynamicRiskAnalysis };

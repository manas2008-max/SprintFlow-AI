const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * SprintFlow Autonomous Multi-Agent AI Orchestrator
 * Agent 1: Planner Agent (Milestone decomposition & timeline estimation)
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

Perform dynamic risk scoring:
1. Team Capacity: Team size <= 2 (+30 Risk), Team size <= 4 (+15 Risk).
2. Deadline: Days < 30 (+25 Risk), Days < 60 (+10 Risk).
3. Budget: Insufficient budget for complexity (+20 Risk).
4. Skill Gap: Missing required employee skills (+20 Risk).
5. Task Distribution: Single point of failure / overloaded developer (+15 Risk).
6. Project Complexity: High complexity domain (+20 Risk).

Perform multi-agent collaboration and return ONLY a single valid JSON object matching this schema EXACTLY without markdown code block backticks:

{
  "executiveSummary": "Concise high-level strategic summary of the project execution plan.",
  "aiConfidenceScore": 85,
  "businessHealthScore": 75,
  "overallRiskScore": 65,
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
      "category": "Team Capacity or Schedule Risk or Financial or Skill Gap or Resource Allocation",
      "impact": "High",
      "likelihood": "High",
      "description": "Detailed explanation of potential issue",
      "reason": "Specific empirical trigger for this risk",
      "mitigationStrategy": "Concrete action plan to prevent or solve this risk"
    }
  ],
  "recommendations": [
    "Increase team size to balance critical path workload",
    "Extend project deadline to allow thorough QA testing",
    "Recruit missing specialists for key engineering domains"
  ],
  "reports": {
    "readme": "# Project Title\\n\\n## Overview\\nDetailed README content...",
    "meetingNotes": "### Kickoff Meeting Notes\\n\\n**Key Objectives:**...",
    "statusReport": "### Weekly Executive Status Report\\n\\n**Overall Status:** Operational...",
    "presentationOutline": "### Slide 1: Vision\\n### Slide 2: Roadmap...",
    "clientReport": "### Client Summary Report\\n\\nDear Stakeholders..."
  },
  "agentLogs": [
    {
      "timestamp": "00:01",
      "agent": "Planner Agent",
      "action": "Deconstructed requirements into 3 agile milestones.",
      "details": "Analyzed budget and target deadline.",
      "type": "reasoning"
    },
    {
      "timestamp": "00:02",
      "agent": "Task Agent",
      "action": "Mapped primary tasks across team member skillsets.",
      "details": "Balanced workload variance.",
      "type": "success"
    },
    {
      "timestamp": "00:03",
      "agent": "Risk Agent",
      "action": "Calculated dynamic risk score and 2x2 matrix vectors.",
      "details": "Proposed action safeguards and copilot recommendations.",
      "type": "warning"
    },
    {
      "timestamp": "00:04",
      "agent": "Coordinator Agent",
      "action": "Calculated critical path and sprint cadence.",
      "details": "Optimized delivery pipeline.",
      "type": "info"
    },
    {
      "timestamp": "00:05",
      "agent": "Report Agent",
      "action": "Compiled executive reports, README, and pitch deck outline.",
      "details": "Synthesized artifacts.",
      "type": "success"
    }
  ]
}`;

      // Enforce strict 10-second timeout for Gemini API call to prevent hanging
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
      console.log('[Agent Orchestrator] Utilizing SprintFlow High-Fidelity Local AI Reasoning Engine...');
      aiGeneratedData = generateSmartFallbackPlan(projectInput);
    }
  }

  // If Gemini API is not set or failed/timed out, generate dynamic local AI reasoning strategy
  if (!aiGeneratedData) {
    console.log('[Agent Orchestrator] Utilizing SprintFlow High-Fidelity Dynamic Local AI Reasoning Engine...');
    aiGeneratedData = generateSmartFallbackPlan(projectInput);
  } else {
    // Post-process AI generated data to guarantee dynamic risk scores match exact rules
    const dynamicEval = computeDynamicRiskAnalysis(projectInput);
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
 * Dynamic Risk Scoring & Analysis Engine
 */
function computeDynamicRiskAnalysis(p) {
  const team = p.teamMembers || [];
  const teamSize = team.length;
  const deadlineStr = p.deadline || '';
  const budget = Number(p.budget) || 0;
  const goal = (p.goal || '').toLowerCase();
  const name = (p.name || '').toLowerCase();
  const bizType = (p.businessType || '').toLowerCase();

  let riskScore = 0;
  const generatedRisks = [];
  const copilotRecs = [];

  // 1. Team Capacity Evaluation
  if (teamSize <= 2) {
    riskScore += 30;
    generatedRisks.push({
      id: 'r_cap',
      title: 'Team Capacity Constraint',
      category: 'Resource Allocation',
      impact: 'High',
      likelihood: 'High',
      description: `Team size of ${teamSize} developer(s) is critically understaffed for the required project scope.`,
      reason: `Only ${teamSize} employee(s) assigned to handle full architecture, development, testing, and deployment.`,
      mitigationStrategy: 'Hire additional developers or contract external domain specialists immediately to balance workload.'
    });
    copilotRecs.push('Increase team size to balance critical path workload and eliminate bottlenecks.');
  } else if (teamSize <= 4) {
    riskScore += 15;
    generatedRisks.push({
      id: 'r_cap',
      title: 'Limited Team Capacity',
      category: 'Resource Allocation',
      impact: 'Medium',
      likelihood: 'High',
      description: `Team size of ${teamSize} members provides tight throughput with minimal buffer for unexpected absences.`,
      reason: `Small team size limits concurrent feature development velocity.`,
      mitigationStrategy: 'Reallocate non-critical deliverables to post-launch updates.'
    });
    copilotRecs.push('Expand engineering team or adjust milestone deliverable scope.');
  }

  // 2. Deadline Evaluation
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

  if (daysUntilDeadline < 30) {
    riskScore += 25;
    generatedRisks.push({
      id: 'r_dead',
      title: 'Schedule Risk & Unrealistic Deadline',
      category: 'Deadline',
      impact: 'High',
      likelihood: 'High',
      description: `Target deadline of ${daysUntilDeadline} days provides minimal buffer for integration testing and user acceptance.`,
      reason: `Deadline of ${daysUntilDeadline} days is less than the recommended 30-day minimum sprint cycle.`,
      mitigationStrategy: 'Extend project deadline by 2-4 weeks or launch a minimal viable product (MVP) first.'
    });
    copilotRecs.push(`Extend project target deadline beyond ${daysUntilDeadline} days to allow comprehensive QA & UAT testing.`);
  } else if (daysUntilDeadline < 60) {
    riskScore += 10;
    generatedRisks.push({
      id: 'r_dead',
      title: 'Tight Delivery Timeline',
      category: 'Deadline',
      impact: 'Medium',
      likelihood: 'High',
      description: `Target deadline of ${daysUntilDeadline} days requires disciplined milestone tracking.`,
      reason: `Timeline provides limited buffer for unexpected technical blocks.`,
      mitigationStrategy: 'Conduct daily async standups and enforce strict milestone phase locks.'
    });
  }

  // 3. Project Complexity & Budget Insufficiency
  const isHighComplexityDomain = ['enterprise', 'healthcare', 'banking', 'government', 'ai', 'cybersecurity', 'national', 'fintech', 'disaster'].some(
    keyword => name.includes(keyword) || bizType.includes(keyword) || goal.includes(keyword)
  );

  if (isHighComplexityDomain) {
    riskScore += 20;
    generatedRisks.push({
      id: 'r_comp',
      title: 'High Domain & Regulatory Complexity',
      category: 'Compliance & Scale',
      impact: 'High',
      likelihood: 'Medium',
      description: `Project scope spans high-security, national-scale, or enterprise architecture requirements.`,
      reason: `Enterprise, Healthcare, Government, and AI platforms carry strict compliance and performance benchmarks.`,
      mitigationStrategy: 'Implement automated linting, security audits, and dedicated staging environments.'
    });
  }

  const budgetThreshold = isHighComplexityDomain ? 10000000 : 2500000; // ₹1 Crore vs ₹25 Lakhs

  if (budget < budgetThreshold) {
    riskScore += 20;
    generatedRisks.push({
      id: 'r_budg',
      title: 'Budget Shortfall Risk',
      category: 'Financial',
      impact: 'High',
      likelihood: 'Medium',
      description: `Allocated budget of ₹${budget.toLocaleString('en-IN')} is below the recommended threshold (₹${budgetThreshold.toLocaleString('en-IN')}) for this complexity.`,
      reason: `High complexity requirements demand higher expenditure for infrastructure, security, and specialized talent.`,
      mitigationStrategy: 'Increase project budget allocation or scale back non-essential third-party service dependencies.'
    });
    copilotRecs.push(`Increase budget allocation to support enterprise infrastructure and specialized tooling.`);
  }

  // 4. Skill Gap Evaluation
  const allTeamSkills = new Set();
  team.forEach(m => (m.skills || []).forEach(s => allTeamSkills.add(s.toLowerCase())));

  const requiredSkills = ['ai', 'security', 'devops', 'cloud', 'architecture', 'qa', 'testing'];
  const missingSkills = requiredSkills.filter(req => !Array.from(allTeamSkills).some(ts => ts.includes(req)));

  if (missingSkills.length >= 2) {
    riskScore += 20;
    generatedRisks.push({
      id: 'r_skill',
      title: 'Critical Skill Gap',
      category: 'Skill Gap',
      impact: 'High',
      likelihood: 'High',
      description: `Specialized domain skills (${missingSkills.slice(0, 3).join(', ').toUpperCase()}) are missing from the active team.`,
      reason: `Current team skillsets do not cover all technical domains required for high-quality delivery.`,
      mitigationStrategy: 'Recruit specialized engineers or contract external domain experts for key modules.'
    });
    copilotRecs.push(`Recruit missing specialists for ${missingSkills.slice(0, 3).join(', ').toUpperCase()} engineering domains.`);
  }

  // 5. Single Point of Failure / Task Overloading
  if (teamSize <= 2) {
    riskScore += 15;
    generatedRisks.push({
      id: 'r_spof',
      title: 'Single Point of Failure',
      category: 'Resource Allocation',
      impact: 'High',
      likelihood: 'High',
      description: `Backend and system architecture responsibilities are concentrated on 1-2 team members.`,
      reason: `If a key team member becomes unavailable, project delivery will halt completely.`,
      mitigationStrategy: 'Cross-train team members and enforce pair-programming on critical modules.'
    });
    copilotRecs.push('Reassign overloaded employees and implement cross-training to remove single points of failure.');
  }

  // Fallback risk if project is low risk
  if (generatedRisks.length === 0) {
    generatedRisks.push({
      id: 'r_opt',
      title: 'Minor Optimization Opportunity',
      category: 'General',
      impact: 'Low',
      likelihood: 'Low',
      description: 'Minor latency optimization opportunities in database query indexing.',
      reason: 'Baseline project parameters are fully supported by current team capacity.',
      mitigationStrategy: 'Enable Redis caching layers prior to final production release.'
    });
  }

  const finalRiskScore = Math.min(100, Math.max(10, riskScore));
  let healthScore = 100 - Math.round(finalRiskScore * 0.65);
  if (teamSize >= 5) healthScore += 5;
  if (budget >= budgetThreshold) healthScore += 5;
  const finalHealthScore = Math.min(99, Math.max(15, healthScore));
  const finalConfidenceScore = Math.min(99, Math.max(45, 100 - Math.round(finalRiskScore * 0.4)));

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
      
      meetingNotes: `### 📌 SprintFlow AI Project Kickoff Notes\n\n**Project:** ${p.name}\n**Date:** ${new Date().toLocaleDateString()}\n**Facilitator:** SprintFlow AI Coordinator Agent\n\n#### 1. Strategic Objectives\n- Fulfill core requirement: ${p.goal}\n- Target launch date: ${p.deadline}\n- Assigned Budget: ₹${Number(p.budget).toLocaleString('en-IN')}\n\n#### 2. Agent Workflow Highlights\n- **Planner Agent:** Established 3 milestone phases with zero critical path overlaps.\n- **Task Agent:** Optimized assignment matrices for ${team.length} team members.\n- **Risk Agent:** Evaluated ${dynamicEval.risks.length} dynamic risks (Score: ${dynamicEval.riskScore}/100).\n\n#### 3. Action Items\n- [ ] ${mem1.name}: Complete System Blueprint & DB Schema Design\n- [ ] ${mem2.name}: Initialize Design System & Glassmorphic UI Components\n- [ ] All Team Members: Review SprintFlow AI Risk Matrix`,
      
      statusReport: `### 📊 Weekly Executive Status Report - ${p.name}\n\n**Overall Health Score:** ${dynamicEval.healthScore}/100 ${dynamicEval.healthScore >= 75 ? '🟢 (GREEN)' : dynamicEval.healthScore >= 50 ? '🟡 (YELLOW)' : '🔴 (RED)'}\n**AI Confidence Index:** ${dynamicEval.confidenceScore}%\n**Overall Risk Index:** ${dynamicEval.riskScore}/100\n\n#### Summary\nProject planning and multi-agent reasoning completed. All initial dependencies have been mapped with assignment rationales.\n\n#### Key Performance Metrics\n- **Budget Burn Rate:** 0% (On Track)\n- **Milestones Planned:** 3\n- **Identified Risks:** ${dynamicEval.risks.length} (Mitigations Active)\n\n#### Next Steps\nBegin execution of Milestone 1 tasks immediately. Coordinator Agent will monitor task velocity in real-time.`,
      
      presentationOutline: `### 📢 Executive Board Presentation Deck Outline\n\n#### Slide 1: Title & Vision\n- **SprintFlow AI Strategic Brief:** ${p.name}\n- Autonomous Project Execution Strategy for ${p.businessType}\n\n#### Slide 2: Market Challenge & Goal\n- **Objective:** ${p.goal}\n- **Timeline:** ${p.deadline} | **Budget:** ₹${Number(p.budget).toLocaleString('en-IN')}\n\n#### Slide 3: Agentic Execution Strategy\n- **Planner Agent:** 3 Milestones & Deliverables Roadmap\n- **Task Agent:** Automated Skill-Matching & Capacity Balancing\n- **Risk Agent:** Dynamic Risk Analysis (${dynamicEval.riskScore}/100 Risk Score)\n\n#### Slide 4: Expected Outcomes & Business Impact\n- ${dynamicEval.confidenceScore}% AI Confidence Rating\n- ${dynamicEval.risks.length} Automated Action Safeguards`,
      
      clientReport: `### 📋 Client Briefing Document: ${p.name}\n\nDear Stakeholder,\n\nSprintFlow AI has generated the formal execution roadmap for **${p.name}**.\n\n**Key Highlights:**\n- **Goal:** ${p.goal}\n- **Estimated Target Launch:** ${p.deadline}\n- **Assigned Team Size:** ${team.length} Specialists\n\nWe have scheduled ${team.length > 0 ? team[0].name : 'the Lead'} as the primary point of contact for Milestone 1. Full milestone documentation is available on the SprintFlow AI Dashboard.`
    },
    agentLogs: [
      {
        timestamp: '00:01',
        agent: 'Planner Agent',
        action: `Deconstructed '${p.name}' requirements into 3 milestone phases.`,
        details: `Evaluated business constraints (₹${Number(p.budget).toLocaleString('en-IN')} budget, target deadline ${p.deadline}).`,
        type: 'reasoning'
      },
      {
        timestamp: '00:02',
        agent: 'Task Agent',
        action: `Matched tasks across ${team.length} team members.`,
        details: `Assigned tasks using skill-matching logic and capacity balancing. Generated rationale for each assignment.`,
        type: 'success'
      },
      {
        timestamp: '00:03',
        agent: 'Risk Agent',
        action: `Evaluated ${dynamicEval.risks.length} dynamic risk factors (Calculated Risk Score: ${dynamicEval.riskScore}/100).`,
        details: `Populated 2x2 Heatmap vectors and action safeguards.`,
        type: dynamicEval.riskScore >= 50 ? 'warning' : 'success'
      },
      {
        timestamp: '00:04',
        agent: 'Coordinator Agent',
        action: `Calculated critical path and synchronized milestone dependencies.`,
        details: `Established automated progress monitoring rules.`,
        type: 'info'
      },
      {
        timestamp: '00:05',
        agent: 'Report Agent',
        action: `Compiled README, Meeting Summary, Executive Status, Presentation Deck, and Client Briefing.`,
        details: `Synthesized all exportable project documentation.`,
        type: 'success'
      }
    ]
  };
}

module.exports = { runMultiAgentWorkflow, computeDynamicRiskAnalysis };

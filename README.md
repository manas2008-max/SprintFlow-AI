# ⚡ SprintFlow AI — Autonomous AI Project Manager

> **Hackathon Theme:** Agentic AI & Intelligent Systems  
> **Tagline:** Autonomous AI Project Manager for Modern Businesses  

---

## 🎯 Overview

SprintFlow AI is an autonomous AI operating system for project management. Instead of requiring managers to coordinate everything manually, specialized AI agents collaborate to plan, assign, analyze risks, and generate project artifacts with minimal human intervention.

1. 🧠 **Planner Agent:** Analyzes business goals, breaks projects down into agile milestones, and estimates timelines with buffer zones.
2. 👥 **Task Allocation Agent:** Matches team member skillsets, balances workload capacity, and provides human-readable assignment rationale ("Why assigned").
3. 🛡️ **Risk & Mitigation Agent:** Detects deadline risks, skill gaps, budget overruns, and provides actionable mitigation strategies.
4. 🕸️ **Coordinator Agent:** Calculates the critical path, identifies workflow bottlenecks, and optimizes overall sprint health.
5. 📄 **Report Generation Agent:** Compiles exportable artifacts (`README.md`, Kickoff Meeting Notes, Executive Status Reports, Pitch Deck Outlines, Client Briefings).

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios, React Router v6
- **Backend:** Node.js, Express.js, Supabase PostgreSQL (`@supabase/supabase-js`), JWT Authentication, bcryptjs, Zod
- **Artificial Intelligence:** Google Gemini API (`@google/generative-ai` / Gemini 2.5 Flash) with fallback local reasoning engine
- **Environment & Deployment:** Configured for Vercel (Frontend) and Render (Backend)

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
In the root directory, run:
```bash
npm run setup
```
*(Or install manually in `/server` and `/client` folders using `npm install`)*

### 2. Environment Setup
Create a `.env` file inside `/server`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sprintflow_db
JWT_SECRET=sprintflow_secret_key_hackathon_2026_super_secure
GEMINI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=development
```

### 3. Launch Application
To start both backend and frontend concurrently:
```bash
npm run dev
```

Or run separately:
- **Backend:** `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend:** `cd client && npm run dev` (Runs on `http://localhost:3000`)

---

## 🏆 Key Hackathon Features

- ⚡ **1-Click Judge Demo Login:** Instant authentication shortcut on the login screen.
- 🚀 **1-Click Quick Strategy Templates:** Pre-built SaaS MVP, FinTech Settlement, and HealthTech templates for instantaneous 30-second judge evaluations.
- 🤖 **Real-Time 5-Agent Visualizer:** Live node graph and terminal logs showing agent collaboration before revealing the final roadmap.
- 📊 **Interactive Kanban & Risk Heatmap:** Dynamic status updates and 2x2 risk evaluation.
- 📥 **Exportable Artifacts:** Downloadable Markdown documentation generated on the fly.

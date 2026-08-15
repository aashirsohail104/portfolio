---
id: 1
title: Anas Electronics constitution ratification
stage: constitution
date: 2026-08-09
surface: agent
model: deepseek-v4-flash-free
feature: none
branch: master
user: Haroon Traders
command: constitution amendment workflow
labels: ["constitution", "21st-mcp", "frontend", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
tests:
  - None (no runtime code changed)
---

## Prompt

FRONTEND REQUIREMENT:
Use the 21st.dev MCP Server as the primary frontend component source and development resource. Before creating any frontend component manually, search and evaluate available 21st.dev components and reuse/adapt them whenever suitable.  A Professional Prompt Architecture

Instead of giving a long wish list, structure the prompt like a real software company.

Use:

Mission

↓

Rules

↓

Architecture

↓

Skills

↓

Subagents

↓

Planning

↓

Implementation

↓

Testing

↓

Optimization

↓

Final Review
Mandatory Skills

The AI should load these skills before coding.

UIUX-Pro-Max Skill
• Design System
• Component Design
• Visual Hierarchy
• Color Psychology
• Accessibility
• UX Auditing

Framer Motion Skill
• Motion Design Principles
• Spring Animations
• Scroll Reveal
• Page Transition
• Stagger Animation
• Gesture Animation
• Micro Interactions
• Loading Skeletons

Performance Engineer Skill
• Lazy Loading
• Image Optimization
• JavaScript Optimization
• Lighthouse Optimization
• Core Web Vitals

SEO Skill
• Schema
• OpenGraph
• Meta
• Sitemap
• Robots
• Breadcrumb

Accessibility Skill
• WCAG 2.2
• Keyboard Navigation
• Focus Management
• Screen Reader
• ARIA

JavaScript Architecture Skill
• Modular JS
• Event Delegation
• LocalStorage
• Search
• Filtering
• Cart Logic
• Wishlist Logic

E-commerce UX Skill
• Product Discovery
• Checkout UX
• Cart UX
• Product Gallery
• Sticky Buy Box
Mandatory Subagents
Master Orchestrator

↓

Research Agent
Uses Smart E Shop

↓

Design System Agent

↓

UI Layout Agent

↓

Component Agent

↓

Animation Agent

↓

JavaScript Logic Agent

↓

Accessibility Agent

↓

SEO Agent

↓

Performance Agent

↓

QA Agent

↓

Final Reviewer

Every agent has one responsibility.

Mandatory MCP Workflow

The prompt should explicitly state:

21st.dev MCP Server is mandatory.

Do not manually create components that already exist inside 21st.dev.

Search the MCP server first.

Reuse high-quality components.

Adapt them to the Anas Electronics design system.

Maintain a consistent visual language across the project.

If multiple components exist, choose the most premium and performant version.

Never ignore the MCP server.
Smart Research Workflow

Instead of simply saying "study this website", specify:

Research ONLY the following:

• Product categories
• Product specifications
• Product hierarchy
• Product naming conventions
• Battery charger information
• Inverter information
• Feature lists
• Warranty information
• Technical specifications

Do NOT copy:

• Layout
• CSS
• Images
• Icons
• Branding
• Copywriting
• Logo
• Visual identity

Use the research only to create original content.
Better Design Direction

Instead of:

Make premium UI

Use:

Visual Style

Apple simplicity

Tesla typography

EcoFlow product cards

DJI spacing

Nothing UI micro interactions

Stripe documentation quality

Vercel minimalism

Linear animations

Raycast polish
Performance Budget

Force measurable targets.

Lighthouse

Performance ≥98

Accessibility ≥100

SEO ≥100

Best Practices ≥100

CLS <0.05

LCP <2 seconds

INP <200ms
Project Execution

Force this order.

Phase 1

Research

↓

Phase 2

Specification

↓

Phase 3

Information Architecture

↓

Phase 4

Design System

↓

Phase 5

Folder Structure

↓

Phase 6

Wireframes

↓

Phase 7

Component Inventory

↓

Phase 8

Implementation

↓

Phase 9

Animation

↓

Phase 10

SEO

↓

Phase 11

Accessibility

↓

Phase 12

Performance

↓

Phase 13

Testing

↓

Phase 14

Final Polish

↓

Phase 15

Production Build
Quality Gates

After every phase:

Review

Identify issues

Fix issues

Optimize

Continue
Final Deliverables

Require:

Complete specification document
Folder architecture
Design system
Component library
Responsive layouts (mobile, tablet, laptop, desktop, ultrawide)
Production-ready HTML, Tailwind CSS, and modular JavaScript
SEO assets (meta tags, Schema.org, Open Graph, robots.txt, sitemap.xml)
Accessibility compliance (WCAG 2.2 AA)
Performance optimization meeting the Lighthouse targets
Testing checklist and QA report
Fully documented code with reusable, maintainable architecture LOAD SKILLS AND SUBAGENTS APPROUCH

## Response snapshot

Filled the Anas Electronics constitution (.specify/memory/constitution.md) to
v1.0.0 from the template placeholders: 7 core principles (21st.dev MCP-First
NON-NEGOTIABLE, Component Reuse & Design System, Professional Prompt
Architecture, Mandatory Skills & Subagent Pipeline, Design Excellence,
Performance/SEO/Accessibility Budget NON-NEGOTIABLE, Research Integrity), plus
two new sections (Non-Functional Standards; Execution Workflow & Quality Gates
with 15 phases) and governance rules (semver amendment policy, Constitution
Check gate). Propagated the 21st.dev MCP-first rule and Lighthouse/WCAG budget
into plan/spec/tasks templates. Added HTML sync-impact report at top. Wrote
PHR 1. No runtime code changed; no tests.

## Outcome

- ✅ Impact: Repository-wide governance now mandates 21st.dev MCP-first
  frontend work and measurable performance/accessibility budgets for the
  Anas Electronics project.
- 🧪 Tests: None (no runtime code changed)
- 📁 Files: .specify/memory/constitution.md, .specify/templates/plan-template.md,
  .specify/templates/spec-template.md, .specify/templates/tasks-template.md
- 🔁 Next prompts: /sp.adr to document the 21st.dev MCP integration decision;
  frontend feature spec drafted per the new constitution gates.
- 🧠 Reflection: Ratification date was unknown (template repo, single commit);
  set to initial adoption 2026-08-09. No ambiguous placeholders left.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Placeholder scan PASS (no [TOKEN] left),
  version/date coherence PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A

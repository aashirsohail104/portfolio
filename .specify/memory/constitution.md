<!--
  SYNC IMPACT REPORT (2026-08-09)
  - Version change: (none - template) → 1.0.0
  - Principles: 7 added (initial fill of template placeholders)
    1. 21st.dev MCP-First (NON-NEGOTIABLE)
    2. Component Reuse & Design System
    3. Professional Prompt Architecture
    4. Mandatory Skills & Subagent Pipeline
    5. Design Excellence
    6. Performance, SEO & Accessibility Budget (NON-NEGOTIABLE)
    7. Research Integrity
  - Added sections: "Non-Functional Standards", "Execution Workflow & Quality Gates"
  - Removed sections: none (template placeholders only)
  - Templates updated: plan-template.md (✅), tasks-template.md (✅), spec-template.md (✅)
  - Deferred: RATIFICATION_DATE unknown prior history; set to initial adoption date
-->

# Anas Electronics Constitution

## Core Principles

### I. 21st.dev MCP-First (NON-NEGOTIABLE)
The 21st.dev MCP server (`21st`, https://21st.dev/api/mcp) is the MANDATORY
primary source for all frontend component work. Before manually creating any
component, the agent MUST search and evaluate available 21st.dev components
(generate, get_inspiration, catalog/theme/template search, search_logo) and
reuse or adapt them whenever suitable. The MCP server MUST never be ignored;
manually building a component that already exists there is a violation.
Rationale: guarantees a premium, performant, consistent UI surface without
re-inventing proven patterns.

### II. Component Reuse & Design System
Every component MUST be adapted to the Anas Electronics design system and
MUST maintain one consistent visual language across the whole project. When
multiple 21st.dev components satisfy a need, the MOST premium and performant
version MUST be chosen. Manually created components are only permitted when
no suitable 21st.dev asset exists and MUST follow the same design tokens and
conventions.

### III. Professional Prompt Architecture
All frontend work MUST be driven by prompts structured like a real software
company, in this order: Mission → Rules → Architecture → Skills → Subagents →
Planning → Implementation → Testing → Optimization → Final Review. A long
wish list with no structure is prohibited; each prompt MUST be a bounded,
reviewable engineering request.

### IV. Mandatory Skills & Subagent Pipeline
Before coding, the agent MUST load the mandated skill set: UIUX-Pro-Max,
Framer Motion, Performance Engineer, SEO, Accessibility (WCAG 2.2),
JavaScript Architecture, and E-commerce UX. Implementation MUST follow the
single-responsibility subagent pipeline: Master Orchestrator → Research →
Design System → UI Layout → Component → Animation → JavaScript Logic →
Accessibility → SEO → Performance → QA → Final Reviewer. Every subagent has
exactly one responsibility.

### V. Design Excellence
Visual direction MUST reference world-class standards rather than vague
"premium UI" language: Apple simplicity, Tesla typography, EcoFlow product
cards, DJI spacing, Nothing UI micro-interactions, Stripe documentation
quality, Vercel minimalism, Linear animations, Raycast polish. The result
MUST be measurably consistent with the Anas Electronics design system.

### VI. Performance, SEO & Accessibility Budget (NON-NEGOTIABLE)
Every deliverable MUST meet these hard targets before it ships:
Lighthouse Performance ≥ 98, Accessibility ≥ 100, SEO ≥ 100, Best Practices
≥ 100, CLS < 0.05, LCP < 2 seconds, INP < 200ms. WCAG 2.2 AA compliance is
mandatory (keyboard navigation, focus management, screen-reader support,
ARIA). SEO assets (meta tags, Schema.org, Open Graph, robots.txt, sitemap.xml,
breadcrumbs) MUST be present on every page.

### VII. Research Integrity
Research is limited to CONTENT ONLY: product categories, specifications,
product hierarchy, naming conventions, battery-charger and inverter data,
feature lists, warranty information, and technical specifications. Copying
layout, CSS, images, icons, branding, copywriting, logos, or visual identity
from reference sites is strictly prohibited; research is used solely to
produce original content.

## Non-Functional Standards

- **Responsive layouts**: mobile, tablet, laptop, desktop, and ultrawide
  breakpoints are all first-class; none may be an afterthought.
- **Performance engineering**: lazy loading, image optimization, JS
  optimization, and Core Web Vitals optimization are required practices, not
  optional chores.
- **JavaScript architecture**: modular JS, event delegation, LocalStorage,
  search, filtering, cart logic, and wishlist logic MUST be structured as
  clean, reusable modules.
- **E-commerce UX**: product discovery, checkout UX, cart UX, product
  gallery, and a sticky buy box MUST follow established e-commerce patterns.
- **Final deliverables**: complete specification document, folder
  architecture, design system, component library, responsive layouts,
  production-ready HTML + Tailwind CSS + modular JavaScript, SEO assets,
  WCAG 2.2 AA compliance, Lighthouse-meeting performance, a testing checklist
  and QA report, and fully documented, reusable, maintainable code.

## Execution Workflow & Quality Gates

Execution MUST proceed strictly in this order:
1. Research → 2. Specification → 3. Information Architecture → 4. Design
System → 5. Folder Structure → 6. Wireframes → 7. Component Inventory →
8. Implementation → 9. Animation → 10. SEO → 11. Accessibility →
12. Performance → 13. Testing → 14. Final Polish → 15. Production Build.

After EVERY phase the agent MUST run a quality gate: review the phase output,
identify issues, fix them, optimize, and only then continue to the next
phase. Skipping a phase or proceeding without its gate is a violation.

## Governance

This constitution supersedes all other practices in this repository. Any
amendment MUST be documented, approved, and accompanied by a version bump
per semantic versioning (MAJOR = backward-incompatible governance change,
MINOR = new principle/section, PATCH = clarification). Every spec, plan, and
task set MUST pass a "Constitution Check" gate before work begins and be
re-checked after design. All frontend plans MUST reference the 21st.dev
MCP-first rule and the performance budget before implementation starts.

**Version**: 1.0.0 | **Ratified**: 2026-08-09 | **Last Amended**: 2026-08-09

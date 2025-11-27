# Nordic Prompt Architect

**AI-Ready Requirements & Code Sanitization for DevOps Teams**

**"Zero Magic. Total Control. Enterprise-First."**

Nordic Prompt Architect (NPA) is a VS Code extension designed for DevOps, backend engineers, and enterprise teams that need structured requirements, safe prompt generation, and offline-first code sanitization.

**NPA does not call external AI services.**

It prepares your text, code and specifications so your own LLMs (Azure OpenAI, DeepSeek, local models, etc.) receive clean, safe, deterministic context.

---

## 🚀 Why Nordic Prompt Architect Exists

Modern development teams often receive requirements that are:

- vague
- incomplete
- contradictory
- or full of stakeholder-driven ambiguity

NPA turns that noise into actionable engineering clarity — without using any cloud AI — making it safe for:

- public sector
- regulated companies
- GDPR-sensitive data flows
- offline environments
- air-gapped development setups

This tool empowers developers to take back control over requirement quality, prompt quality, and security.

---

## 🔥 Key Features

### 🔬 Crystallize Engine v2 — AI-Ready Technical Specs

Transforms vague text (Slack, email, tickets) into a structured technical specification:

- Context
- Blockers
- Risks
- Technical Dependencies
- Acceptance Criteria

**🔥 Clarity Score (0–100) with emoji indicator (🟢🟡🔴)**

**🔎 Automatic detection of deadlines, blockers, risks, ambiguous terms**

Offline. Deterministic. Fast.

### ✉️ Diplomat Engine — Stakeholder Reply Generator

Turns chaotic business input into a professional, structured, tone-controlled stakeholder response.

Perfect for Azure DevOps comments and refinement discussions.

Configurable tone:

- SOFT
- PROFESSIONAL
- STRICT

### 🛡️ Security Engine v2 — Offline Code Sanitization

Sanitizes selected code snippets before sending them to an LLM:

**Detects & masks:**

- Swedish personal numbers
- Email addresses
- Phone numbers
- IPv4 & IPv6
- API keys (OpenAI, AWS, Bearer tokens, etc.)

**Supports:**

- token-based masking
- exclude_paths (tests, mocks, fixtures)
- dry-run safety analysis

All security rules run locally and never leave your machine.

### 🧪 Verify Engine — Definition-of-Done Generator

Creates structured checklists from any requirement spec.

**Includes:**

- Acceptance Criteria
- Test cases
- Edge cases
- Risk considerations

Ideal for Azure DevOps Pull Request templates.

---

## 🧵 Real-World Workflow: Azure DevOps

NPA fits naturally into DevOps planning flows:

### 1. Requirement Refinement (Boards)

Paste vague requirement → run Crystallize → Tech Spec

You instantly get:

- Clear context
- Identified risks
- Missing details
- Clarity Score

Teams add this directly into Azure DevOps Work Items.

### 2. Stakeholder Communication

Use Crystallize → Diplomat Reply to:

- push back on unclear tasks
- request missing details
- resolve ambiguities
- maintain professional tone

Perfect for customer projects.

### 3. PR Quality Gates (Repos)

Before sending code to an LLM (Code Reviewer, DeepSeek, Azure OpenAI):

- Run Architect → Sanitize Code to mask secrets
- Run Verify → Checklist to validate completeness

### 4. Sprint Planning

Use NPA output in estimation sessions.

The Clarity Score provides objective reasoning for:

- "This task is not clear enough to estimate yet."
- "This requirement is actionable."

---

## 🗂️ Commands

| Command | Description |
| --- | --- |
| **Crystallize: Generate Tech Spec** | Generate structured technical specification with Clarity Score. |
| **Crystallize: Generate Diplomatic Reply** | Stakeholder response template. |
| **Crystallize** | Alias → Tech Spec. |
| **Architect** | Sanitize and wrap code for LLM prompts. |
| **Verify** | Create checklist from spec. |
| **Analyze Safety Only** | Security dry-run (logs only). |

---

## ⚙️ Configuration

Create `.superpromptrc.json` automatically via:

**Command:** `SuperPrompt: Initialize Config`

**Example config:**

```json
{
  "project": {
    "name": "Payment Service",
    "language": "sv",
    "environment": "node-typescript"
  },
  "security": {
    "mode": "STRICT",
    "allow_cloud_processing": false,
    "mask_patterns": ["se_personnummer", "email", "ipv4", "api_key"],
    "exclude_paths": ["**/tests/**", "mocks/**"]
  },
  "templates": {
    "role": "Senior Backend Engineer",
    "diplomat_tone": "PROFESSIONAL"
  }
}
```

If config is missing or invalid, NPA safely falls back to defaults.

---

## 🛡️ Security Model

- **100% local execution**
- **No telemetry**
- **No API calls**
- **No remote logging**
- **No AI communication**

All sensitive data stays on your machine.

---

## 🧱 Offline-First Architecture

Technically enforced via:

- Static pattern matching
- Deterministic output
- No runtime dependencies on network or AI services

**CI rule:** PRs fail if network-related code appears (fetch, axios, https, etc.)

---

## 🔄 CI/CD (GitHub Actions)

The repository includes:

- **ci.yml** — Lint, compile, offline checks, build .vsix packet
- **release.yml** — Auto-release on git tag
- **verify-offline-first.sh** — Ensures no online dependencies
- **Pull Request Template** with quality gates

Every change is validated before merge.

---

## 📦 Installation (Development Mode)

```bash
npm install
npm run compile
```

**F5 in VS Code → Extension Development Host**

---

## 🛣 Roadmap (High-Level)

### ✔️ Phase 1 – Foundation

- Config loader
- Logger
- First-run experience

### ✔️ Phase 2 – Security Engine v2

- Token masking
- Exclude paths
- Dry-run mode

### ✔️ Phase 3 – Crystallize Engine v2

- PatternMatcher
- TextAnalyzer
- Clarity Score
- Tech Spec & Diplomat templates

### ⏳ Phase 4 – Architect Engine v2

- Language-aware code prompts
- Best practice personas

### ⏳ Phase 5 – Enterprise Suite

- Template packs
- Company-wide centralized config
- Offline enforcement modes

---

## License

**Commercial License (default)**

All rights reserved.

See `LICENSE` for details.

For special enterprise licensing, contact the maintainers.

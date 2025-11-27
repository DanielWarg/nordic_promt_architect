# Nordic Prompt Architect — Master Roadmap

This roadmap describes the journey from working MVP to "Enterprise Gold Standard".
Everything here is part of the long-term backlog and builds on the three core engines: Crystallize, Architect, and Verify.

## 📋 Status Legend

- [x] **Done** — Completed and tested
- [~] **In Progress** — Currently being implemented
- [ ] **Not Started** — Planned but not yet begun
- [!] **Blocked / Needs Research** — Requires decisions or external dependencies

---

## 🏁 Phase 1: Core Foundation — MVP Stabilization

**Sprint 1: Foundation**

*Goal: A robust, predictable, and crash-safe foundation.*

- [x] **Robust Config Loader**  
  - [x] Extension should read .superpromptrc.json automatically on startup  
  - [x] Hot Reload: config file updates should be read without restarting VS Code  
  - [x] Fallback to safe default values if config is missing or corrupt

- [x] **Transparent Logging — "The Trust Layer"**  
  - [x] New Output channel: "Nordic Prompt Logs"  
  - [x] Log everything: config loaded, sanitizer started, patterns found, template applied  
  - [x] Timestamps and performance metrics: "Sanitization completed in 12ms"

- [x] **Error Handling & Graceful Degradation**  
  - [x] Extension must never crash hard  
  - [x] Errors logged quietly in output channel (logger.error + VS Code warning)  
  - [x] User only sees warnings for critical obstacles

- [x] **First Run Experience / Onboarding**  
  - [x] Show installation notice instructing to run `SuperPrompt: Initialize Config`  
  - [x] Init command creates `.superpromptrc.json` with safe defaults and logs result  
  - [x] Safe defaults when config is missing + clear log message "No .superpromptrc.json found. Using secure defaults."

- [x] **Core Commands & UX Flow**  
  - [x] `superprompt.initConfig` creates config and logs info  
  - [x] `superprompt.crystallize` generates specs in split view  
  - [x] `superprompt.architect` sanitizes code and opens prompt output  
  - [x] `superprompt.verify` produces checklist  
  - [x] `superprompt.compareSelections` compares two selections and generates report

---

## 🛡️ Phase 2: Security Engine — Sanitizer v2

**Sprint 2: Security Engine v2**

*Goal: "The security chief should love this."*

- [x] **Extended Data Security Detection**  
  - [x] Swedish personal numbers (all formats)  
  - [x] Email addresses  
  - [x] Phone numbers  
  - [x] IP addresses (IPv4/IPv6)  
  - [x] API keys (OpenAI, AWS, Stripe, generic Bearer tokens)

- [x] **Token-based Masking**  
  - [x] <PNR_REDACTED>  
  - [x] <EMAIL_HIDDEN>  
  - [x] <API_KEY_SECURED>

- [x] **Dry-Run Mode (SuperPrompt: Analyze Safety Only)**  
  - [x] Run analysis without prompt  
  - [x] Writes report in log  
  - [x] Does not modify content

- [x] **Exclude Paths / Ignore Files**  
  - [x] New `security.exclude_paths` key in `.superpromptrc.json` (e.g., `**/tests/**`, `mocks/**`)  
  - [x] Sanitizer completely skips these paths without masking or warnings  
  - [x] Document default list and how it can be extended

---

## 💎 Phase 3: Crystallize Engine — Requirements Management v2

**Sprint 3: Crystallize Engine v2**

*Goal: Turn vague text into hard, technical specifications. This phase delivers the first visible business value.*

- [x] **The "Tech Spec" Template**  
  - [x] Context  
  - [x] Blockers  
  - [x] Risks  
  - [x] Acceptance Criteria  
  - [x] Technical dependencies
  - [x] Clarity Score (0-100) with emoji indicator
  - [x] Language-aware (sv/en)

- [x] **The "Diplomat" Template**  
  - [x] Summary section
  - [x] Blockers section (always shows consistent professional message)
  - [x] Clarification requirements
  - [x] Next steps with "Needs Clarification" status
  - [x] Senior professional consultant tone

- [x] **Command: SuperPrompt – Crystallize Requirements**  
  - [x] Applied to selected text  
  - [x] Output in split view
  - [x] `superprompt.crystallizeSpec` - Generate Tech Spec
  - [x] `superprompt.crystallizeDiplomat` - Generate Diplomatic Reply
  - [x] `superprompt.crystallize` - Backward compatible alias

- [x] **Text Analysis Engine**
  - [x] PatternMatcher for extracting deadlines, blockers, risks, technical terms
  - [x] TextAnalyzer with clarity score calculation
  - [x] Language-aware pattern matching (sv/en)

---

## 🏗️ Phase 4: Architect Engine — Code & Prompt Design

**Sprint 5: Architect Engine**

*This phase unlocks the first business-critical premium feature. It transforms code sanitization from a security tool into a prompt engineering assistant.*

- [ ] **Context-Wrapping Framework**  
  - [ ] Persona-based templates (Senior TS architect, etc.)  
  - [ ] Strict best practice instructions

- [ ] **Language Awareness**  
  - [ ] TS / JS  
  - [ ] Python  
  - [ ] C#  
  - [ ] Java  
  - [ ] Language-specific instructions

- [ ] **Split View Guarantee**  
  - [ ] New tab  
  - [ ] ViewColumn.Beside  
  - [ ] Never overwrite original file

---

## ✅ Phase 5: Verify Engine — Compliance v1

**Sprint 6: Verify Engine**

*Goal: Make quality assurance automated. This turns manual checklist reviews into structured, repeatable processes.*

- [ ] **Definition of Done Generator**  
  - [ ] Acceptance Criteria  
  - [ ] Test cases  
  - [ ] Risks  
  - [ ] Edge Cases

- [ ] **Command: SuperPrompt – Generate DoD Checklist**  
  - [ ] Reads spec  
  - [ ] Creates checklist in markdown

---

## 🏢 Phase 6: Enterprise Features — Scale to 500 developers

**Sprint 7: Enterprise Features**

*This is where the product becomes sellable as an enterprise tool. Customization, validation, and enforcement make it suitable for large organizations.*

- [ ] **Config Schema Validation**  
  - [ ] JSON schema for .superpromptrc.json  
  - [ ] IntelliSense/autocomplete in VS Code

- [ ] **Custom Templates**  
  - [ ] Automatically read `.superprompt/templates/`  
  - [ ] Company-specific templates

- [ ] **Offline Enforcer**  
  - [ ] Setting `force_offline: true`  
  - [ ] Block all network calls

- [ ] **Future-proof Model Structure**  
  - [ ] `models.architect`  
  - [ ] `models.crystallize`  
  - [ ] `models.verify`

---

## 🧠 Phase 7: QA & Quality Engineering

*Goal: Ensure the product meets enterprise-grade quality standards before public release.*

- [ ] **Unit Test Block (at least 6 tests)**  
  - [ ] Sanitizer masks personal numbers  
  - [ ] Config reload works  
  - [ ] Architect Engine output correct  
  - [ ] Compare command renders correct markdown  
  - [ ] Crystallize does not modify input  
  - [ ] Error handling logs correctly

- [ ] **Performance Benchmarks**  
  - [ ] Sanitizer speed  
  - [ ] Regex throughput  
  - [ ] Render time

- [x] **CI/CD Infrastructure**  
  - [x] GitHub Actions CI workflow  
  - [x] Build pipeline (TypeScript compile)  
  - [x] ESLint quality gate  
  - [x] Offline-first verification  
  - [x] Strict TypeScript enforcement (no 'any')  
  - [x] PR template with quality gates  
  - [x] Release automation workflow

---

## 📦 Phase 8: Packaging & Release

*Goal: Prepare the product for marketplace launch with professional assets and complete documentation.*

- [ ] **Marketplace Assets**  
  - [ ] Logo (Nordic minimalism)  
  - [ ] 4 screenshots  
  - [ ] Demo GIF (Split View)

- [x] **Documentation**  
  - [x] README.md  
  - [ ] SECURITY.md  
  - [ ] CONFIGURATION.md  
  - [x] CHANGELOG.md

- [x] **CI/CD Pipeline**  
  - [x] Build .vsix (automated)  
  - [x] Run linting/tests  
  - [ ] Publish to marketplace (manual for now)

---

## 🔒 Commercial Maturity Milestones

These milestones represent key decision points for go-to-market strategy and enterprise adoption.

### 🔒 **M1 — Security Ready**

*Foundation for enterprise adoption. No external dependencies, full data control.*

- [x] All sanitization patterns implemented
- [x] No external API calls
- [x] CI/CD offline enforcement
- [x] Token-based masking system
- [x] Exclude paths support
- [x] Dry-run safety analysis

**Status:** ✅ **DONE**

---

### ⚙️ **M2 — Feature Complete**

*Core functionality delivered. All three engines operational.*

- [x] Crystallize Engine v2 (Tech Spec + Diplomat)
- [x] Security Engine v2 (Sanitizer)
- [~] Architect Engine v2 (In Progress)
- [ ] Verify Engine v1 (Planned)

**Status:** [~] **IN PROGRESS** (75% complete)

---

### 🏢 **M3 — Enterprise Ready**

*Customization and validation features enable large-scale deployments.*

- [ ] Custom templates support
- [ ] JSON schema validation with IntelliSense
- [ ] Offline enforcer mode
- [ ] Config schema documentation
- [ ] Company-wide template packs

**Status:** [ ] **NOT STARTED**

---

### 📦 **M4 — Marketplace Launch**

*Public release with full documentation and marketplace assets.*

- [ ] Marketplace assets (logo, screenshots, demo GIF)
- [ ] SECURITY.md documentation
- [ ] CONFIGURATION.md documentation
- [ ] VSIX signing
- [ ] Microsoft marketplace review passed
- [ ] Public launch announcement

**Status:** [ ] **NOT STARTED**

---

## 🧠 DevOps Psychology — "Does it feel like a tool?"

**Checklist before release:**

- [x] Are the logs "noisy enough"?  
- [x] Is the UI 100% quiet on success?  
- [x] Are error messages calm and understandable?  
- [x] Is everything fast enough to feel "instant"?  
- [ ] Does it feel like a work tool, not a toy? (Final UX polish pending)

---

## 📈 Progress Summary

- **Phase 1 (Foundation):** ✅ 100% Complete
- **Phase 2 (Security Engine):** ✅ 100% Complete
- **Phase 3 (Crystallize Engine):** ✅ 100% Complete
- **Phase 4 (Architect Engine):** [ ] 0% Complete
- **Phase 5 (Verify Engine):** [ ] 0% Complete
- **Phase 6 (Enterprise Features):** [ ] 0% Complete
- **Phase 7 (QA & Quality):** [~] 60% Complete (CI/CD done, tests pending)
- **Phase 8 (Packaging):** [~] 40% Complete (Documentation done, assets pending)

**Overall Progress:** ~55% Complete (3 of 8 phases fully done)

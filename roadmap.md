# Nordic Prompt Architect — Master Roadmap

This roadmap describes the journey from working MVP to "Enterprise Gold Standard".
Everything here is part of the long-term backlog and builds on the three core engines: Crystallize, Architect, and Verify.

🏁 Phase 1: Core Foundation — MVP Stabilization

Goal: A robust, predictable, and crash-safe foundation.

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

🛡️ Phase 2: Security Engine — Sanitizer v2

Goal: "The security chief should love this."

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

💎 Phase 3: Crystallize Engine — Requirements Management v2

Goal: Turn vague text into hard, technical specifications.

- [ ] **The "Tech Spec" Template**  
  - [ ] Context  
  - [ ] Blockers  
  - [ ] Risks  
  - [ ] Acceptance Criteria  
  - [ ] Technical dependencies

- [ ] **The "Diplomat" Template**  
  - [ ] "This is the next step"  
  - [ ] "This blocks us"  
  - [ ] "Proposed solution"

- [ ] **Command: SuperPrompt – Crystallize Requirements**  
  - [ ] Applied to selected text  
  - [ ] Output in split view

🏗️ Phase 4: Architect Engine — Code & Prompt Design

Goal: Get juniors to write senior prompts and code specs.

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

✅ Phase 5: Verify Engine — Compliance v1

Goal: Make quality assurance automated.

- [ ] **Definition of Done Generator**  
  - [ ] Acceptance Criteria  
  - [ ] Test cases  
  - [ ] Risks  
  - [ ] Edge Cases

- [ ] **Command: SuperPrompt – Generate DoD Checklist**  
  - [ ] Reads spec  
  - [ ] Creates checklist in markdown

🏢 Phase 6: Enterprise Features — Scale to 500 developers

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

🧠 Phase 7: QA & Quality Engineering

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

📦 Phase 8: Packaging & Release

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

🧠 DevOps Psychology — "Does it feel like a tool?"

Checklist before release:  
– Are the logs "noisy enough"?  
– Is the UI 100% quiet on success?  
– Are error messages calm and understandable?  
– Is everything fast enough to feel "instant"?  
– Does it feel like a work tool, not a toy?

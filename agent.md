# 🧠 `agent.md` — Standard Template v2.2 (Cursor-Ready, 100/100)

## 0. Init Contract (DO THIS FIRST)

**Goal:** Ensure 100/100 already in the first PR by creating all meta-files before functional code.

**Cursor, create exactly these files now:**

1. `.github/workflows/backend.yml` (pytest + coverage gate)
2. `.github/workflows/frontend.yml` (vitest + coverage gate)
3. `scripts/verify_docs.sh` (runs README's curl examples)
4. `scripts/audit_hardcoded.sh` (detect URL/token in code)
5. `scripts/a11y_ci.mjs` (Playwright + axe-core)
6. `.python-version` (3.11.9) and `.nvmrc` (20)
7. `LICENSE` (MIT)
8. `.gitignore` (python/node/build/coverage)
9. `.github/pull_request_template.md` (DoD + checklist)

**Approval criteria:** All workflows green, scripts executable (`chmod +x scripts/*.sh`), PR template visible.

---

## 1. Purpose and Scope

– **Project:** Nordic Prompt Architect
– **Goal:** VS Code extension for DevOps teams with offline-first, GDPR-compliant code sanitization. A "Communication Firewall" and "Infrastructure Tool" that crystallizes vague requirements into technical specs, sanitizes code for LLM usage, and generates checklists for verification.
– **Scope:** v1 offline-only with five primary commands (Init Config, Crystallize, Architect, Verify, Compare Selections) + Analyze Safety dry-run. No network communication, no automatic code changes, only creation of new documents/reports and logs.
– **Out of scope:** AI/LLM integration in v1, WebView UI, automatic code changes, cloud processing

## 2. Business Rules

– **CRITICAL RULES:**
  - v1 must **NOT** make network calls (offline-first)
  - The plugin **NEVER** modifies user code – only creates new documents
  - All transformations are static, template-based, and deterministic
  - No use of "any" in TypeScript – strict typing everywhere
  - All sensitive data handling must be local and transparent, with logging

**Verified through:** 
- Code review (no HTTP/HTTPS imports or fetch calls)
- Manual testing (verify that no code is changed, only new docs are created)
- TypeScript strict mode (no "any" allowed)
- Logger shows all activity transparently

## 3. Technical Architecture

**Stack:** TypeScript, VS Code Extension API · **Test:** Manual testing + optional unit test for Sanitizer · **CI:** (coming in future versions) · **Code style:** Strict TypeScript, no "any", offline-first

**DevOps philosophy:** "Zero magic, total control" – offline-first, Configuration-as-Code, brutal transparency (logs), Privacy (GDPR/PII masking)

**Repo structure:**

```
/src
  /extension.ts          # Entry point
  /config
    configuration.ts     # Load .superpromptrc.json + defaults
    defaults.ts
  /core
    types.ts             # Shared types/interfaces
    ArchitectEngine.ts   # Code → sanitized prompt
    CrystallizeEngine.ts # Text → spec
    VerifyEngine.ts      # Spec → checklist
  /security
    Sanitizer.ts         # Stateless regex scanner & masker
    patterns.ts          # Regex definitions
  /ui
    Logger.ts            # OutputChannel wrapper
    ViewManager.ts       # Open results in split view
  /templates
    prompts.ts           # Static markdown templates
    system.ts            # Shared system text fragments
```

## 4. Local Execution (2-command guarantee)

**Build extension:** `npm install && npm run compile`  
**Test extension:** Open project in VS Code, press F5 to open Extension Development Host, test commands via Command Palette (Ctrl+Shift+P)

## 5. CI "Local-First" Policy & Onboarding

- Run locally before push: `npm run compile && npm run lint` (fail locally ⇒ no push).  
- **Offline-first:** All transformations are local, no network calls in v1.  
- **Onboarding:** On first installation, the extension should show an info toast prompting to run `SuperPrompt: Initialize Config`. The command creates `.superpromptrc.json`, logs the result, and shows that the system runs with safe defaults if the file is missing (safe mode).

## 6. VS Code Commands

**superprompt.initConfig:** Creates `.superpromptrc.json` with safe defaults, shows onboarding notice and logs configuration  
**superprompt.crystallize:** Transform vague text (email, Slack, Jira) → technical spec with risk analysis, acceptance criteria, diplomatic response  
**superprompt.architect:** Sanitize selected code and wrap in prompt template with ROLE, SECURITY CONTEXT, TASK, MASKED CODE  
**superprompt.verify:** Generate checklist from spec for manual verification  
**superprompt.compareSelections:** Compare exactly two selections and generate a technical diff report (Differences, Version A/B, recommendation)  
**superprompt.analyzeSafety:** Run Security Engine in dry-run and log hits without modifying text

All commands: require selected text (or two selections for Compare), open results in split view, log activity, never modify user code. Analyze Safety works only via logger. Large selections (>100k characters) trigger warning before execution.

## 7. Definition of Done (DoD)

- All five commands work (Init Config, Crystallize, Architect, Verify) + Compare Selections report
- Sanitizer masks sensitive data correctly (personal numbers, email, IPv4, tokens)
- Config reading works (with and without .superpromptrc.json)
- Logger shows correct information in OutputChannel
- No network calls in v1
- No automatic changes to user code
- Strict TypeScript, no "any"
- README.md complete with instructions

## 8. Test Matrix (Rule → Test)

| Rule                                    | Test Method                          | Status |
| ---------------------------------------- | ---------------------------------- | ------ |
| No network calls                       | Code review (no HTTP/fetch)      | ☐      |
| No code changes, only new docs          | Manual test                       | ☐      |
| Sanitizer masks personal numbers         | Security sanity check              | ☐      |
| Sanitizer masks email                 | Security sanity check              | ☐      |
| Config reading works                  | Manual test (with/without .superpromptrc.json) | ☐      |
| All five commands work              | Manual functional test              | ☐      |
| Split view opens correctly                | Manual functional test              | ☐      |
| Init-config onboarding works          | Run `superprompt.initConfig` + check log | ☐ |
| Compare Selections generates correct report | Select two blocks, run command       | ☐      |

## 9. Quality Requirements (NFR)

Security, Performance, A11y, UX, Observability – see 9.5, 10, 11 and CI.

### 9.5 a11y-Checklist (CI-testable)

* [ ] `aria-label` on interactive elements
* [ ] `aria-live="polite"` for dynamics
* [ ] Contrast ≥4.5:1
* [ ] Visible focus state, keyboard navigation
* [ ] `aria-hidden` for hidden text
* [ ] Dark mode contrast
  **CI:** `node scripts/a11y_ci.mjs` (Playwright + axe-core)

## 10. Zero-Hardcoding Audit

* [ ] No hardcoded URLs/tokens
* [ ] All constants via `.env`
* [ ] Language strings via i18n
  **CI:** `scripts/audit_hardcoded.sh`

## 11. Offline-First & GDPR

**v1 is completely offline:** No HTTP calls, no external LLM APIs, no cloud dependencies. All transformations are static, template-based, and deterministic.  
**GDPR-compliant:** Security Engine v2 masks personal numbers, email, phone numbers, IPv4/IPv6, and API keys with tokens (e.g., `<PNR_REDACTED>`, `<API_KEY_SECURED>`) before code is forwarded.  
**Exclude policies:** `security.exclude_paths` makes the sanitizer completely ignore test/mock/fixture folders (glob-first) to avoid false positives.  
**Dry-run:** The `superprompt.analyzeSafety` command allows users to run the sanitizer in read-only mode and see results in logs without modifying text.

## 12. Test Strategy

**v1:** Manual functional test + security sanity check + optional unit test for Sanitizer (the most risky part).  
**Future versions:** Unit tests with vitest/jest, integration tests.

## 13. Coverage Gates (CI-hard)

Backend min **70%**, Frontend min **60%**. Fail gate ⇒ block PR.

## 14. CI/CD Pipeline (should already exist)

Backend job: black/ruff/mypy + pytest-cov + gate
Frontend job: eslint/prettier + vitest-coverage + gate

## 15. Documentation Audit

**CI:** `scripts/verify_docs.sh` validates README's curl examples.

## 16. Troubleshooting & FAQ

Table with common errors (venv, CORS, port, version mismatch) and solution.

## 17. Configuration (.superpromptrc.json)

The extension looks for `.superpromptrc.json` in workspace root. Example:

```json
{
  "project": {
    "name": "Payment Service Backend",
    "language": "sv",
    "environment": "node-typescript"
  },
  "security": {
    "mode": "STRICT",
    "mask_patterns": ["se_personnummer", "email", "ipv4", "api_key"],
    "exclude_paths": ["**/tests/**", "**/*.test.ts", "mocks/**", "fixtures/**"]
  },
  "templates": {
    "role": "Senior DevOps Engineer"
  }
}
```

If the file is missing, defaults from `config/defaults.ts` are used. `exclude_paths` makes the sanitizer completely skip matching files/folders without logs or masking.

## 18. Risks & Limitations

**Risk: Regex bugs in Sanitizer** → Mitigation: Stateless implementation, no global regex, clear testing  
**Risk: False positives in PII detection** → Mitigation: Conservative regex patterns, user can see what is masked in logs  
**Limitation v1:** No AI/LLM integration, only template-based transformation. No automatic code changes.

## 19. Stretch Goals (v2+)

- LLM integration (optional, still offline-first as default)
- WebView UI for better markdown display
- More sanitizer patterns (credit cards, etc.)
- Customizable templates
- Batch processing of multiple files

## 20. PR Checklist (auto in PR template)

* [ ] Lint OK · [ ] Tests green · [ ] Coverage ≥ gate
* [ ] Doc-audit OK · [ ] A11y OK · [ ] Zero-hardcoding OK
* [ ] `.env.example` updated · [ ] No secrets in git

## 21. Status & Documentation

**Status:** Implementation in progress (v1)  
**Date:** 2025  
**Branch:** main  
**Owner:** DevOps team  
**Documentation:** See IMPLEMENTATION_PLAN.md for detailed implementation plan

## 22. Conclusion

The goal is a **testable, documented, scalable MVP** with measurable gates.

---

## 🔩 Appendices (copy into repo unchanged)

### `.github/workflows/backend.yml`

name: backend
on: [push, pull_request]
jobs:
test:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4
- uses: actions/setup-python@v5
with: { python-version: '3.11' }
- name: Install
run: |
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install pytest pytest-cov
- name: Lint & Type
run: |
cd backend
source .venv/bin/activate
black --check .
ruff check .
mypy .
- name: Tests with coverage
run: |
cd backend
source .venv/bin/activate
pytest -q --cov=src --cov-report=term --cov-report=xml
- name: Coverage gate (≥70%)
run: |
cd backend
python - << 'PY'
import xml.etree.ElementTree as ET
pct=float(ET.parse('coverage.xml').getroot().attrib['line-rate'])*100
print(f"backend coverage: {pct:.2f}%")
assert pct>=70, f"Coverage gate failed: {pct:.2f}% < 70%"
PY

### `.github/workflows/frontend.yml`

name: frontend
on: [push, pull_request]
jobs:
test:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
with: { node-version: '20' }
- name: Install
run: |
cd frontend
npm ci || npm install
- name: Lint & Format
run: |
cd frontend
npm run lint || npx eslint .
npm run format:check || npx prettier -c .
- name: Tests with coverage
run: |
cd frontend
npx vitest run --coverage --reporter=verbose
- name: Coverage gate (≥60%)
run: |
cd frontend
node -e "const fs=require('fs'); const r=JSON.parse(fs.readFileSync('coverage/coverage-summary.json','utf8')); const pct=r.total.statements.pct; console.log('frontend coverage:',pct+'%'); if(pct<60){process.exit(1)}"

### `scripts/verify_docs.sh`

#!/usr/bin/env bash
set -euo pipefail

# Adjust endpoint/port according to README

API="http://localhost:${BACKEND_PORT:-8000}/api/v1/analyze"
PAYLOAD='{"input":"Hello world"}'
RES=$(curl -s -X POST "$API" -H 'Content-Type: application/json' -d "$PAYLOAD")
echo "$RES" | grep -qi '"result"' || { echo "Doc-audit fail: missing 'result' in response"; exit 1; }
echo "Doc-audit OK"

### `scripts/audit_hardcoded.sh`

#!/usr/bin/env bash
set -euo pipefail
fail=0
grep -RIn --exclude-dir=node_modules --exclude-dir=.venv -E '(http://|https://).*(localhost|api.example|hardcoded)' . && { echo "Warning: Hardcoded URL found"; fail=1; }
grep -RIn --exclude-dir=node_modules --exclude-dir=.venv -E '(SECRET|API_KEY|TOKEN)=[A-Za-z0-9]+' . && { echo "Warning: Possible secret in code"; fail=1; }
exit $fail

### `scripts/a11y_ci.mjs`

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
const url = process.env.A11Y_URL || 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url);
const results = await new AxeBuilder({ page }).analyze();
console.log(`Violations: ${results.violations.length}`);
if (results.violations.length > 0) {
console.error(JSON.stringify(results.violations, null, 2));
process.exit(1);
}
await browser.close();

### `.python-version`

3.11.9

### `.nvmrc`

20

### `.github/pull_request_template.md`

### Goal & Scope

* [ ] Matches PRD/ADR

### DoD & Quality

* [ ] Tests green (backend + frontend)
* [ ] Coverage ≥ gates (70/60)
* [ ] Lint/type OK
* [ ] A11y CI OK
* [ ] Doc-audit OK
* [ ] Zero-hardcoding OK
* [ ] `.env.example` updated
* [ ] No secrets in git

---

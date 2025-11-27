# 🧠 `agent.md` — Standardmall v2.2 (Cursor-Ready, 100/100)

## 0. Init-kontrakt (GÖR DETTA FÖRST)

**Mål:** Säkerställ 100/100 redan i första PR genom att skapa alla meta-filer innan funktionell kod.

**Cursor, skapa exakt dessa filer nu:**

1. `.github/workflows/backend.yml` (pytest + coverage gate)
2. `.github/workflows/frontend.yml` (vitest + coverage gate)
3. `scripts/verify_docs.sh` (kör README:s curl-exempel)
4. `scripts/audit_hardcoded.sh` (detektera URL/token i kod)
5. `scripts/a11y_ci.mjs` (Playwright + axe-core)
6. `.python-version` (3.11.9) och `.nvmrc` (20)
7. `LICENSE` (MIT)
8. `.gitignore` (python/node/build/coverage)
9. `.github/pull_request_template.md` (DoD + checklist)

**Godkännandekriterium:** Alla workflows gröna, skript körbara (`chmod +x scripts/*.sh`), PR-mall syns.

---

## 1. Syfte och Scope

– **Projekt:** Nordic Prompt Architect
– **Mål:** VS Code extension för DevOps-teams med offline-first, GDPR-kompatibel kod-sanitization. Ett "Communication Firewall" och "Infrastructure Tool" som crystallizerar vaga krav till tekniska specs, sanitizerar kod för LLM-användning, och genererar checklists för verifiering.
– **Scope:** v1 offline-only med fem primära kommandon (Init Config, Crystallize, Architect, Verify, Compare Selections) + Analyze Safety dry-run. Ingen nätverkskommunikation, inga automatiska kodändringar, bara skapande av nya dokument/rapporter och loggar.
– **Out of scope:** AI/LLM-integration i v1, WebView UI, automatisk kodändring, molnprocessering

## 2. Affärsregler

– **KRITISKA REGLER:**
  - v1 får **INTE** göra nätverksanrop (offline-first)
  - Pluginet **ALDRIG** får ändra användarens kod – bara skapa nya dokument
  - Alla transformationer är statiska, template-baserade och deterministiska
  - Ingen användning av "any" i TypeScript – strict typing överallt
  - All känslig datahantering måste vara lokal och transparent, med logging

**Verifieras genom:** 
- Code review (inga HTTP/HTTPS imports eller fetch-anrop)
- Manuell test (verifiera att ingen kod ändras, bara nya docs skapas)
- TypeScript strict mode (ingen "any" tillåten)
- Logger visar all aktivitet transparent

## 3. Teknisk Arkitektur

**Stack:** TypeScript, VS Code Extension API · **Test:** Manuell testning + valfritt unit test för Sanitizer · **CI:** (kommer i framtida versioner) · **Kodstil:** Strict TypeScript, no "any", offline-first

**DevOps-filosofi:** "Zero magic, total control" – offline-first, Configuration-as-Code, brutal transparency (logs), Privacy (GDPR/PII masking)

**Repo-struktur:**

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

## 4. Lokal Körning (2-kommando-garanti)

**Bygg extension:** `npm install && npm run compile`  
**Testa extension:** Öppna projektet i VS Code, tryck F5 för att öppna Extension Development Host, testa kommandona via Command Palette (Ctrl+Shift+P)

## 5. CI "Local-First" Policy & Onboarding

- Kör lokalt innan push: `npm run compile && npm run lint` (fail lokalt ⇒ ingen push).  
- **Offline-first:** Alla transformationer är lokala, inga nätverksanrop i v1.  
- **Onboarding:** Vid första installation ska extensionen visa info-toast som uppmanar att köra `SuperPrompt: Initialize Config`. Kommandot skapar `.superpromptrc.json`, loggar resultatet och visar att systemet körs med säkra defaults om filen saknas (safe mode).

## 6. VS Code Kommandon

**superprompt.initConfig:** Skapar `.superpromptrc.json` med säkra defaults, visar onboarding-notis och loggar konfiguration  
**superprompt.crystallize:** Transformera vag text (email, Slack, Jira) → teknisk spec med riskanalys, acceptance criteria, diplomatiskt svar  
**superprompt.architect:** Sanitize vald kod och wrappa i prompt-mall med ROLE, SECURITY CONTEXT, TASK, MASKED CODE  
**superprompt.verify:** Generera checklist från spec för manuell verifiering  
**superprompt.compareSelections:** Jämför exakt två markeringar och genererar en teknisk diff-rapport (Skillnader, Version A/B, rekommendation)  
**superprompt.analyzeSafety:** Kör Security Engine i dry-run och loggar träffar utan att ändra text

Alla kommandon: kräver vald text (eller två markeringar för Compare), öppnar resultat i split view, loggar aktivitet, ändrar aldrig användarens kod. Analyze Safety arbetar endast via loggern. Stora selectioner (>100k tecken) triggar varning innan körning.

## 7. Definition of Done (DoD)

- Alla fyra kommandon fungerar (Init Config, Crystallize, Architect, Verify) + Compare Selections-rapporten
- Sanitizer maskerar känslig data korrekt (personnummer, email, IPv4, tokens)
- Config-läsning fungerar (med och utan .superpromptrc.json)
- Logger visar korrekt information i OutputChannel
- Inga nätverksanrop i v1
- Inga automatiska ändringar av användarens kod
- Strict TypeScript, ingen "any"
- README.md komplett med instruktioner

## 8. Testningsmatris (Regel → Test)

| Regel                                    | Testmetod                          | Status |
| ---------------------------------------- | ---------------------------------- | ------ |
| Inga nätverksanrop                       | Code review (inga HTTP/fetch)      | ☐      |
| Ingen kodändring, bara nya docs          | Manuell test                       | ☐      |
| Sanitizer maskerar personnummer         | Security sanity check              | ☐      |
| Sanitizer maskerar email                 | Security sanity check              | ☐      |
| Config-läsning fungerar                  | Manuell test (med/utan .superpromptrc.json) | ☐      |
| Alla tre kommandon fungerar              | Manuell funktionstest              | ☐      |
| Split view öppnas korrekt                | Manuell funktionstest              | ☐      |
| Init-config onboarding fungerar          | Kör `superprompt.initConfig` + kolla logg | ☐ |
| Compare Selections genererar korrekt rapport | Markera två block, kör kommando       | ☐      |

## 9. Kvalitetskrav (NFR)

Säkerhet, Prestanda, A11y, UX, Observability – se 9.5, 10, 11 och CI.

### 9.5 a11y-Checklist (CI-testbar)

* [ ] `aria-label` på interaktiva element
* [ ] `aria-live="polite"` för dynamik
* [ ] Kontrast ≥4.5:1
* [ ] Synlig focus-state, keyboard-nav
* [ ] `aria-hidden` för dold text
* [ ] Dark-mode kontrast
  **CI:** `node scripts/a11y_ci.mjs` (Playwright + axe-core)

## 10. Zero-Hardcoding Audit

* [ ] Inga hårdkodade URL:er/tokens
* [ ] Alla konstanter via `.env`
* [ ] Språksträngar via i18n
  **CI:** `scripts/audit_hardcoded.sh`

## 11. Offline-First & GDPR

**v1 är helt offline:** Inga HTTP-anrop, inga externa LLM APIs, inga molndependencies. Alla transformationer är statiska, template-baserade och deterministiska.  
**GDPR-kompatibel:** Security Engine v2 maskerar personnummer, email, telefonnummer, IPv4/IPv6 och API-nycklar med tokens (t.ex. `<PNR_REDACTED>`, `<API_KEY_SECURED>`) innan kod skickas vidare.  
**Exclude-policies:** `security.exclude_paths` gör att sanitizer ignorerar test-/mock-/fixture-mappar (glob-first) helt för att undvika falska positiva.  
**Dry-run:** Kommandot `superprompt.analyzeSafety` låter användaren köra sanitizer i read-only-läge och se resultatet i loggarna utan att texten ändras.

## 12. Teststrategi

**v1:** Manuell funktionstest + security sanity check + valfritt unit test för Sanitizer (den mest riskabla delen).  
**Framtida versioner:** Unit tests med vitest/jest, integrationstester.

## 13. Coverage Gates (CI-hårda)

Backend min **70 %**, Frontend min **60 %**. Fail gate ⇒ blockera PR.

## 14. CI/CD-Pipeline (ska redan finnas)

Backend-job: black/ruff/mypy + pytest-cov + gate
Frontend-job: eslint/prettier + vitest-coverage + gate

## 15. Dokumentations-Audit

**CI:** `scripts/verify_docs.sh` validerar README:s curl-exempel.

## 16. Troubleshooting & FAQ

Tabell med vanliga fel (venv, CORS, port, versionsmismatch) och lösning.

## 17. Konfiguration (.superpromptrc.json)

Extensionen letar efter `.superpromptrc.json` i workspace root. Exempel:

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

Om filen saknas, används defaults från `config/defaults.ts`. `exclude_paths` gör att sanitizer helt hoppar över matchande filer/mappar utan loggar eller maskning.

## 18. Risker & Begränsningar

**Risk: Regex-buggar i Sanitizer** → Mitigation: Stateless implementation, inga global regex, tydlig testning  
**Risk: Falska positiva i PII-detektering** → Mitigation: Konservativa regex-mönster, användaren kan se vad som maskas i loggarna  
**Begränsning v1:** Ingen AI/LLM-integration, bara template-baserad transformation. Ingen automatisk kodändring.

## 19. Stretch Goals (v2+)

- LLM-integration (valfritt, fortfarande offline-first som default)
- WebView UI för bättre markdown-visning
- Fler sanitizer-mönster (kreditkort, etc.)
- Anpassningsbara templates
- Batch-processing av flera filer

## 20. PR-Checklista (auto i PR-mall)

* [ ] Lint OK · [ ] Tester gröna · [ ] Coverage ≥ gate
* [ ] Doc-audit OK · [ ] A11y OK · [ ] Zero-hardcoding OK
* [ ] `.env.example` uppdaterad · [ ] Inga secrets i git

## 21. Status & Dokumentation

**Status:** Implementation pågår (v1)  
**Datum:** 2024  
**Branch:** main  
**Ägare:** DevOps-team  
**Dokumentation:** Se IMPLEMENTATION_PLAN.md för detaljerad implementation plan

## 22. Slutsats

Målet är **testbar, dokumenterad, skalbar MVP** med mätbara grindar.

---

## 🔩 Bilagor (kopiera in i repo oförändrat)

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

# Anpassa endpoint/port efter README

API="[http://localhost:${BACKEND_PORT:-8000}/api/v1/analyze](http://localhost:${BACKEND_PORT:-8000}/api/v1/analyze)"
PAYLOAD='{"input":"Hello world"}'
RES=$(curl -s -X POST "$API" -H 'Content-Type: application/json' -d "$PAYLOAD")
echo "$RES" | grep -qi '"result"' || { echo "Doc-audit fail: saknar 'result' i svar"; exit 1; }
echo "Doc-audit OK"

### `scripts/audit_hardcoded.sh`

#!/usr/bin/env bash
set -euo pipefail
fail=0
grep -RIn --exclude-dir=node_modules --exclude-dir=.venv -E '(http://|https://).*(localhost|api.example|hardcoded)' . && { echo "Varning: Hårdkodad URL hittad"; fail=1; }
grep -RIn --exclude-dir=node_modules --exclude-dir=.venv -E '(SECRET|API_KEY|TOKEN)=[A-Za-z0-9]+' . && { echo "Varning: Möjlig secret i kod"; fail=1; }
exit $fail

### `scripts/a11y_ci.mjs`

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
const url = process.env.A11Y_URL || '[http://localhost:3000](http://localhost:3000)';
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

### Mål & Scope

* [ ] Matchar PRD/ADR

### DoD & Kvalitet

* [ ] Tester gröna (backend + frontend)
* [ ] Coverage ≥ gates (70/60)
* [ ] Lint/type OK
* [ ] A11y CI OK
* [ ] Doc-audit OK
* [ ] Zero-hardcoding OK
* [ ] `.env.example` uppdaterad
* [ ] Inga secrets i git

---


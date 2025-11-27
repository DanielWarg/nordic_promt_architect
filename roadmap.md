Nordic Prompt Architect — Master Roadmap

Denna roadmap beskriver resan från fungerande MVP till “Enterprise Gold Standard”.
Allt här ingår i den långsiktiga backloggen och bygger på de tre kärnmotorerna: Crystallize, Architect och Verify.

🏁 Fas 1: Core Foundation — Stabilisering av MVP

Mål: En robust, förutsägbar och kraschsäker grund.

- [x] **Robust Config Loader**  
  - [x] Extensionen ska läsa .superpromptrc.json automatiskt vid start  
  - [x] Hot Reload: uppdateringar av config-filen ska läsas utan att VS Code startas om  
  - [x] Fallback till säkra default-värden om config saknas eller är korrupt

- [x] **Transparent Logging — “The Trust Layer”**  
  - [x] Ny Output-kanal: “Nordic Prompt Logs”  
  - [x] Logga allt: config loaded, sanitizer startad, patterns hittade, template applicerad  
  - [x] Tidsstämplar och prestandamått: “Sanitization completed in 12ms”

- [x] **Error Handling & Graceful Degradation**  
  - [x] Extensionen får aldrig krascha hårt  
  - [x] Fel loggas tyst i output-kanalen (logger.error + VS Code warning)  
  - [x] Användaren ser endast varningar vid kritiska hinder
- [x] **First Run Experience / Onboarding**  
  - [x] Visa installationsnotis som instruerar att köra `SuperPrompt: Initialize Config`  
  - [x] Init-kommandot skapar `.superpromptrc.json` med säkra defaults och loggar resultatet  
  - [x] Safe defaults när config saknas + tydlig loggrad “No .superpromptrc.json found. Using secure defaults.”
- [x] **Core Commands & UX Flow**  
  - [x] `superprompt.initConfig` skapar config och logger info  
  - [x] `superprompt.crystallize` genererar specs i split view  
  - [x] `superprompt.architect` sanitizerar kod och öppnar prompt-output  
  - [x] `superprompt.verify` producerar checklista  
  - [x] `superprompt.compareSelections` jämför två markeringar och genererar rapport

🛡️ Fas 2: Security Engine — Sanitizer v2

Mål: “Säkerhetschefen ska älska detta.”

- [x] **Utökad datasäkerhetsdetektion**  
  - [x] Svenska personnummer (alla format)  
  - [x] E-postadresser  
  - [x] Telefonnummer  
  - [x] IP-adresser (IPv4/IPv6)  
  - [x] API-nycklar (OpenAI, AWS, Stripe, generic Bearer tokens)

- [x] **Token-baserad maskering**  
  - [x] <PNR_REDACTED>  
  - [x] <EMAIL_HIDDEN>  
  - [x] <API_KEY_SECURED>

- [x] **Dry-Run Mode (SuperPrompt: Analyze Safety Only)**  
  - [x] Kör analys utan prompt  
  - [x] Skriver rapport i loggen  
  - [x] Ändrar inget innehåll
- [x] **Exclude Paths / Ignore Files**  
  - [x] Ny `security.exclude_paths`-nyckel i `.superpromptrc.json` (t.ex. `**/tests/**`, `mocks/**`)  
  - [x] Sanitizer hoppar över dessa paths helt utan maskning eller varningar  
  - [x] Dokumentera default-lista och hur den kan utökas

💎 Fas 3: Crystallize Engine — Kravhantering v2

Mål: Gör vag text till hård, teknisk specifikation.

- [ ] **The “Tech Spec” Template**  
  - [ ] Kontext  
  - [ ] Blockers  
  - [ ] Risker  
  - [ ] Acceptance Criteria  
  - [ ] Tekniska beroenden

- [ ] **The “Diplomat” Template**  
  - [ ] “Detta är nästa steg”  
  - [ ] “Detta blockerar oss”  
  - [ ] “Föreslagen lösning”

- [ ] **Kommando: SuperPrompt – Crystallize Requirements**  
  - [ ] Appliceras på markerad text  
  - [ ] Output i split view

🏗️ Fas 4: Architect Engine — Kod & Promptdesign

Mål: Få juniorer att skriva seniora prompter och kodspecar.

- [ ] **Context-Wrapping Framework**  
  - [ ] Persona-baserade mallar (Senior TS-arkitekt m.fl.)  
  - [ ] Strikt best practice-instruktioner

- [ ] **Language Awareness**  
  - [ ] TS / JS  
  - [ ] Python  
  - [ ] C#  
  - [ ] Java  
  - [ ] Språk-specifika instruktioner

- [ ] **Split View Guarantee**  
  - [ ] Ny flik  
  - [ ] ViewColumn.Beside  
  - [ ] Aldrig skriva över originalfil

✅ Fas 5: Verify Engine — Compliance v1

Mål: Göra kvalitetssäkring automatiserad.

- [ ] **Definition of Done Generator**  
  - [ ] Acceptance Criteria  
  - [ ] Testcases  
  - [ ] Risker  
  - [ ] Edge Cases

- [ ] **Kommando: SuperPrompt – Generate DoD Checklist**  
  - [ ] Läser spec  
  - [ ] Skapar checklist i markdown

🏢 Fas 6: Enterprise Features — Skala till 500 utvecklare

- [ ] **Config Schema Validation**  
  - [ ] JSON-schema för .superpromptrc.json  
  - [ ] IntelliSense/autocomplete i VS Code

- [ ] **Custom Templates**  
  - [ ] Läsa `.superprompt/templates/` automatiskt  
  - [ ] Företags-specifika mallar

- [ ] **Offline Enforcer**  
  - [ ] Inställning `force_offline: true`  
  - [ ] Blockera alla nätverksanrop

- [ ] **Framtidssäker modellstruktur**  
  - [ ] `models.architect`  
  - [ ] `models.crystallize`  
  - [ ] `models.verify`

🧠 Fas 7: QA & Quality Engineering

- [ ] **Unit Tester-block (minst 6 tester)**  
  - [ ] Sanitizer maskerar personnummer  
  - [ ] Config reload fungerar  
  - [ ] Architect Engine output korrekt  
  - [ ] Compare-kommandot renderar rätt markdown  
  - [ ] Crystallize ändrar inte inputen  
  - [ ] Error-hantering loggar korrekt

- [ ] **Performance Benchmarks**  
  - [ ] Sanitizer speed  
  - [ ] Regex throughput  
  - [ ] Render time

📦 Fas 8: Packaging & Release

- [ ] **Marketplace Assets**  
  - [ ] Logotyp (Nordic minimalism)  
  - [ ] 4 screenshots  
  - [ ] Demo GIF (Split View)

- [ ] **Dokumentation**  
  - [ ] README.md  
  - [ ] SECURITY.md  
  - [ ] CONFIGURATION.md  
  - [ ] CHANGELOG.md

- [ ] **CI/CD Pipeline**  
  - [ ] Bygg .vsix  
  - [ ] Kör tester  
  - [ ] Publicera vid release

🧠 DevOps-Psykologin — “Känns det som ett verktyg?”

Checklista innan release:  
– Är loggarna “noisy enough”?  
– Är UI:t 100% tyst vid framgång?  
– Är felmeddelanden lugna och begripliga?  
– Är allt snabbt nog att kännas “instant”?  
– Känns det som ett arbetsverktyg, inte en lekstuga?


# Nordic Prompt Architect - Implementation Plan

## Översikt

Detta dokument beskriver implementationen av VS Code extensionen "Nordic Prompt Architect" v1 - en offline-first, GDPR-kompatibel verktyg för DevOps-teams.

**Filosofi:** "Zero magic, total control"  
**Mål:** Kommunikationsfirewall och infrastrukturverktyg för professionella DevOps- och backend-team

---

## Steg 1: Uppdatera agent.md med projektspecifik information

Uppdatera `agent.md` med:
- Projektnamn: Nordic Prompt Architect
- Mål: VS Code extension för DevOps-teams med offline-first, GDPR-kompatibel kod-sanitization
- Scope: v1 offline-only med tre kommandon (Crystallize, Architect, Verify)
- Teknisk stack: TypeScript, VS Code Extension API
- Filstruktur: enligt spec (src/extension.ts, core/, security/, ui/, templates/, config/)
- DevOps-filosofi: "Zero magic, total control", offline-first, GDPR
- **KRITISKA REGLER:**
  - v1 får **INTE** göra nätverksanrop
  - Pluginet **ALDRIG** får ändra användarens kod – bara skapa nya dokument

## Steg 2: Skapa projektstruktur och konfigurationsfiler

Skapa grundläggande filer:
- `package.json` - VS Code extension manifest med kommandon och activation events (main: ./dist/extension.js)
- `tsconfig.json` - Strict TypeScript-konfiguration (strict: true)
- `.vscodeignore` - Exkludera onödiga filer från paketering
- `.gitignore` - Node modules, build artifacts, etc.
- `README.md` - Projektbeskrivning och instruktioner
- `LICENSE` - MIT-licens
- `CHANGELOG.md` - Versionshistorik (för framtida versioner)

## Steg 3: Skapa mappstruktur och stub-filer

Skapa mappstrukturen enligt spec:
```
src/
  extension.ts
  config/
    configuration.ts
    defaults.ts
  core/
    types.ts
    ArchitectEngine.ts
    CrystallizeEngine.ts
    VerifyEngine.ts
  security/
    Sanitizer.ts
    patterns.ts
  ui/
    Logger.ts
    ViewManager.ts
  templates/
    prompts.ts
    system.ts
```

**Viktigt:**
- Alla filer ska exportera något, även om det bara är tomma klasser/funktioner först
- Sätt upp grund-interfaces i `core/types.ts` direkt (Config, SanitizerResult, EngineResult etc.), så resten kan luta sig mot det

## Steg 4: Implementera infrastruktur (Logger, ViewManager, Config)

- **Logger.ts**: 
  - Skapa OutputChannel "Nordic Prompt Logs"
  - Metoder: info(), warn(), error()
  
- **ViewManager.ts**: 
  - Helper som tar en markdown-sträng och öppnar ny editor i ViewColumn.Beside
  
- **defaults.ts**: 
  - Rimliga defaults (STRICT security, offline, svensk roll)
  
- **configuration.ts**: 
  - Försök läsa `.superpromptrc.json` från workspace root
  - Om fel eller saknas → logga WARN, använd defaults
  - **Bonus:** Helper som loggar vilken config som faktiskt används:
    - `[INFO] Loaded config: mode=STRICT, language=sv, provider=offline`

## Steg 5: Implementera security (Sanitizer och patterns)

Detta är hjärtat av extensionen.

- **patterns.ts**: Regex-definitioner för:
  - Svenska personnummer (YYYYMMDD-XXXX format)
  - Email-adresser
  - IPv4-adresser
  - Generiska tokens (typ sk- och 30+ tecken random)
  
- **Sanitizer.ts**: 
  - `sanitize(input: string, activePatterns: string[]): { sanitizedText, findings[] }`
  - Absolut stateless, inga konstiga global-regex-buggar
  - Låt Logger logga antal träffar per typ (inte varje match, det blir för mycket)
  
- **Bonus:** Ett litet internt "SafetyTest"-exempel (behöver inte vara riktig testfil) så du kan mata in en sträng och visuellt se att maskningen funkar

## Steg 6: Implementera templates

- **system.ts**: 
  - Rubriker, standardtexter (# ROLL, # SÄKERHETSKONTEXT osv.)
  
- **prompts.ts**: 
  - `getArchitectMarkdown(...)` - ROLE, SECURITY CONTEXT, TASK, MASKED CODE
  - `getCrystallizeMarkdown(...)` - technical analysis, acceptance criteria, diplomatic response
  - `getVerifyChecklistMarkdown(...)` - checklist/Definition of Done
  
Håll templates så enkla som möjligt i v1 – kan alltid göra dem "smartare" sen.

## Steg 7: Implementera engines

- **CrystallizeEngine.ts**: 
  - `run(input: string, config: Config): string` (markdown)
  - Template-baserad transformation av vag text → spec
  - Ingen AI, bara templates + lite enkel parsing
  
- **ArchitectEngine.ts**:
  - `run(input: string, config: Config, sanitizerResult: SanitizerResult): string` (markdown)
  - Wrapar sanitized code i markdown-template med ROLE, SECURITY CONTEXT, TASK, CODE
  - Använder templates från prompts.ts
  
- **VerifyEngine.ts**:
  - `run(specText: string): string` (markdown-checklist)
  - Parsar spec-text och extraherar krav
  - Genererar markdown-checklist för manuell verifiering
  - Ingen automatisk bedömning

## Steg 8: Wire everything i extension.ts

- **activate()**: 
  - Skapa singelton-instans av: logger, configService, sanitizer, engines, viewManager
  - Registrera tre kommandon:
    - `superprompt.crystallize` - hämtar selection, läser config, kör CrystallizeEngine, öppnar resultat via ViewManager
    - `superprompt.architect` - hämtar selection, läser config, sanitizerar, kör ArchitectEngine, öppnar resultat
    - `superprompt.verify` - hämtar selection, kör VerifyEngine, öppnar checklist
  - Varje kommando: loggar innan/efter (och ev. findings)
  - Retur om ingen selection
  - Hantera fel gracefully (inga kraschar)

## Steg 9: Testa och verifiera

Dela upp i tre delar:

- **Manuell funktionstest:**
  - Alla tre kommandon funkar
  - Split view funkar
  - Config påverkar beteende
  
- **Security sanity check:**
  - Stoppad teststräng med personnummer och e-mail → blir maskad
  - Verifiera att sanitizer hittar och maskerar känslig data korrekt
  
- **(Valfritt) Unit test för Sanitizer:**
  - Detta är den mest riskabla delen, så en minimal unit test kan vara värdefull

### To-dos

- [x] Uppdatera agent.md med projektspecifik information (projektnamn, mål, scope, teknisk stack, filstruktur)
- [x] Skapa package.json, tsconfig.json, .vscodeignore, .gitignore och mappstruktur med stub-filer
- [x] Implementera Logger.ts, ViewManager.ts, defaults.ts och configuration.ts
- [x] Implementera patterns.ts med regex-definitioner och Sanitizer.ts med stateless sanitize-funktion
- [x] Implementera system.ts och prompts.ts med markdown-mallar för alla tre engines
- [x] Implementera CrystallizeEngine.ts, ArchitectEngine.ts och VerifyEngine.ts med template-baserad logik
- [x] Implementera extension.ts med activate(), kommandoregistrering och wiring av alla komponenter
- [x] Manuell testning av alla kommandon, sanitization, config-läsning och UI-beteende

---

## Faser för implementation (översikt)

**Fas 1 – Grund och ramverk** (Steg 1–3)
- Uppdatera agent.md med filosofi, scope, kritiska regler
- Skapa package.json, tsconfig.json, .vscodeignore, .gitignore, README, LICENSE, CHANGELOG
- Skapa src/-struktur och tomma filer med exports + grundtyper i core/types.ts
- **Resultat:** Projektet finns, öppnar fint i VS Code/Cursor, allt är stilla men korrekt strukturerat

**Fas 2 – Infrastruktur** (Steg 4)
- Logger.ts, ViewManager.ts, defaults.ts, configuration.ts
- **Resultat:** Du kan redan nu logga saker och öppna "fejk-output" i en sidoflik. Bra läge att testköra extensionen första gången

**Fas 3 – Säkerhetshjärtat** (Steg 5)
- patterns.ts, Sanitizer.ts, safety test
- **Resultat:** Du har nu en riktig kärnfunktion: klistrar du in känslig text kan du se i loggarna och output hur den maskas

**Fas 4 – Templates och engines** (Steg 6–7)
- system.ts, prompts.ts, alla tre engines
- **Resultat:** Du kan lokalt generera riktigt snygga markdown-dokument utan AI

**Fas 5 – Koppla ihop allt** (Steg 8)
- extension.ts med singeltons, kommandoregistrering, wiring
- **Resultat:** Pluginet "känns på riktigt" – du använder det i VS Code som om du vore kund

**Fas 6 – Test och finlir** (Steg 9)
- Manuell test, security sanity check, valfritt unit test
- **Resultat:** Färdig v1 som är redo för användning

---

## Konfiguration (.superpromptrc.json)

Extensionen letar efter `.superpromptrc.json` i workspace root. Exempel schema:

```json
{
  "project": {
    "name": "Payment Service Backend",
    "language": "sv",
    "environment": "node-typescript"
  },
  "security": {
    "mode": "STRICT",
    "allow_cloud_processing": false,
    "mask_patterns": ["se_personnummer", "email", "ipv4", "api_key"]
  },
  "templates": {
    "role": "Senior DevOps Engineer"
  }
}
```

Om filen saknas eller är ogiltig, används defaults från `config/defaults.ts`.

---

## VS Code Kommandon

Tre kommandon registreras:

1. **superprompt.crystallize** - Transformera vag text till teknisk spec
2. **superprompt.architect** - Sanitize kod och wrappa i prompt-mall
3. **superprompt.verify** - Generera checklist från spec

Alla kommandon:
- Kräver vald text i editorn
- Öppnar resultat i split view (ViewColumn.Beside)
- Loggar aktivitet i "Nordic Prompt Logs" OutputChannel
- Ändrar aldrig användarens kod

---

## Säkerhetsmönster (patterns.ts)

Följande mönster maskeras:

- **Svenska personnummer:** YYYYMMDD-XXXX format
- **Email-adresser:** Standard email regex
- **IPv4-adresser:** Standard IPv4 regex
- **API-nycklar/tokens:** 
  - `sk-...` (OpenAI-style)
  - AWS-style keys (AKIA..., etc.)
  - 30+ tecken random strings

Maskering sker med placeholders:
- `<PNR_REDACTED>`
- `<EMAIL_REDACTED>`
- `<IP_REDACTED>`
- `<SECRET_HIDDEN>`

---

## Logging

All aktivitet loggas till OutputChannel "Nordic Prompt Logs":

- Config-laddning (success/failure)
- Kommandon som körs
- Sanitizer-findings (antal per typ, inte varje match)
- Template-applikation
- Fel (med stack traces i debug-läge)

---

## Definition of Done

- [x] Plan dokumenterad (denna fil)
- [x] Alla steg 1-9 implementerade
- [x] Alla tre kommandon fungerar
- [x] Sanitizer maskerar känslig data korrekt
- [x] Config-läsning fungerar (med och utan .superpromptrc.json)
- [x] Logger visar korrekt information
- [x] Inga nätverksanrop i v1
- [x] Inga automatiska ändringar av användarens kod
- [x] README.md komplett med instruktioner
- [x] LICENSE och CHANGELOG på plats


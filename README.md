# Nordic Prompt Architect

**The Communication Firewall for DevOps, Backend Engineers & Senior Prompt Designers**  
**“Zero Magic. Total Control.”**

Nordic Prompt Architect är en VS Code-extension byggd för utvecklare som kräver säkerhet, transparens och deterministiskt beteende. Det är inte en chatbot – utan ett verktyg som formaliserar krav, kod och kvalitet:

- **Crystallize** – Vag text → Tekniska specifikationer  
- **Architect** – Kod → Sanerad prompt  
- **Verify** – Spec → Definition of Done  
- **Security Engine** – Sanitizer v2 med maskning, exclude paths och safety-analyser

All logik körs lokalt, offline, template-baserat.

---

# 1. Filosofi

1. **Zero Magic** – Inga nätverksanrop, ingen dold AI. All transformation är deterministisk.  
2. **Total Control** – Extensionen ändrar aldrig dina filer; allt öppnas i nya flikar.  
3. **Transparent by Design** – All aktivitet loggas i “Nordic Prompt Logs”.  
4. **Built for Skeptical Engineers** – All config, mönster och templates är synliga och kontrollerbara.

---

# 2. Funktioner

## Crystallize Requirements (Text → Spec)
- Tolkar vag text (Slack, mail, Jira) till tekniska dokument  
- Inkluderar kontext, blockers, risker, acceptance criteria och en diplomatisk “reply”  
- Output i split view (markdown)  
**Command:** `superprompt.crystallize` (Alt+Shift+C)

## Architect Mode (Code → Prompt)
- Maskerar känslig data med Security Engine v2  
- Wrappas i LLM-vänlig template (persona, kontext, uppgift)  
- Output i split view (markdown)  
**Command:** `superprompt.architect` (Alt+Shift+A)

## Verify (Spec → Definition of Done)
- Genererar checklistor baserat på spec  
- Ingen automatisk bedömning; underlättar manuell QA  
**Command:** `superprompt.verify` (Alt+Shift+V)

## Analyze Safety (Dry-Run)
- Kör säkerhetsanalys utan att ändra text  
- Loggar träffar per mönster i “Nordic Prompt Logs”  
- Visar diskret toast: “Safety analysis complete – see Nordic Prompt Logs.”  
**Command:** `superprompt.analyzeSafety`

## Initialize Config
- Skapar `.superpromptrc.json` med säkra defaults  
**Command:** `superprompt.initConfig`

---

# 3. Security Engine v2

## Mönster & maskering
- Svenska personnummer (flera format)  
- Email-adresser  
- Telefonnummer  
- IPv4 & IPv6  
- API-nycklar (OpenAI `sk-`, AWS `AKIA`, Bearer tokens)  

Maskering sker med tokens som `<PNR_REDACTED>`, `<EMAIL_HIDDEN>`, `<API_KEY_SECURED>`, etc.

## Exclude paths (glob-first)
I `.superpromptrc.json` kan du exkludera mappar/filer (samma syntax som `.gitignore`).  
Exempel:

```json
"security": {
  "mask_patterns": ["se_personnummer", "email", "ipv4", "api_key"],
  "exclude_paths": ["**/tests/**", "**/*.spec.ts", "mocks/**"]
}
```

Matcherade filer ignoreras helt (ingen maskning, inga loggar).

## Dry-run: Analyze Safety
Kör `superprompt.analyzeSafety` för att få counts/loggar utan att ändra text eller skapa prompt.

---

# 4. Konfiguration (.superpromptrc.json)

Skapa snabbt via "Initialize .superpromptrc" eller kopiera från `.superpromptrc.example.json` i repot.

Exempel:

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
    "exclude_paths": ["**/tests/**", "mocks/**"]
  },
  "templates": {
    "role": "Senior Backend Engineer"
  }
}
```

Om filen saknas eller är ogiltig:
- Extensionen faller tillbaka på `DEFAULT_CONFIG`  
- Mild varning visas  
- Loggar innehåller detaljer  

---

# 5. First Run Experience

När extensionen installeras:
- Engångs-toast: “Nordic Prompt Architect installed. Run ‘Initialize Config’ …”  
- Kör du kommandon utan config används säkra defaults  
- Logger berättar om konfigurationen kör på defaults eller projektvärden  

---

# 6. Kommandon & Keybindings

| Kommando | ID | Shortcut |
| --- | --- | --- |
| Crystallize | `superprompt.crystallize` | Alt+Shift+C |
| Architect | `superprompt.architect` | Alt+Shift+A |
| Verify | `superprompt.verify` | Alt+Shift+V |
| Analyze Safety Only | `superprompt.analyzeSafety` | – |
| Initialize Config | `superprompt.initConfig` | – |

---

# 7. Logging – Nordic Prompt Logs

Output channel: **Nordic Prompt Logs**  
Loggar bl.a.:
- Config load/reload (mode, language)  
- Kommandon start/slut  
- Sanitizer-statistik (träffar per mönster, skipped)  
- Fel (invalid config, parse errors) med stack-trace  

---

# 8. Installation & Development

```bash
npm install
npm run compile
npm run watch
```

1. Klona repo  
2. Öppna i VS Code  
3. Tryck F5 för Extension Development Host  
4. Kör kommandon via Command Palette  

---

# 9. Licens & Contributing

Licens: Dual Licensing (MIT för Community Edition, Commercial för Pro/Enterprise)  

Bidrag:
- Följ “Zero Magic / Total Control”  
- Inga nätverksanrop i extensionen  
- All transformation ska vara deterministisk och transparent  
- Se `IMPLEMENTATION_PLAN.md` och `roadmap.md` för nästa steg  

---  

Behöver du SECURITY.md, CONFIGURATION.md, CHANGELOG.md eller marketplace-text? Säg bara till.
# Nordic Prompt Architect

**Communication Firewall and Infrastructure Tool for DevOps Teams**

> "Zero Magic, Total Control"

Nordic Prompt Architect är en VS Code extension designad för skeptiska DevOps-ingenjörer och backend-utvecklare som bryr sig djupt om säkerhet, tydlighet och kontroll.

## Filosofi

Detta är **INTE** en generisk AI-chat-assistent. Det är ett "Communication Firewall" och "Infrastructure Tool" som:

- **Crystallizerar** vaga krav till tydliga tekniska specs
- **Sanitizerar** kod och wrappar den i strukturerad kontext för LLM-verktyg
- **Genererar** checklists från specs för självgranskning (inte automatisk bedömning)

## v1 Features (Offline-Only) - Community Edition

### 🎯 Crystallize Requirements (Free)
Transformera vag text (email, Slack, Jira) till teknisk spec med:
- Teknisk analys (risker, blockers, oklarheter)
- Föreslagna acceptance criteria
- "Diplomatiskt svar" som utvecklaren kan kopiera tillbaka till stakeholder

### 🏗️ Architect Prompts (Code → Prompt) - Premium Feature
Sanitize vald kod och wrappa i prompt-mall:
- Lokal, stateless regex-baserad sanitizer
- Maskerar personnummer, email, IPv4, API-nycklar
- Wrapar i markdown-template med ROLE, SECURITY CONTEXT, TASK, MASKED CODE
- **Note:** Architect med avancerad sanitization och enterprise-policies kommer i Pro/Enterprise-versionen

### ✅ Verify (Checklist Generator) (Free)
Generera checklist från spec för manuell verifiering:
- Extraherar krav från specifikation
- Genererar "Definition of Done" checklist
- **Inte** en automatisk pass/fail-system, bara en hjälp för manuell verifiering

## Edition Comparison

| Feature | Community (This Repo) | Pro/Enterprise |
|---------|----------------------|----------------|
| Crystallize | ✅ | ✅ Enhanced |
| Architect (Basic) | ✅ | ✅ Advanced sanitization |
| Verify | ✅ | ✅ Enhanced |
| Custom patterns | ✅ | ✅ Enterprise policies |
| Team configs | ✅ | ✅ Centralized management |
| Support | Community | Priority |

## Kritiska Regler

- ✅ v1 gör **INTE** nätverksanrop
- ✅ Pluginet **ALDRIG** ändrar användarens kod – bara skapar nya dokument
- ✅ Alla transformationer är statiska, template-baserade och deterministiska
- ✅ Strict TypeScript, ingen "any"

## Installation

1. Klona detta repo
2. Öppna i VS Code
3. Tryck `F5` för att öppna Extension Development Host
4. Testa kommandona via Command Palette (`Ctrl+Shift+P`)

## Användning

### Snabbstart
1. Öppna Command Palette (`Ctrl+Shift+P` eller `Cmd+Shift+P` på Mac)
2. Kör "Initialize .superpromptrc" för att skapa en konfigurationsfil
3. Använd keybindings eller Command Palette för att köra kommandona

### Keybindings
- `Alt+Shift+C` - Crystallize
- `Alt+Shift+A` - Architect
- `Alt+Shift+V` - Verify

### Crystallize
1. Markera vag text (t.ex. från email eller Slack)
2. Tryck `Alt+Shift+C` eller använd Command Palette
3. Resultatet öppnas i split view som markdown

### Architect
1. Markera kod som ska sanitizeras
2. Tryck `Alt+Shift+A` eller använd Command Palette
3. Resultatet öppnas i split view med maskerad kod i prompt-mall

### Verify
1. Markera spec-text
2. Tryck `Alt+Shift+V` eller använd Command Palette
3. Resultatet öppnas i split view som checklist

## Konfiguration

### Snabbstart
Kör kommandot "Initialize .superpromptrc" från Command Palette för att automatiskt skapa en konfigurationsfil med defaults.

### Manuell konfiguration
Kopiera `.superpromptrc.example.json` till `.superpromptrc.json` i workspace root och justera efter behov, eller skapa manuellt:

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

Om filen saknas, används defaults från extensionen. Du får ett vänligt meddelande första gången i ett workspace.

## Säkerhet

Extensionen maskerar automatiskt:
- Svenska personnummer (YYYYMMDD-XXXX)
- Email-adresser
- IPv4-adresser
- API-nycklar/tokens (sk-..., AWS-style, etc.)

All aktivitet loggas i OutputChannel "Nordic Prompt Logs" för full transparens.

## Development

```bash
npm install
npm run compile
npm run watch  # För kontinuerlig kompilering
```

## Licensing

Nordic Prompt Architect använder **dual licensing**:

### Community Edition (VS Code Extension)

Licens: MIT

Denna version är gratis, öppen och helt lokal/offline.

### Pro & Enterprise Edition

Licens: Commercial Proprietary

Premiumfunktioner (t.ex. avancerad sanitization, enterprise policies,
centrala team-templates, hosted API-tjänster) ingår i Pro/Enterprise och får
inte spridas, forkas eller återanvändas utan avtal.

Se `LICENSE`, `COMMERCIAL_LICENSE` och `LICENSE_OVERVIEW.md` för detaljer.

## Contributing

Se `IMPLEMENTATION_PLAN.md` för detaljerad implementation plan.


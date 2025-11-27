# Nordic Prompt Architect

**The Communication Firewall for DevOps, Backend Engineers & Senior Prompt Designers**  
**"Zero Magic. Total Control."**

Nordic Prompt Architect is a VS Code extension built for developers who demand security, transparency, and deterministic behavior. It's not a chatbot – it's a tool that formalizes requirements, code, and quality:

- **Crystallize** – Vague text → Technical specifications  
- **Architect** – Code → Sanitized prompt  
- **Verify** – Spec → Definition of Done  
- **Security Engine** – Sanitizer v2 with masking, exclude paths, and safety analysis

All logic runs locally, offline, template-based.

---

# 1. Philosophy

1. **Zero Magic** – No network calls, no hidden AI. All transformations are deterministic.  
2. **Total Control** – The extension never modifies your files; everything opens in new tabs.  
3. **Transparent by Design** – All activity is logged in "Nordic Prompt Logs".  
4. **Built for Skeptical Engineers** – All config, patterns, and templates are visible and controllable.

---

# 2. Features

## Crystallize Requirements (Text → Spec)
- Interprets vague text (Slack, email, Jira) into technical documents  
- Includes context, blockers, risks, acceptance criteria, and a diplomatic "reply"  
- Output in split view (markdown)  
**Command:** `superprompt.crystallize` (Alt+Shift+C)

## Architect Mode (Code → Prompt)
- Masks sensitive data with Security Engine v2  
- Wraps in LLM-friendly template (persona, context, task)  
- Output in split view (markdown)  
**Command:** `superprompt.architect` (Alt+Shift+A)

## Verify (Spec → Definition of Done)
- Generates checklists based on spec  
- No automatic assessment; facilitates manual QA  
**Command:** `superprompt.verify` (Alt+Shift+V)

## Analyze Safety (Dry-Run)
- Runs security analysis without modifying text  
- Logs hits per pattern in "Nordic Prompt Logs"  
- Shows discrete toast: "Safety analysis complete – see Nordic Prompt Logs."  
**Command:** `superprompt.analyzeSafety`

## Initialize Config
- Creates `.superpromptrc.json` with safe defaults  
**Command:** `superprompt.initConfig`

---

# 3. Security Engine v2

## Patterns & Masking
- Swedish personal numbers (multiple formats)  
- Email addresses  
- Phone numbers  
- IPv4 & IPv6  
- API keys (OpenAI `sk-`, AWS `AKIA`, Bearer tokens)  

Masking uses tokens like `<PNR_REDACTED>`, `<EMAIL_HIDDEN>`, `<API_KEY_SECURED>`, etc.

## Exclude paths (glob-first)
In `.superpromptrc.json` you can exclude folders/files (same syntax as `.gitignore`).  
Example:

```json
"security": {
  "mask_patterns": ["se_personnummer", "email", "ipv4", "api_key"],
  "exclude_paths": ["**/tests/**", "**/*.spec.ts", "mocks/**"]
}
```

Matched files are completely ignored (no masking, no logs).

## Dry-run: Analyze Safety
Run `superprompt.analyzeSafety` to get counts/logs without modifying text or creating a prompt.

---

# 4. Configuration (.superpromptrc.json)

Create quickly via "Initialize .superpromptrc" or copy from `.superpromptrc.example.json` in the repo.

Example:

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

If the file is missing or invalid:
- Extension falls back to `DEFAULT_CONFIG`  
- Mild warning is shown  
- Logs contain details  

---

# 5. First Run Experience

When the extension is installed:
- One-time toast: "Nordic Prompt Architect installed. Run 'Initialize Config' …"  
- Running commands without config uses safe defaults  
- Logger tells you whether the configuration runs on defaults or project values  

---

# 6. Commands & Keybindings

| Command | ID | Shortcut |
| --- | --- | --- |
| Crystallize | `superprompt.crystallize` | Alt+Shift+C |
| Architect | `superprompt.architect` | Alt+Shift+A |
| Verify | `superprompt.verify` | Alt+Shift+V |
| Analyze Safety Only | `superprompt.analyzeSafety` | – |
| Initialize Config | `superprompt.initConfig` | – |

---

# 7. Logging – Nordic Prompt Logs

Output channel: **Nordic Prompt Logs**  
Logs include:
- Config load/reload (mode, language)  
- Command start/end  
- Sanitizer statistics (hits per pattern, skipped)  
- Errors (invalid config, parse errors) with stack trace  

---

# 8. Installation & Development

```bash
npm install
npm run compile
npm run watch
```

1. Clone repo  
2. Open in VS Code  
3. Press F5 for Extension Development Host  
4. Run commands via Command Palette  

---

# 9. Licensing & Contributing

License: Dual Licensing (MIT for Community Edition, Commercial for Pro/Enterprise)  

Contributing:
- Follow "Zero Magic / Total Control"  
- No network calls in the extension  
- All transformations should be deterministic and transparent  
- See `IMPLEMENTATION_PLAN.md` and `roadmap.md` for next steps  

---

Need SECURITY.md, CONFIGURATION.md, CHANGELOG.md, or marketplace text? Just ask.

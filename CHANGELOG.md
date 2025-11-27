# Nordic Prompt Architect — Changelog

All notable changes to the extension are documented here.

## [v0.2.0] – 2025-02 – Security Engine v2 + Foundation

Major release completing Phase 1 (Foundation & Onboarding) and Phase 2 (Security Engine). Focus on config stability, onboarding, and enterprise-grade sanitization.

### Added
- `DEFAULT_CONFIG` & `SuperPromptConfig` with typed contract (`src/config/defaults.ts`).
- Robust `ConfigurationService` with:
  - Safe load/parse of `.superpromptrc.json`
  - Fallback to defaults on error
  - Hot reload when file is saved
  - `isUsingDefaults()` flag + onboarding warning
- Trust Layer Logger with timestamps & structured errors.
- Security Engine v2:
  - Extended regex patterns (personnummer, email, phone, IPv4/IPv6, OpenAI/AWS/Bearer)
  - Token-based masking (`<PNR_REDACTED>`, `<API_KEY_SECURED>`, etc.)
  - Glob-based `exclude_paths`
  - Dry-run analyze mode (`superprompt.analyzeSafety`)
  - Structured `SanitizerResult` & `SanitizerAnalysis`
- ArchitectEngine & templates updated to show match counts.
- New command `superprompt.analyzeSafety`.
- Updated documentation (README + agent.md) with onboarding & safety details.

### Fixed
- Config load no longer crashes on invalid JSON; always falls back to defaults.
- Logger now records every sanitizer run (counts/skipped).
- Architect command respects `exclude_paths` to avoid false positives.

### Notes
- All commands remain offline and deterministic (Zero Magic, Total Control).
- Security Engine can now be used in dry-run mode to audit selections without modifying text.


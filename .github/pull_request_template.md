## Goal & Scope

* [ ] Matches project requirements (agent.md / roadmap.md)
* [ ] Follows "Zero Magic, Total Control" philosophy

## Definition of Done & Quality

### Code Quality
* [ ] Lint passes (`npm run lint`)
* [ ] TypeScript compiles without errors (`npm run compile`)
* [ ] No `any` types used (strict TypeScript)
* [ ] No network calls (offline-first verified)

### Testing
* [ ] Manual testing completed
* [ ] All commands work as expected
* [ ] No code is modified, only new documents created
* [ ] Logger shows correct information

### Security
* [ ] No hardcoded secrets/tokens
* [ ] Sanitizer tested (if applicable)
* [ ] PII masking verified (if applicable)

### Documentation
* [ ] README.md updated (if needed)
* [ ] CHANGELOG.md updated (if applicable)
* [ ] Code comments clear and helpful

## Critical Rules Compliance

* [ ] ✅ v1 does **NOT** make network calls (offline-first)
* [ ] ✅ Extension **NEVER** modifies user code – only creates new documents
* [ ] ✅ All transformations are static, template-based, and deterministic
* [ ] ✅ Strict TypeScript, no "any"
* [ ] ✅ All sensitive data handling is local and transparent, with logging

## Notes

<!-- Add any additional context, screenshots, or notes here -->


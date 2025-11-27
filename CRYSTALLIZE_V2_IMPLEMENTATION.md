# Crystallize Engine v2 Implementation Plan

## Overview

Upgrade Crystallize Engine från basic templates till intelligent, offline textanalys med **Clarity Score**. Implementera smart parsing som automatiskt extraherar nyckelord, deadlines, teknisk terminologi och strukturerar information i två separata output-format: **Tech Spec** och **Diplomat Template**.

## Architectural Principles

- **Offline First**: No external NLP APIs or libraries. Use only regex/heuristic logic.
- **Language Aware**: Support 'sv' (Swedish) and 'en' (English) based on config.project.language.
- **Zero Magic**: Deterministic behaviour, no randomness.

## Implementation Checklist

### Phase 1: Core Analysis Module

- [ ] Create `src/core/text-analysis/types.ts`
  - Define `TextAnalysisResult` interface with all fields
  - Export from `src/core/types.ts`

- [ ] Create `src/core/text-analysis/PatternMatcher.ts`
  - Implement pattern dictionaries for sv/en
  - Deadline patterns, blocker patterns, risk patterns, ambiguity patterns, technical terms

- [ ] Create `src/core/text-analysis/TextAnalyzer.ts`
  - Implement `analyze()` method
  - Clarity score calculation logic
  - Clarity feedback generation

### Phase 2: Language-Aware Templates

- [ ] Update `src/templates/system.ts`
  - Add language-aware `getHeaders()` and `getTexts()` functions
  - Support sv/en

- [ ] Update `src/templates/prompts.ts`
  - Implement `getTechSpecMarkdown()` with Clarity Score
  - Implement `getDiplomatMarkdown()` with professional format
  - Handle empty arrays with "no data" messages

### Phase 3: Engine Update

- [ ] Update `src/core/CrystallizeEngine.ts`
  - Inject TextAnalyzer
  - Add `generateTechSpec()` method
  - Add `generateDiplomat()` method
  - Update `run()` for backward compatibility

### Phase 4: Commands & Integration

- [ ] Update `src/extension.ts`
  - Add `superprompt.crystallizeSpec` command
  - Add `superprompt.crystallizeDiplomat` command
  - Keep `superprompt.crystallize` as alias

- [ ] Update `package.json`
  - Add new commands to activationEvents
  - Add command definitions

### Phase 5: Verification

- [ ] Run `npm run compile` - must pass
- [ ] Run `npm run verify` - must pass
- [ ] Manual testing:
  - Swedish input → Swedish output
  - English input → English output
  - Vague text → Low clarity score
  - Clear text → High clarity score

### Phase 6: Git & CI

- [ ] Commit all changes
- [ ] Push to `feature/crystallize-v2` branch
- [ ] Verify CI Actions run successfully

## File Structure

```
src/
  core/
    text-analysis/           # NEW
      types.ts
      PatternMatcher.ts
      TextAnalyzer.ts
    CrystallizeEngine.ts     # UPDATED
    types.ts                 # UPDATED
  templates/
    prompts.ts               # UPDATED
    system.ts                # UPDATED
  extension.ts               # UPDATED
package.json                 # UPDATED
```

## Success Criteria

- [x] Branch created: `feature/crystallize-v2`
- [ ] TextAnalyzer extracts structured data
- [ ] Clarity score calculated correctly (0-100)
- [ ] Tech Spec shows Clarity Score with emoji indicator
- [ ] Diplomat template shows professional email format
- [ ] Both commands work end-to-end
- [ ] Language switching works (sv/en)
- [ ] Backward compatibility maintained
- [ ] No external NLP dependencies
- [ ] All tests pass
- [ ] CI passes

## Testing Examples

### Test Case 1: Deadline Extraction
**Input (sv):** "måste vara klart på fredag"
**Expected:** Deadline appears in `deadlines` array

**Input (en):** "must be done by Friday"
**Expected:** Deadline appears in `deadlines` array

### Test Case 2: Blocker Identification
**Input (sv):** "vi är blockerade av API-teamet"
**Expected:** Blocker appears in `blockers` array

**Input (en):** "blocked by the API team"
**Expected:** Blocker appears in `blockers` array

### Test Case 3: Clarity Score
**Input:** Very vague text with no deadlines, no tech terms, many ambiguous words
**Expected:** Low clarity score (< 50), red indicator

**Input:** Clear text with deadline, technical terms, specific requirements
**Expected:** High clarity score (> 80), green indicator


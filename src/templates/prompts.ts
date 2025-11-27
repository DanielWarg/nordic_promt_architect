import type { Config, SanitizerResult, TextAnalysisResult } from '../core/types';
import type { SuperPromptConfig } from '../config/defaults';
import { getHeaders, getTexts } from './system';
import { systemHeaders, systemTexts } from './system';

/**
 * Generate Architect markdown template
 */
export function getArchitectMarkdown(
  sanitizedCode: string,
  config: Config,
  sanitizerResult: SanitizerResult
): string {
  const totalMatches = Object.values(sanitizerResult.matches).reduce((sum, value) => sum + value, 0);
  const securityContext =
    totalMatches > 0
      ? `Koden har blivit sanitizerad. ${totalMatches} känslig(a) mönster maskerade.`
      : systemTexts.securityContextDefault;

  return `${systemHeaders.role}
${config.templates.role}

${systemHeaders.securityContext}
${securityContext}

${systemHeaders.task}
Analysera och förbättra den nedanstående koden.

${systemHeaders.code}
\`\`\`
${sanitizedCode}
\`\`\`
`;
}

/**
 * Generate Tech Spec markdown template with Clarity Score
 */
export function getTechSpecMarkdown(
  input: string,
  analysis: TextAnalysisResult,
  config: SuperPromptConfig
): string {
  const language = config.project.language === 'en' ? 'en' : 'sv';
  const headers = getHeaders(language);
  const texts = getTexts(language);

  // Clarity score emoji indicator
  let scoreEmoji = '🟡';
  if (analysis.clarityScore > 80) {
    scoreEmoji = '🟢';
  } else if (analysis.clarityScore < 50) {
    scoreEmoji = '🔴';
  }

  // Build feedback section
  let feedbackSection = '';
  if (analysis.clarityFeedback.length > 0) {
    const feedbackItems = analysis.clarityFeedback.map((f) => `- ${f}`).join('\n');
    feedbackSection = `\n### Feedback:\n${feedbackItems}\n`;
  }

  // Build blockers section
  let blockersSection = '';
  if (analysis.blockers.length > 0) {
    const blockerItems = analysis.blockers.map((b) => `- ${b}`).join('\n');
    blockersSection = `\n${headers.blockers}\n${blockerItems}\n`;
  } else {
    blockersSection = `\n${headers.blockers}\n${texts.noBlockers}\n`;
  }

  // Build risks section
  let risksSection = '';
  if (analysis.risks.length > 0) {
    const riskItems = analysis.risks.map((r) => `- ${r}`).join('\n');
    risksSection = `\n${headers.risks}\n${riskItems}\n`;
  } else {
    risksSection = `\n${headers.risks}\n${texts.noRisks}\n`;
  }

  // Build technical dependencies section
  let techDepsSection = '';
  if (analysis.technicalTerms.length > 0) {
    const techItems = analysis.technicalTerms.map((t) => `- ${t}`).join('\n');
    techDepsSection = `\n${headers.technicalDependencies}\n${techItems}\n`;
  } else {
    techDepsSection = `\n${headers.technicalDependencies}\n${texts.noTechDependencies}\n`;
  }

  // Acceptance Criteria template (structured skeleton)
  const acTemplate = language === 'sv'
    ? '- [ ] [Krav 1 - beskriv funktionalitet]\n- [ ] [Krav 2 - beskriv prestanda]\n- [ ] [Krav 3 - beskriv säkerhet]'
    : '- [ ] [Requirement 1 - describe functionality]\n- [ ] [Requirement 2 - describe performance]\n- [ ] [Requirement 3 - describe security]';

  return `🔬 TECHNICAL SPECIFICATION

## 📊 Requirement Health: ${analysis.clarityScore}% ${scoreEmoji}${feedbackSection}

${headers.context}
${analysis.context}

${blockersSection}

${risksSection}

${techDepsSection}

${headers.acceptanceCriteria}
${acTemplate}

---
## Original Input
\`\`\`
${input}
\`\`\`
`;
}

/**
 * Generate Diplomat markdown template (professional email format)
 */
export function getDiplomatMarkdown(
  _input: string,
  analysis: TextAnalysisResult,
  config: SuperPromptConfig
): string {
  const language = config.project.language === 'en' ? 'en' : 'sv';

  // Build Current Understanding section
  const understandingText = language === 'sv'
    ? `Baserat på din input förstår jag att: ${analysis.context}`
    : `Based on your input, I understand that: ${analysis.context}`;

  // Build Blockers section
  let blockersText = '';
  if (analysis.blockers.length > 0) {
    const blockerList = analysis.blockers.map((b) => `- ${b}`).join('\n');
    blockersText = language === 'sv'
      ? `Vi har identifierat följande blockerare:\n${blockerList}`
      : `We have identified the following blockers:\n${blockerList}`;
  } else {
    blockersText = language === 'sv'
      ? 'Inga blockerare har identifierats explicit i din input.'
      : 'No blockers have been explicitly identified in your input.';
  }

  // Build Clarification Needed section
  let clarificationText = '';
  const needsClarification =
    analysis.ambiguousTerms.length > 0 || analysis.deadlines.length === 0;

  if (needsClarification) {
    const questions: string[] = [];
    if (analysis.deadlines.length === 0) {
      questions.push(
        language === 'sv'
          ? 'Vad är deadline för detta krav?'
          : 'What is the deadline for this requirement?'
      );
    }
    if (analysis.ambiguousTerms.length > 0) {
      const vagueTerms = analysis.ambiguousTerms.slice(0, 3).join(', ');
      questions.push(
        language === 'sv'
          ? `Kan du specificera vad du menar med: ${vagueTerms}?`
          : `Could you specify what you mean by: ${vagueTerms}?`
      );
    }
    if (analysis.technicalTerms.length === 0) {
      questions.push(
        language === 'sv'
          ? 'Vilken teknisk stack eller plattform ska användas?'
          : 'What technical stack or platform should be used?'
      );
    }

    clarificationText = questions.map((q) => `- ${q}`).join('\n');
  } else {
    clarificationText =
      language === 'sv'
        ? 'Alla nödvändiga detaljer verkar vara på plats.'
        : 'All necessary details appear to be in place.';
  }

  // Build Next Steps section
  const nextStepsText = language === 'sv'
    ? `- När ovanstående klargöranden är gjorda kan jag börja implementera\n- Kommer att skapa teknisk specifikation baserat på input\n- Förväntad tidslinje kommer att följa efter klargöranden`
    : `- Once the above clarifications are provided, I can begin implementation\n- Will create technical specification based on input\n- Expected timeline will follow after clarifications`;

  // Sign-off
  const signOff = language === 'sv'
    ? `Hälsningar,\n${config.templates.role}`
    : `Best regards,\n${config.templates.role}`;

  return `✉️ STAKEHOLDER REPLY DRAFT

### Current Understanding

${understandingText}

### Identified Blockers

${blockersText}

### Clarification Needed

${clarificationText}

### Next Steps

${nextStepsText}

---

${signOff}
`;
}

/**
 * Legacy Crystallize markdown template (backward compatibility)
 */
export function getCrystallizeMarkdown(input: string, config: Config): string {
  // Keep for backward compatibility - delegates to new implementation
  return `${systemHeaders.analysis}
## Risker och Blocker
- [Identifiera tekniska risker]
- [Identifiera blockers]
- [Identifiera oklarheter]

## Oklarheter
- [Lista oklara krav]
- [Lista saknade detaljer]

${systemHeaders.acceptanceCriteria}
- [ ] [Krav 1]
- [ ] [Krav 2]
- [ ] [Krav 3]

${systemHeaders.diplomaticResponse}
Hej,

Tack för din input. För att säkerställa att vi bygger rätt sak, skulle jag behöva lite mer information:

1. [Fråga 1]
2. [Fråga 2]
3. [Fråga 3]

Baserat på det jag förstår hittills, föreslår jag följande acceptance criteria:
- [Krav 1]
- [Krav 2]

Vad tycker du?

Mvh,
${config.templates.role}

---
## Original input
\`\`\`
${input}
\`\`\`
`;
}

/**
 * Generate Verify checklist markdown
 */
export function getVerifyChecklistMarkdown(specText: string): string {
  // Simple extraction: look for bullet points, checkboxes, or numbered lists
  const lines = specText.split('\n');
  const checklistItems: string[] = [];

  for (const line of lines) {
    // Match bullet points, checkboxes, or numbered items
    const bulletMatch = line.match(/^[\s]*[-*]\s+(.+)$/);
    const checkboxMatch = line.match(/^[\s]*[-*]\s+\[[\sxX]\]\s+(.+)$/);
    const numberMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);

    if (bulletMatch) {
      checklistItems.push(`- [ ] ${bulletMatch[1]}`);
    } else if (checkboxMatch) {
      checklistItems.push(`- [ ] ${checkboxMatch[1]}`);
    } else if (numberMatch) {
      checklistItems.push(`- [ ] ${numberMatch[1]}`);
    }
  }

  // If no items found, create a simple checklist from the spec
  if (checklistItems.length === 0) {
    checklistItems.push('- [ ] Alla krav från spec är implementerade');
    checklistItems.push('- [ ] Kodgenomgång genomförd');
    checklistItems.push('- [ ] Tester skrivna och gröna');
    checklistItems.push('- [ ] Dokumentation uppdaterad');
  }

  return `${systemHeaders.checklist}
## Definition of Done

${checklistItems.join('\n')}

---
## Specifikation
\`\`\`
${specText.substring(0, 500)}${specText.length > 500 ? '...' : ''}
\`\`\`
`;
}


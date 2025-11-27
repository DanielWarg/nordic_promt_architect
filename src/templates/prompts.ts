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
 * Generate Diplomat markdown template (soft-professional email format)
 */
export function getDiplomatMarkdown(
  _input: string,
  analysis: TextAnalysisResult,
  config: SuperPromptConfig
): string {
  const lang = config.project.language === 'en' ? 'en' : 'sv';

  const greetings = {
    sv: "Hej,",
    en: "Hello,",
  };

  const understandingHeader = {
    sv: "### Nuvarande förståelse",
    en: "### Current Understanding",
  };

  const blockersHeader = {
    sv: "### Identifierade blockerare",
    en: "### Identified Blockers",
  };

  const clarificationHeader = {
    sv: "### Förtydliganden som vore hjälpsamma",
    en: "### Clarifications That Would Be Helpful",
  };

  const nextStepsHeader = {
    sv: "### Nästa steg",
    en: "### Next Steps",
  };

  const closing = {
    sv: `\n---\n\nHälsningar,\n${config.templates.role}`,
    en: `\n---\n\nBest regards,\n${config.templates.role}`,
  };

  // Build clarification list (soft tone)
  const clarifications: string[] = [];

  if (!analysis.deadlines.length) {
    clarifications.push(
      lang === 'sv'
        ? "Det vore värdefullt att veta om det finns någon deadline eller tidsram att förhålla sig till."
        : "It would be helpful to know if there is a deadline or timeline to consider."
    );
  }

  if (analysis.ambiguousTerms.length) {
    const vague = analysis.ambiguousTerms.join(", ");
    clarifications.push(
      lang === 'sv'
        ? `För att undvika missförstånd vore det hjälpsamt att få lite mer detaljer kring uttryck som: ${vague}.`
        : `To avoid misunderstandings, it would be helpful to get more detail around terms like: ${vague}.`
    );
  }

  if (!analysis.technicalTerms.length) {
    clarifications.push(
      lang === 'sv'
        ? "Det vore bra att veta om någon specifik teknisk plattform eller lösning är önskad."
        : "It would be useful to know if a specific platform or technical solution is preferred."
    );
  }

  const noData = lang === 'sv' ? "Inga specifika punkter identifierade." : "No specific items identified.";

  return `
✉️ ${lang === 'sv' ? "UTKAST FÖR DIALOG MED STAKEHOLDER" : "STAKEHOLDER REPLY DRAFT"}

${greetings[lang]}

${understandingHeader[lang]}

${lang === 'sv'
  ? `Baserat på din input uppfattar jag att: ${analysis.context}`
  : `Based on your input, my understanding is that: ${analysis.context}`
}

${blockersHeader[lang]}

${
  analysis.blockers.length
    ? analysis.blockers.map(b => `- ${b}`).join("\n")
    : `- ${noData}`
}

${clarificationHeader[lang]}

${
  clarifications.length
    ? clarifications.map(c => `- ${c}`).join("\n")
    : `- ${noData}`
}

${nextStepsHeader[lang]}

${
  lang === 'sv'
    ? `- När ovanstående är tydliggjort kan jag ta fram en mer komplett teknisk specifikation.\n- Därefter kan vi planera implementation och tidslinje.\n- Jag återkopplar så snart vi har de saknade detaljerna.`
    : `- Once the points above are clarified, I can prepare a more complete technical specification.\n- After that, we can plan implementation and timeline.\n- I will follow up as soon as we have the missing details.`
}

${closing[lang]}
  `.trim();
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


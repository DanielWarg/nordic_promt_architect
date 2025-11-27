import type { Config, SanitizerResult, TextAnalysisResult } from '../core/types';
import type { SuperPromptConfig } from '../config/defaults';
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
 * Generate Tech Spec markdown template with Clarity Score (soft-professional tone)
 */
export function getTechSpecMarkdown(
  input: string,
  analysis: TextAnalysisResult,
  config: SuperPromptConfig
): string {
  const lang = config.project.language === 'en' ? 'en' : 'sv';

  const emoji =
    analysis.clarityScore > 80 ? '🟢' :
    analysis.clarityScore > 50 ? '🟡' :
    '🔴';

  const titles = {
    sv: {
      main: '🔬 TEKNISK SPECIFIKATION',
      health: '## 📊 Kravhälsa',
      feedback: '### Feedback (för att förtydliga kravet)',
      context: '# KONTEXT',
      blockers: '# BLOCKERARE',
      risks: '# RISKER',
      tech: '# TEKNISKA BEROENDEN',
      ac: '# ACCEPTANCE CRITERIA',
      noBlockers: 'Inga identifierade blockerare.',
      noRisks: 'Inga identifierade risker.',
      noTech: 'Inga specifika tekniska beroenden identifierade.',
      noFeedback: 'Inga särskilda förbättringsförslag – kravet ser tydligt ut.',
      inputHeader: '## Originalinput',
    },
    en: {
      main: '🔬 TECHNICAL SPECIFICATION',
      health: '## 📊 Requirement Health',
      feedback: '### Feedback (to make the requirement clearer)',
      context: '# CONTEXT',
      blockers: '# BLOCKERS',
      risks: '# RISKS',
      tech: '# TECHNICAL DEPENDENCIES',
      ac: '# ACCEPTANCE CRITERIA',
      noBlockers: 'No blockers identified.',
      noRisks: 'No risks explicitly identified.',
      noTech: 'No specific technical dependencies identified.',
      noFeedback: 'No particular suggestions – the requirement looks clear.',
      inputHeader: '## Original Input',
    },
  }[lang];

  const feedbackLines = analysis.clarityFeedback?.length
    ? analysis.clarityFeedback.map(f => `- ${f}`).join('\n')
    : `- ${titles.noFeedback}`;

  const blockers =
    analysis.blockers.length
      ? analysis.blockers.map(b => `- ${b}`).join('\n')
      : titles.noBlockers;

  const risks =
    analysis.risks.length
      ? analysis.risks.map(r => `- ${r}`).join('\n')
      : titles.noRisks;

  const techDeps =
    analysis.technicalTerms.length
      ? analysis.technicalTerms.map(t => `- ${t}`).join('\n')
      : titles.noTech;

  const acSkeleton =
    lang === 'sv'
      ? [
          '- [ ] [Krav 1 – beskriv funktionalitet]',
          '- [ ] [Krav 2 – beskriv prestanda]',
          '- [ ] [Krav 3 – beskriv säkerhet]',
        ].join('\n')
      : [
          '- [ ] [Requirement 1 – describe functionality]',
          '- [ ] [Requirement 2 – describe performance]',
          '- [ ] [Requirement 3 – describe security]',
        ].join('\n');

  return `
${titles.main}



${titles.health}: ${analysis.clarityScore}% ${emoji}



${titles.feedback}
${feedbackLines}





${titles.context}
${analysis.context || (lang === 'sv'
  ? 'En övergripande beskrivning av kravet saknas – använd gärna denna sektion för att sammanfatta syftet.'
  : 'An overall description of the requirement is missing – use this section to summarise the goal.'
)}





${titles.blockers}
${blockers}





${titles.risks}
${risks}





${titles.tech}
${techDeps}





${titles.ac}
${acSkeleton}



---

${titles.inputHeader}
\`\`\`
${input.trim()}
\`\`\`
  `.trim();
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
    sv: 'Hej,',
    en: 'Hello,',
  };

  const understandingHeader = {
    sv: '### Nuvarande förståelse',
    en: '### Current Understanding',
  };

  const blockersHeader = {
    sv: '### Identifierade blockerare',
    en: '### Identified Blockers',
  };

  const clarificationHeader = {
    sv: '### Förtydliganden som vore hjälpsamma',
    en: '### Clarifications That Would Be Helpful',
  };

  const nextStepsHeader = {
    sv: '### Nästa steg',
    en: '### Next Steps',
  };

  const closing = {
    sv: `\n---\n\nHälsningar,\n${config.templates.role}`,
    en: `\n---\n\nBest regards,\n${config.templates.role}`,
  };

  const noItems = lang === 'sv'
    ? 'Inga specifika punkter identifierade.'
    : 'No specific items identified.';

  // Build clarifications in a soft–professional tone
  const clarifications: string[] = [];

  if (!analysis.deadlines.length) {
    clarifications.push(
      lang === 'sv'
        ? 'Det vore värdefullt att veta om det finns någon deadline eller tidsram att förhålla sig till.'
        : 'It would be helpful to know if there is a deadline or timeline to consider.'
    );
  }

  if (analysis.ambiguousTerms.length) {
    const vague = analysis.ambiguousTerms.join(', ');
    clarifications.push(
      lang === 'sv'
        ? `För att undvika missförstånd vore det hjälpsamt att få lite mer detaljer kring formuleringar som: ${vague}.`
        : `To avoid misunderstandings, it would be helpful to get a bit more detail around terms such as: ${vague}.`
    );
  }

  if (!analysis.technicalTerms.length) {
    clarifications.push(
      lang === 'sv'
        ? 'Det vore bra att veta om någon specifik teknisk plattform eller lösning är önskad.'
        : 'It would be useful to know if any specific platform or technical solution is preferred.'
    );
  }

  const contextLine =
    analysis.context ||
    (lang === 'sv'
      ? 'Jag vill säkerställa att jag har förstått syftet med förändringen på rätt sätt.'
      : 'I want to ensure I have correctly understood the purpose of this change.');

  const blockersSection =
    analysis.blockers.length
      ? analysis.blockers.map(b => `- ${b}`).join('\n')
      : `- ${noItems}`;

  const clarificationsSection =
    clarifications.length
      ? clarifications.map(c => `- ${c}`).join('\n')
      : `- ${noItems}`;

  const nextStepsSection =
    lang === 'sv'
      ? [
          '- När ovanstående är tydliggjort kan jag ta fram en mer komplett teknisk specifikation.',
          '- Därefter kan vi planera implementation och tidslinje.',
          '- Jag återkopplar så snart vi har de saknade detaljerna.',
        ].join('\n')
      : [
          '- Once the points above are clarified, I can prepare a more complete technical specification.',
          '- After that, we can plan implementation and timeline.',
          '- I will follow up as soon as we have the missing details.',
        ].join('\n');

  return `
✉️ ${lang === 'sv'
  ? 'UTKAST FÖR DIALOG MED STAKEHOLDER'
  : 'STAKEHOLDER REPLY DRAFT'
}



${greetings[lang]}



${understandingHeader[lang]}



${lang === 'sv'
  ? `Baserat på din beskrivning uppfattar jag att: ${contextLine}`
  : `Based on your description, my current understanding is that: ${contextLine}`
}



${blockersHeader[lang]}



${blockersSection}



${clarificationHeader[lang]}



${clarificationsSection}



${nextStepsHeader[lang]}



${nextStepsSection}



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


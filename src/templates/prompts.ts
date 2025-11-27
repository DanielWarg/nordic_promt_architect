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
 * Generate Diplomat markdown template (senior professional tone)
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

  const summaryHeader = {
    sv: '### Sammanfattning',
    en: '### Summary',
  };

  const blockersHeader = {
    sv: '### Krav för att kunna starta (Blockers)',
    en: '### Requirements to Proceed (Blockers)',
  };

  const questionsHeader = {
    sv: '### Vi behöver svar på följande:',
    en: '### We need answers to the following:',
  };

  const nextStepsHeader = {
    sv: '### Nästa steg',
    en: '### Next Steps',
  };

  const closing = {
    sv: `\n---\n\nHälsningar,\n**${config.templates.role}**`,
    en: `\n---\n\nBest regards,\n**${config.templates.role}**`,
  };

  // Build context for summary
  const summaryText =
    analysis.context
      ? (lang === 'sv'
          ? `Jag har mottagit önskemålet gällande ${analysis.context}. Som det är formulerat nu är omfattningen för otydlig för att lägga in i sprinten.`
          : `I have received the request regarding ${analysis.context}. As currently formulated, the scope is too unclear to include in the sprint.`)
      : (lang === 'sv'
          ? 'Jag har mottagit önskemålet. Som det är formulerat nu är omfattningen för otydlig för att lägga in i sprinten.'
          : 'I have received the request. As currently formulated, the scope is too unclear to include in the sprint.');

  // Build blockers list (if any exist, show them after explanation)
  const blockersList =
    analysis.blockers.length > 0
      ? `\n\n${analysis.blockers.map(b => `- ${b}`).join('\n')}`
      : '';

  // Build questions (senior tone - direct and structured)
  const questions: string[] = [];

  if (analysis.ambiguousTerms.length > 0) {
    const vagueTerms = analysis.ambiguousTerms.join(', ');
    questions.push(
      lang === 'sv'
        ? `**Målbild:** Följande termer är för subjektiva för utveckling och behöver definieras: ${vagueTerms}. Vad specifikt innebär de?`
        : `**Goal:** The following terms are too subjective for development and need to be defined: ${vagueTerms}. What do they specifically mean?`
    );
  }

  if (!analysis.technicalTerms.length) {
    questions.push(
      lang === 'sv'
        ? '**Omfattning:** Vad avses exakt? Gäller det en specifik vy, modul eller hela applikationen?'
        : '**Scope:** What exactly is included? Does it apply to a specific view, module, or the entire application?'
    );
  }

  if (!analysis.deadlines.length) {
    questions.push(
      lang === 'sv'
        ? '**Deadline:** Finns det en tidplan eller release-constraint att förhålla sig till?'
        : '**Deadline:** Is there a timeline or release constraint to consider?'
    );
  }

  // Always add measurability question if ambiguous terms exist
  if (analysis.ambiguousTerms.length > 0) {
    questions.push(
      lang === 'sv'
        ? '**Mätbarhet:** Hur vet vi när vi är klara? Subjektiva termer som "snyggare" eller "bättre" är inte testbara krav.'
        : '**Measurability:** How do we know when we are done? Subjective terms like "nicer" or "better" are not testable requirements.'
    );
  }

  const questionsSection =
    questions.length > 0
      ? questions.map((q, idx) => `${idx + 1}. ${q}`).join('\n\n')
      : (lang === 'sv'
          ? 'Alla nödvändiga detaljer verkar vara på plats.'
          : 'All necessary details appear to be in place.');

  // Build blockers explanation
  const blockersExplanation =
    lang === 'sv'
      ? 'För att undvika felimplementation och missad förväntan behöver vi ett mer konkret underlag. I nuvarande form är kravet inte tillräckligt definierat för utveckling.'
      : 'For us to be able to estimate time and start the work, the requirements need to be concretized. Right now, the scope is too unclear to include in the sprint.';

  // Build next steps
  const nextStepsSection =
    lang === 'sv'
      ? `När vi har dessa svar kan jag ta fram ett konkret tekniskt förslag samt estimera arbetet.\n\nTills vidare markerar jag detta som **Needs Clarification**.`
      : `Once we have these answers, I can prepare a concrete technical proposal and estimate the work.\n\nFor now, I am marking this as **Needs Clarification**.`;

  return `
✉️ ${lang === 'sv'
  ? 'UTKAST FÖR DIALOG MED STAKEHOLDER'
  : 'STAKEHOLDER REPLY DRAFT'}

${greetings[lang]}

${summaryHeader[lang]}

${summaryText}

${blockersHeader[lang]}

${blockersExplanation}${blockersList}

${questionsHeader[lang]}

${questionsSection}

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


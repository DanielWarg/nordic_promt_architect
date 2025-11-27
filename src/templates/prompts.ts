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
  const lang = config.project.language;
  const isSv = lang === 'sv';

  // Bygg upp "missing info" här (fanns inte i analysis)
  const missingInfo: string[] = [];
  if (analysis.deadlines.length === 0) {
    missingInfo.push(isSv ? 'Tidsram/deadline saknas.' : 'Deadline/timeline is missing.');
  }
  if (analysis.technicalTerms.length === 0) {
    missingInfo.push(isSv ? 'Inga tekniska detaljer är angivna.' : 'No technical details are specified.');
  }
  if (analysis.ambiguousTerms.length > 0) {
    missingInfo.push(
      isSv
        ? 'Beskrivningen innehåller subjektiva/vaga termer.'
        : 'The description contains subjective/vague terms.'
    );
  }

  // Hantera otydliga termer mer explicit
  const ambiguitySection =
    analysis.ambiguousTerms.length > 0
      ? (isSv
          ? `- Följande termer är för subjektiva för utveckling och behöver definieras: "${analysis.ambiguousTerms.join('", "')}".`
          : `- The following terms are too subjective for development and need concrete definitions: "${analysis.ambiguousTerms.join('", "')}".`)
      : '';

  // Rubriker och texter i "senior neutral" ton
  const headers = {
    title: isSv ? '✉️ UTKAST FÖR DIALOG MED BESTÄLLARE' : '✉️ DRAFT: STAKEHOLDER RESPONSE',
    greeting: isSv ? 'Hej,' : 'Hi,',
    summary: isSv ? '### Sammanfattning av behovet' : '### Request Summary',
    blockers: isSv ? '### Hinder för uppstart (Blockers)' : '### Blockers for Start',
    clarification: isSv ? '### Krav för estimering & start' : '### Requirements for Estimation & Start',
    nextSteps: isSv ? '### Nästa steg' : '### Next Steps',
    signoff: isSv ? `Hälsningar,\n${config.templates.role}` : `Regards,\n${config.templates.role}`,
  };

  const introText = isSv
    ? 'Jag har granskat önskemålet. För att säkerställa korrekt leverans och undvika omarbete behöver några punkter förtydligas.'
    : 'I have reviewed the request. To ensure correct delivery and avoid rework, several points need clarification.';

  const blockersText = (isSv
    ? `- Inga tekniska hinder kan identifieras utifrån nuvarande beskrivning.\n- Dock är kravet för vagt för att kunna estimeras eller planeras.`
    : `- No technical blockers can be identified based on the current description.\n- However, the requirement is too vague to be estimated or planned.`);

  const clarificationList =
    missingInfo.length > 0
      ? missingInfo.map(i => `- ${i}`).join('\n')
      : (isSv
          ? '- Inga större oklarheter identifierade, men om något saknas får du gärna komplettera.'
          : '- No major clarification issues identified, but feel free to add details if something is missing.');

  const contextLine = analysis.context || (isSv ? 'Övergripande önskemål' : 'General request');

  return `
${headers.title}

${headers.greeting}

${introText}

${headers.summary}

> "${contextLine}"

${headers.blockers}

${blockersText}

${headers.clarification}

${clarificationList}
${ambiguitySection ? `\n${ambiguitySection}` : ''}

${headers.nextSteps}

${isSv
  ? '- När punkterna ovan är besvarade kan jag ta fram teknisk lösning och tidsestimering.'
  : '- Once the points above are clarified, I can provide a technical solution and time estimate.'}
${isSv
  ? '- Därefter kan arbetet planeras in i kommande sprint.'
  : '- After that, the work can be planned into an upcoming sprint.'}

---

${headers.signoff}
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


import { Config, SanitizerResult } from '../core/types';
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
 * Generate Crystallize markdown template
 */
export function getCrystallizeMarkdown(input: string, config: Config): string {
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


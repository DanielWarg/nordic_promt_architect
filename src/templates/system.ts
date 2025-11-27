/**
 * Shared system text fragments with language support
 */

export interface SystemHeaders {
  role: string;
  securityContext: string;
  task: string;
  code: string;
  analysis: string;
  acceptanceCriteria: string;
  diplomaticResponse: string;
  checklist: string;
  context: string;
  blockers: string;
  risks: string;
  technicalDependencies: string;
  nextSteps: string;
  proposedSolution: string;
}

export interface SystemTexts {
  securityContextDefault: string;
  roleDefault: string;
  noBlockers: string;
  noRisks: string;
  noTechDependencies: string;
  noData: string;
}

const SV_HEADERS: SystemHeaders = {
  role: '# ROLL',
  securityContext: '# SÄKERHETSKONTEXT',
  task: '# UPPGIFT',
  code: '# KOD',
  analysis: '# TEKNISK ANALYS',
  acceptanceCriteria: '# ACCEPTANCE CRITERIA',
  diplomaticResponse: '# DIPLOMATISKT SVAR',
  checklist: '# CHECKLIST',
  context: '# KONTEXT',
  blockers: '# BLOCKERARE',
  risks: '# RISKER',
  technicalDependencies: '# TEKNISKA BEROENDEN',
  nextSteps: '# NÄSTA STEG',
  proposedSolution: '# FÖRESLAGEN LÖSNING',
};

const EN_HEADERS: SystemHeaders = {
  role: '# ROLE',
  securityContext: '# SECURITY CONTEXT',
  task: '# TASK',
  code: '# CODE',
  analysis: '# TECHNICAL ANALYSIS',
  acceptanceCriteria: '# ACCEPTANCE CRITERIA',
  diplomaticResponse: '# DIPLOMATIC REPLY',
  checklist: '# CHECKLIST',
  context: '# CONTEXT',
  blockers: '# BLOCKERS',
  risks: '# RISKS',
  technicalDependencies: '# TECHNICAL DEPENDENCIES',
  nextSteps: '# NEXT STEPS',
  proposedSolution: '# PROPOSED SOLUTION',
};

const SV_TEXTS: SystemTexts = {
  securityContextDefault: 'Koden har blivit sanitizerad för att skydda känslig information.',
  roleDefault: 'Senior DevOps Engineer',
  noBlockers: 'Inga identifierade blockerare',
  noRisks: 'Inga identifierade risker',
  noTechDependencies: 'Inga tekniska beroenden specificerade',
  noData: 'Ingen data',
};

const EN_TEXTS: SystemTexts = {
  securityContextDefault: 'Code has been sanitized to protect sensitive information.',
  roleDefault: 'Senior DevOps Engineer',
  noBlockers: 'No blockers identified',
  noRisks: 'No risks identified',
  noTechDependencies: 'No technical dependencies specified',
  noData: 'No data',
};

/**
 * Get system headers for a given language
 */
export function getHeaders(language: 'sv' | 'en'): SystemHeaders {
  return language === 'en' ? EN_HEADERS : SV_HEADERS;
}

/**
 * Get system texts for a given language
 */
export function getTexts(language: 'sv' | 'en'): SystemTexts {
  return language === 'en' ? EN_TEXTS : SV_TEXTS;
}

// Backward compatibility - export default Swedish headers/texts
export const systemHeaders = SV_HEADERS;
export const systemTexts = SV_TEXTS;

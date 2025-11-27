import { TextAnalysisResult } from './types';

/**
 * Pattern dictionaries for text analysis
 */
type PatternDictionary = {
  deadlines: RegExp[];
  blockers: RegExp[];
  risks: RegExp[];
  ambiguousTerms: RegExp[];
  technicalTerms: string[];
};

const SV_PATTERNS: PatternDictionary = {
  deadlines: [
    /\b(måste|ska|behöver)\s+(vara|bli)\s+klart\s+(på|för|innan)\s+([^\s]+)/gi,
    /\b(nästa vecka|imorgon|idag|ASAP|asap|snart|snabbast möjliga)\b/gi,
    /\b(fredag|måndag|tisdag|onsdag|torsdag|lördag|söndag)\b/gi,
    /\b(\d{1,2})\/(\d{1,2})\b/gi, // Swedish date format
  ],
  blockers: [
    /\b(väntar på|blockerad av|beroende av|blir blockerade av|hindras av)\s+([^\.,!?]+)/gi,
    /\b(kräver|behöver|måste vänta på)\s+([^\.,!?]+)/gi,
  ],
  risks: [
    /\b(kanske|eventuellt|möjligen|risk|risk för|kan bli problem|fara för)\s+([^\.,!?]*)/gi,
    /\b(might|could|may|risk|potential issue)\s+([^\.,!?]*)/gi,
  ],
  ambiguousTerms: [
    /\b(snyggare|snabbare|bättre|tydligare|modernt|nice|better|faster|cooler|typ|nog|lite)\b/gi,
  ],
  technicalTerms: [
    'API', 'REST', 'GraphQL', 'HTTP', 'HTTPS', 'JSON', 'XML', 'SOAP',
    'React', 'Vue', 'Angular', 'Node', 'Node.js', 'Express', 'Next.js',
    'Python', 'Django', 'Flask', 'FastAPI',
    'TypeScript', 'JavaScript', 'TS', 'JS',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'K8s',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'databas', 'database', 'microservice', 'microservicearkitektur',
    'authentication', 'authorization', 'auth', 'JWT', 'OAuth',
    'CI/CD', 'GitHub Actions', 'Jenkins', 'GitLab CI',
    'automatisering', 'deployment', 'deploy',
  ],
};

const EN_PATTERNS: PatternDictionary = {
  deadlines: [
    /\b(must|should|need to|has to)\s+(be done|completed|finished|ready)\s+(by|on|before|until)\s+([^\s]+)/gi,
    /\b(next week|tomorrow|today|ASAP|asap|soon|as soon as possible)\b/gi,
    /\b(Friday|Monday|Tuesday|Wednesday|Thursday|Saturday|Sunday)\b/gi,
    /\b(\d{1,2})\/(\d{1,2})\b/gi, // Date format
  ],
  blockers: [
    /\b(blocked by|waiting for|depends on|blocked by|hindered by)\s+([^\.,!?]+)/gi,
    /\b(requires|needs|must wait for)\s+([^\.,!?]+)/gi,
  ],
  risks: [
    /\b(might|could|may|risk|potential issue|could be a problem)\s+([^\.,!?]*)/gi,
  ],
  ambiguousTerms: [
    /\b(nice|better|faster|cooler|modern|clean|pretty|maybe|kind of|sort of|a bit)\b/gi,
  ],
  technicalTerms: SV_PATTERNS.technicalTerms, // Same technical terms work in both languages
};

/**
 * Pattern matcher for extracting structured data from text
 */
export class PatternMatcher {
  /**
   * Extract structured information from text using pattern matching
   */
  public extract(text: string, lang: 'sv' | 'en'): Partial<TextAnalysisResult> {
    const patterns = lang === 'sv' ? SV_PATTERNS : EN_PATTERNS;
    const result: Partial<TextAnalysisResult> = {
      deadlines: [],
      blockers: [],
      risks: [],
      ambiguousTerms: [],
      technicalTerms: [],
    };

    // Extract deadlines
    for (const pattern of patterns.deadlines) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const extracted = match[0].trim();
        if (extracted && !result.deadlines!.includes(extracted)) {
          result.deadlines!.push(extracted);
        }
      }
    }

    // Extract blockers
    for (const pattern of patterns.blockers) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const extracted = match[0].trim();
        if (extracted && !result.blockers!.includes(extracted)) {
          result.blockers!.push(extracted);
        }
      }
    }

    // Extract risks
    for (const pattern of patterns.risks) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const extracted = match[0].trim();
        if (extracted && !result.risks!.includes(extracted)) {
          result.risks!.push(extracted);
        }
      }
    }

    // Extract ambiguous terms
    for (const pattern of patterns.ambiguousTerms) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const extracted = match[0].trim().toLowerCase();
        if (extracted && !result.ambiguousTerms!.includes(extracted)) {
          result.ambiguousTerms!.push(extracted);
        }
      }
    }

    // Extract technical terms (case-insensitive keyword matching)
    for (const term of patterns.technicalTerms) {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(text) && !result.technicalTerms!.includes(term)) {
        result.technicalTerms!.push(term);
      }
    }

    return result;
  }
}


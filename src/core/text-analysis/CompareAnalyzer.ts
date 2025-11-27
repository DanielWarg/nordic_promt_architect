import type { SuperPromptConfig } from '../../config/defaults';
import type { CompareAnalysisResult } from '../types';

/**
 * CompareAnalyzer - Analyzes two text blocks and provides structured comparison
 */
export class CompareAnalyzer {
  /**
   * Analyze and compare two text blocks
   */
  analyzeCompare(a: string, b: string, config: SuperPromptConfig): CompareAnalysisResult {
    const lang = config.project.language === 'en' ? 'en' : 'sv';
    const isSv = lang === 'sv';

    // Goal-focused words (action-oriented)
    const goalWords = isSv
      ? ['fixa', 'implementera', 'lansera', 'lansering', 'bygga', 'skapa', 'utveckla', 'leverera', 'göra']
      : ['fix', 'implement', 'launch', 'launching', 'build', 'create', 'develop', 'deliver', 'make'];

    // Risk/worry words
    const riskWords = isSv
      ? ['anar inte', 'vet inte', 'kan hända', 'risk', 'oro', 'osäker', 'tveksamt', 'problem', 'far']
      : ['not sure', 'don\'t know', 'might happen', 'risk', 'worry', 'uncertain', 'doubtful', 'problem', 'danger'];

    // Vague words (from PatternMatcher)
    const vagueWords = isSv
      ? ['typ', 'lite', 'snyggare', 'snabbare', 'bättre', 'tydligare', 'modernt', 'nog']
      : ['kind of', 'a bit', 'nicer', 'faster', 'better', 'clearer', 'modern', 'probably'];

    // Analyze text characteristics
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    const aGoalScore = this.countMatches(aLower, goalWords);
    const bGoalScore = this.countMatches(bLower, goalWords);
    const aRiskScore = this.countMatches(aLower, riskWords);
    const bRiskScore = this.countMatches(bLower, riskWords);
    const aVagueScore = this.countMatches(aLower, vagueWords);
    const bVagueScore = this.countMatches(bLower, vagueWords);

    // Generate summaries
    const summaryA = this.generateSummary(a, aGoalScore, aRiskScore, aVagueScore, isSv);
    const summaryB = this.generateSummary(b, bGoalScore, bRiskScore, bVagueScore, isSv);

    // Identify main differences
    const mainDifferences = this.identifyDifferences(
      aGoalScore,
      bGoalScore,
      aRiskScore,
      bRiskScore,
      aVagueScore,
      bVagueScore,
      a.length,
      b.length,
      isSv
    );

    // Extract risk notes
    const riskNotes = this.extractRiskNotes(aLower, bLower, aRiskScore, bRiskScore, isSv);

    // Generate recommended direction
    const recommendedDirection = this.generateRecommendation(
      aGoalScore,
      bGoalScore,
      aRiskScore,
      bRiskScore,
      mainDifferences,
      isSv
    );

    return {
      summaryA,
      summaryB,
      mainDifferences,
      riskNotes,
      recommendedDirection,
    };
  }

  /**
   * Count how many times any of the words appear in the text
   */
  private countMatches(text: string, words: string[]): number {
    let count = 0;
    for (const word of words) {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        count += matches.length;
      }
    }
    return count;
  }

  /**
   * Generate a one-sentence summary of a text
   */
  private generateSummary(
    text: string,
    goalScore: number,
    riskScore: number,
    vagueScore: number,
    isSv: boolean
  ): string {
    const preview = text.substring(0, 100).trim();
    const truncated = text.length > 100 ? `${preview}...` : preview;

    if (goalScore > riskScore && goalScore > 0) {
      return isSv
        ? `Version A fokuserar på mål och handling: ${truncated}`
        : `Version A focuses on goals and action: ${truncated}`;
    } else if (riskScore > goalScore && riskScore > 0) {
      return isSv
        ? `Version B uttrycker oro och osäkerhet: ${truncated}`
        : `Version B expresses concern and uncertainty: ${truncated}`;
    } else if (vagueScore > 2) {
      return isSv
        ? `Version A innehåller vaga formuleringar som behöver konkretiseras: ${truncated}`
        : `Version A contains vague formulations that need to be made concrete: ${truncated}`;
    }

    return isSv
      ? `Version A beskriver ett krav eller behov: ${truncated}`
      : `Version A describes a requirement or need: ${truncated}`;
  }

  /**
   * Identify main differences between two texts
   */
  private identifyDifferences(
    aGoal: number,
    bGoal: number,
    aRisk: number,
    bRisk: number,
    aVague: number,
    bVague: number,
    aLength: number,
    bLength: number,
    isSv: boolean
  ): string[] {
    const differences: string[] = [];

    // Goal focus difference
    if (aGoal > bGoal && aGoal > 1) {
      differences.push(
        isSv
          ? 'Version A fokuserar tydligt på mål och implementering, medan version B är mer generell.'
          : 'Version A clearly focuses on goals and implementation, while version B is more general.'
      );
    } else if (bGoal > aGoal && bGoal > 1) {
      differences.push(
        isSv
          ? 'Version B är mer målinriktad än version A, med konkreta handlingar.'
          : 'Version B is more goal-oriented than version A, with concrete actions.'
      );
    }

    // Risk focus difference
    if (aRisk > bRisk && aRisk > 0) {
      differences.push(
        isSv
          ? 'Version A lyfter risker och osäkerheter som version B inte adresserar.'
          : 'Version A raises risks and uncertainties that version B does not address.'
      );
    } else if (bRisk > aRisk && bRisk > 0) {
      differences.push(
        isSv
          ? 'Version B uttrycker mer oro och identifierar fler riskområden än version A.'
          : 'Version B expresses more concern and identifies more risk areas than version A.'
      );
    }

    // Vagueness difference
    if (aVague > bVague && aVague > 1) {
      differences.push(
        isSv
          ? 'Version A innehåller fler vaga formuleringar som behöver konkretiseras.'
          : 'Version A contains more vague formulations that need to be made concrete.'
      );
    } else if (bVague > aVague && bVague > 1) {
      differences.push(
        isSv
          ? 'Version B använder mer subjektiva termer som kräver definitioner.'
          : 'Version B uses more subjective terms that require definitions.'
      );
    }

    // Length difference
    const lengthDiff = Math.abs(aLength - bLength);
    if (lengthDiff > 100) {
      const longer = aLength > bLength ? (isSv ? 'A' : 'A') : (isSv ? 'B' : 'B');
      differences.push(
        isSv
          ? `Version ${longer} är betydligt längre och mer detaljerad än den andra.`
          : `Version ${longer} is significantly longer and more detailed than the other.`
      );
    }

    // Default if no clear differences found
    if (differences.length === 0) {
      differences.push(
        isSv
          ? 'Versionerna skiljer sig främst i formulering och detaljnivå.'
          : 'The versions differ mainly in wording and level of detail.'
      );
    }

    return differences.slice(0, 4); // Max 4 differences
  }

  /**
   * Extract risk-related notes
   */
  private extractRiskNotes(
    _aLower: string,
    _bLower: string,
    aRisk: number,
    bRisk: number,
    isSv: boolean
  ): string[] {
    const notes: string[] = [];

    if (aRisk > 0 || bRisk > 0) {
      if (aRisk > bRisk) {
        notes.push(
          isSv
            ? 'Version A identifierar fler riskområden som bör adresseras i planeringen.'
            : 'Version A identifies more risk areas that should be addressed in planning.'
        );
      } else if (bRisk > aRisk) {
        notes.push(
          isSv
            ? 'Version B lyfter osäkerheter som kräver förtydliganden innan implementation.'
            : 'Version B raises uncertainties that require clarifications before implementation.'
        );
      } else if (aRisk > 0 && bRisk > 0) {
        notes.push(
          isSv
            ? 'Båda versionerna identifierar risker, men fokuserar på olika områden.'
            : 'Both versions identify risks, but focus on different areas.'
        );
      }
    }

    return notes;
  }

  /**
   * Generate recommended direction based on analysis
   */
  private generateRecommendation(
    aGoal: number,
    bGoal: number,
    aRisk: number,
    bRisk: number,
    differences: string[],
    isSv: boolean
  ): string {
    // If A is more goal-focused and B has risks, combine them
    if (aGoal > bGoal && bRisk > aRisk) {
      return isSv
        ? 'Utgå från version A som målbild och komplettera med riskanalys och validering från version B.'
        : 'Use version A as the goal and complement with risk analysis and validation from version B.';
    }

    // If B is more goal-focused and A has risks
    if (bGoal > aGoal && aRisk > bRisk) {
      return isSv
        ? 'Utgå från version B som målbild, men adressera riskerna och osäkerheterna som version A lyfter.'
        : 'Use version B as the goal, but address the risks and uncertainties raised by version A.';
    }

    // If A is goal-focused and B is vague
    if (aGoal > 0 && differences.some(d => d.includes('vag') || d.includes('vague'))) {
      return isSv
        ? 'Utgå från version A som målbild, men komplettera med mer konkreta definitioner och krav från version B.'
        : 'Use version A as the goal, but complement with more concrete definitions and requirements from version B.';
    }

    // If both have goals but different focuses
    if (aGoal > 0 && bGoal > 0) {
      return isSv
        ? 'Kombinera målinriktningen från båda versionerna, med tydlig prioritering och riskhantering.'
        : 'Combine the goal orientation from both versions, with clear prioritization and risk management.';
    }

    // Default recommendation
    return isSv
      ? 'Kombinera de viktigaste elementen från båda versionerna och förtydliga oklarheter innan implementation.'
      : 'Combine the most important elements from both versions and clarify ambiguities before implementation.';
  }
}


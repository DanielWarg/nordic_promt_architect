import type { SuperPromptConfig } from '../../config/defaults';
import { PatternMatcher } from './PatternMatcher';
import type { TextAnalysisResult } from './types';

/**
 * Analyzes text input and extracts structured information
 */
export class TextAnalyzer {
  private readonly patternMatcher: PatternMatcher;

  constructor() {
    this.patternMatcher = new PatternMatcher();
  }

  /**
   * Analyze input text and return structured analysis result
   */
  public analyze(input: string, config: SuperPromptConfig): TextAnalysisResult {
    // Determine language from config (default to 'sv' if missing/unknown)
    const language = config.project.language === 'en' ? 'en' : 'sv';

    // Extract patterns using PatternMatcher
    const extracted = this.patternMatcher.extract(input, language);

    // Derive context (simple: first sentence or trimmed summary)
    const context = this.deriveContext(input);

    // Calculate clarity score
    const clarityScore = this.calculateClarityScore(input, extracted);

    // Build clarity feedback
    const clarityFeedback = this.buildClarityFeedback(
      input,
      extracted,
      clarityScore,
      language
    );

    // Return full result with all fields set
    return {
      keywords: [], // Not used in v2
      deadlines: extracted.deadlines || [],
      technicalTerms: extracted.technicalTerms || [],
      blockers: extracted.blockers || [],
      risks: extracted.risks || [],
      ambiguousTerms: extracted.ambiguousTerms || [],
      context,
      clarityScore,
      clarityFeedback,
    };
  }

  /**
   * Derive a simple context string from input
   */
  private deriveContext(input: string): string {
    // Get first sentence (simple approach)
    const sentences = input
      .split(/[.!?]\s+/)
      .filter((s) => s.trim().length > 0);

    if (sentences.length > 0) {
      return sentences[0].trim();
    }

    // Fallback: trimmed summary (first 150 chars)
    return input.trim().substring(0, 150).trim();
  }

  /**
   * Calculate clarity score (0-100)
   */
  private calculateClarityScore(
    input: string,
    extracted: Partial<TextAnalysisResult>
  ): number {
    let score = 70; // Base score

    // +10 if at least one deadline detected
    if (extracted.deadlines && extracted.deadlines.length > 0) {
      score += 10;
    }

    // +10 if technicalTerms.length > 2
    if (extracted.technicalTerms && extracted.technicalTerms.length > 2) {
      score += 10;
    }

    // -5 for each ambiguous term (capped to not go below 0)
    if (extracted.ambiguousTerms) {
      const ambiguityPenalty = Math.min(
        extracted.ambiguousTerms.length * 5,
        30
      );
      score -= ambiguityPenalty;
    }

    // -10 if input length < 50 characters
    if (input.trim().length < 50) {
      score -= 10;
    }

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Build clarity feedback messages
   */
  private buildClarityFeedback(
    input: string,
    extracted: Partial<TextAnalysisResult>,
    clarityScore: number,
    language: 'sv' | 'en'
  ): string[] {
    const feedback: string[] = [];

    const messages = {
      sv: {
        missingDeadline: 'Saknar explicit deadline',
        noTechDetails: 'Inga tekniska detaljer specificerade',
        vagueTerms: 'Innehåller vaga termer',
        veryShort: 'Kravbeskrivningen är mycket kort',
        looksClear: 'Kravet verkar tydligt och genomförbart',
      },
      en: {
        missingDeadline: 'Missing explicit deadline',
        noTechDetails: 'No technical details specified',
        vagueTerms: 'Contains vague terms',
        veryShort: 'Requirement description is very short',
        looksClear: 'Requirement looks clear and actionable',
      },
    };

    const msg = messages[language];

    // If no deadline → add feedback
    if (!extracted.deadlines || extracted.deadlines.length === 0) {
      feedback.push(msg.missingDeadline);
    }

    // If technicalTerms.length === 0 → add feedback
    if (!extracted.technicalTerms || extracted.technicalTerms.length === 0) {
      feedback.push(msg.noTechDetails);
    }

    // If ambiguousTerms.length > 0 → add feedback
    if (extracted.ambiguousTerms && extracted.ambiguousTerms.length > 0) {
      const vagueTermsList = extracted.ambiguousTerms.slice(0, 3).join(', ');
      feedback.push(`${msg.vagueTerms}: ${vagueTermsList}`);
    }

    // If input is very short → add feedback
    if (input.trim().length < 50) {
      feedback.push(msg.veryShort);
    }

    // If clarityScore >= 90 and no issues → add positive feedback
    if (clarityScore >= 90 && feedback.length === 0) {
      feedback.push(msg.looksClear);
    }

    return feedback;
  }
}


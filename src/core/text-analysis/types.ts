/**
 * Text analysis result structure
 */
export interface TextAnalysisResult {
  keywords: string[];
  deadlines: string[];
  technicalTerms: string[];
  blockers: string[];
  risks: string[];
  ambiguousTerms: string[];
  context: string;
  clarityScore: number; // 0-100
  clarityFeedback: string[];
}


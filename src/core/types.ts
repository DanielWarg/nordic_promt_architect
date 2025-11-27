import type { SuperPromptConfig } from '../config/defaults';
import type { TextAnalysisResult } from './text-analysis/types';

/**
 * Shared types and interfaces for Nordic Prompt Architect
 */

export type Config = SuperPromptConfig;
export type { TextAnalysisResult };

export interface SanitizerResult {
  masked: string;
  matches: Record<string, number>;
  skipped: boolean;
}

export interface SanitizerAnalysis {
  matches: Record<string, number>;
  hasSensitiveData: boolean;
}

export interface EngineResult {
  markdown: string;
  metadata?: Record<string, unknown>;
}

export interface CompareAnalysisResult {
  summaryA: string;
  summaryB: string;
  mainDifferences: string[];
  riskNotes: string[];
  recommendedDirection: string;
}


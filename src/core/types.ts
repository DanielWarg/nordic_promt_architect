import type { SuperPromptConfig } from '../config/defaults';

/**
 * Shared types and interfaces for Nordic Prompt Architect
 */

export type Config = SuperPromptConfig;

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


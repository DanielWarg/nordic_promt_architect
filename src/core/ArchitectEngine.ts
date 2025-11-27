import { Config, SanitizerResult } from './types';
import { getArchitectMarkdown } from '../templates/prompts';

/**
 * Engine for creating sanitized prompt templates from code
 */
export class ArchitectEngine {
  /**
   * Create sanitized prompt template from code
   */
  public run(_input: string, config: Config, sanitizerResult: SanitizerResult): string {
    return getArchitectMarkdown(sanitizerResult.masked, config, sanitizerResult);
  }
}


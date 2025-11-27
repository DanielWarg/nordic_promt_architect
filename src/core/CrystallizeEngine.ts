import { Config } from './types';
import { getCrystallizeMarkdown } from '../templates/prompts';

/**
 * Engine for crystallizing vague requirements into technical specs
 */
export class CrystallizeEngine {
  /**
   * Transform vague text into technical specification
   */
  public run(input: string, config: Config): string {
    // Template-based transformation (no AI in v1)
    return getCrystallizeMarkdown(input, config);
  }
}


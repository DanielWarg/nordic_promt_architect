import type { Config } from './types';
import type { SuperPromptConfig } from '../config/defaults';
import { TextAnalyzer } from './text-analysis/TextAnalyzer';
import { Logger } from '../ui/Logger';
import { getCrystallizeMarkdown, getTechSpecMarkdown, getDiplomatMarkdown } from '../templates/prompts';

/**
 * Engine for crystallizing vague requirements into technical specs
 */
export class CrystallizeEngine {
  private readonly textAnalyzer: TextAnalyzer;
  private readonly logger?: Logger;

  constructor(logger?: Logger) {
    this.textAnalyzer = new TextAnalyzer();
    this.logger = logger;
  }

  /**
   * Transform vague text into technical specification (backward compatibility)
   */
  public run(input: string, config: Config): string {
    // Template-based transformation (no AI in v1)
    return getCrystallizeMarkdown(input, config);
  }

  /**
   * Generate Tech Spec markdown with analysis and clarity score
   */
  public generateTechSpec(input: string, config: SuperPromptConfig): string {
    if (this.logger) {
      this.logger.info('Starting Crystallize analysis...');
    }

    const analysis = this.textAnalyzer.analyze(input, config);

    if (this.logger) {
      this.logger.info(`Crystallize analysis completed. Clarity score: ${analysis.clarityScore}%`);
    }

    return getTechSpecMarkdown(input, analysis, config);
  }

  /**
   * Generate Diplomat markdown (professional stakeholder reply)
   */
  public generateDiplomat(input: string, config: SuperPromptConfig): string {
    if (this.logger) {
      this.logger.info('Starting Diplomat analysis...');
    }

    const analysis = this.textAnalyzer.analyze(input, config);

    if (this.logger) {
      this.logger.info(`Diplomat analysis completed. Clarity score: ${analysis.clarityScore}%`);
    }

    return getDiplomatMarkdown(input, analysis, config);
  }
}

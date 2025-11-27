import { getVerifyChecklistMarkdown } from '../templates/prompts';

/**
 * Engine for generating checklists from specifications
 */
export class VerifyEngine {
  /**
   * Generate checklist from specification text
   */
  public run(specText: string): string {
    // Parse spec and extract requirements as checklist
    return getVerifyChecklistMarkdown(specText);
  }
}


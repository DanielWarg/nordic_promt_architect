import { minimatch } from 'minimatch';
import type { SanitizerAnalysis, SanitizerResult } from '../core/types';
import { Logger } from '../ui/Logger';
import {
  SECURITY_PATTERNS,
  SECURITY_PATTERN_ALIASES,
  SecurityPattern,
  SecurityPatternId,
} from './patterns';

export class Sanitizer {
  constructor(private readonly logger: Logger) {}

  public sanitize(
    input: string,
    maskPatterns: string[],
    excludePaths: string[] = [],
    filePath?: string
  ): SanitizerResult {
    if (this.shouldExclude(filePath, excludePaths)) {
      return { masked: input, matches: {}, skipped: true };
    }

    const patterns = this.resolvePatterns(maskPatterns);
    if (patterns.length === 0) {
      return { masked: input, matches: {}, skipped: false };
    }

    const { masked, counts } = this.applyMasking(input, patterns);
    this.logMatches(counts);
    return {
      masked,
      matches: counts,
      skipped: false,
    };
  }

  public analyze(input: string, maskPatterns: string[]): SanitizerAnalysis {
    const patterns = this.resolvePatterns(maskPatterns);
    if (patterns.length === 0) {
      return { matches: {}, hasSensitiveData: false };
    }

    const counts = this.runAnalysis(input, patterns);
    return {
      matches: counts,
      hasSensitiveData: Object.values(counts).some((count) => count > 0),
    };
  }

  private shouldExclude(filePath?: string, patterns: string[] = []): boolean {
    if (!filePath || patterns.length === 0) {
      return false;
    }
    return patterns.some((glob) => minimatch(filePath, glob, { dot: true }));
  }

  private resolvePatterns(maskPatterns: string[]): SecurityPattern[] {
    const resolved = new Set<SecurityPatternId>();

    for (const entry of maskPatterns) {
      if ((SECURITY_PATTERNS as Record<string, SecurityPattern>)[entry]) {
        resolved.add(entry as SecurityPatternId);
        continue;
      }

      const aliasTargets = SECURITY_PATTERN_ALIASES[entry];
      if (aliasTargets) {
        aliasTargets.forEach((id) => resolved.add(id));
      } else {
        this.logger.warn(`Unknown mask pattern: ${entry}`);
      }
    }

    return Array.from(resolved).map((id) => SECURITY_PATTERNS[id]);
  }

  private applyMasking(text: string, patterns: SecurityPattern[]): { masked: string; counts: Record<string, number> } {
    let working = text;
    const counts: Record<string, number> = {};

    for (const pattern of patterns) {
      const regex = this.toGlobalRegex(pattern.regex);
      working = working.replace(regex, () => {
        counts[pattern.label] = (counts[pattern.label] || 0) + 1;
        return pattern.token;
      });
    }

    return { masked: working, counts };
  }

  private runAnalysis(text: string, patterns: SecurityPattern[]): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const pattern of patterns) {
      const regex = this.toGlobalRegex(pattern.regex);
      const matches = [...text.matchAll(regex)];
      if (matches.length > 0) {
        counts[pattern.label] = (counts[pattern.label] || 0) + matches.length;
      }
    }

    return counts;
  }

  private toGlobalRegex(regex: RegExp): RegExp {
    const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
    return new RegExp(regex.source, flags);
  }

  private logMatches(counts: Record<string, number>): void {
    const entries = Object.entries(counts);
    if (entries.length === 0) {
      this.logger.info('Sanitizer: No sensitive data detected.');
      return;
    }

    for (const [label, count] of entries) {
      this.logger.info(`Sanitizer masked ${count} ${label}${count > 1 ? ' entries' : ' entry'}.`);
    }
  }
}


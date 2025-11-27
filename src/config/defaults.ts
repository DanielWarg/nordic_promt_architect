export interface ProjectConfig {
  name?: string;
  language: string;
  environment?: string;
}

export interface SecurityConfig {
  mode: string;
  mask_patterns: string[];
  exclude_paths?: string[];
}

export interface TemplatesConfig {
  role: string;
}

export interface SuperPromptConfig {
  project: ProjectConfig;
  security: SecurityConfig;
  templates: TemplatesConfig;
}

/**
 * Enterprise-safe defaults used whenever .superpromptrc.json
 * is missing or invalid.
 */
export const DEFAULT_CONFIG: SuperPromptConfig = {
  project: {
    language: 'sv',
    environment: 'general',
  },
  security: {
    mode: 'STRICT',
    mask_patterns: ['se_personnummer', 'email', 'ipv4'],
    exclude_paths: [],
  },
  templates: {
    role: 'Senior Developer',
  },
};


export type SecurityPatternId =
  | 'se_personnummer'
  | 'email'
  | 'phone'
  | 'ipv4'
  | 'ipv6'
  | 'api_key_openai'
  | 'api_key_aws'
  | 'api_key_bearer';

export interface SecurityPattern {
  id: SecurityPatternId;
  label: string;
  regex: RegExp;
  token: string;
}

export interface SecurityMatch {
  type: string;
  match: string;
  index: number;
  masked: string;
}

export const SECURITY_PATTERNS: Record<SecurityPatternId, SecurityPattern> = {
  se_personnummer: {
    id: 'se_personnummer',
    label: 'personnummer',
    regex: /\b(?:19|20)?\d{6}[-+]\d{4}\b/g,
    token: '<PNR_REDACTED>',
  },
  email: {
    id: 'email',
    label: 'email',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    token: '<EMAIL_HIDDEN>',
  },
  phone: {
    id: 'phone',
    label: 'phone number',
    regex: /\b(?:\+?\d{1,3}[-\s]?)?(?:\d{2,3}[-\s]?){2,4}\d{2,4}\b/g,
    token: '<PHONE_REDACTED>',
  },
  ipv4: {
    id: 'ipv4',
    label: 'IPv4 address',
    regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    token: '<IP_REDACTED>',
  },
  ipv6: {
    id: 'ipv6',
    label: 'IPv6 address',
    regex: /\b(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}\b/g,
    token: '<IPV6_REDACTED>',
  },
  api_key_openai: {
    id: 'api_key_openai',
    label: 'OpenAI API key',
    regex: /sk-[A-Za-z0-9]{20,}/g,
    token: '<API_KEY_SECURED>',
  },
  api_key_aws: {
    id: 'api_key_aws',
    label: 'AWS Access Key',
    regex: /AKIA[0-9A-Z]{16}/g,
    token: '<API_KEY_SECURED>',
  },
  api_key_bearer: {
    id: 'api_key_bearer',
    label: 'Bearer token',
    regex: /Bearer\s+[A-Za-z0-9._\-]{20,}/g,
    token: '<API_KEY_SECURED>',
  },
};

export const SECURITY_PATTERN_ALIASES: Record<string, SecurityPatternId[]> = {
  api_key: ['api_key_openai', 'api_key_aws', 'api_key_bearer'],
};


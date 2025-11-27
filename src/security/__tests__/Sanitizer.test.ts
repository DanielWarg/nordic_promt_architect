import { Sanitizer } from '../Sanitizer';
import type { Logger } from '../../ui/Logger';

class MockLogger implements Pick<Logger, 'info' | 'warn' | 'error'> {
  public logs: string[] = [];
  public info(message: string): void {
    this.logs.push(`[INFO] ${message}`);
  }
  public warn(message: string): void {
    this.logs.push(`[WARN] ${message}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public error(message: string, _error?: unknown): void {
    this.logs.push(`[ERROR] ${message}`);
  }
}

describe('Sanitizer v2', () => {
  let logger: MockLogger;
  let sanitizer: Sanitizer;

  beforeEach(() => {
    logger = new MockLogger();
    sanitizer = new Sanitizer(logger as unknown as Logger);
  });

  it('masks Swedish personnummer', () => {
    const input = 'User PNR: 19900101-1234';
    const result = sanitizer.sanitize(input, ['se_personnummer']);

    expect(result.masked).toContain('<PNR_REDACTED>');
    expect(result.masked).not.toContain('19900101-1234');
    expect(result.matches.personnummer).toBe(1);
    expect(result.skipped).toBe(false);
  });

  it('masks email addresses', () => {
    const input = 'Contact us at test@example.com';
    const result = sanitizer.sanitize(input, ['email']);

    expect(result.masked).toContain('<EMAIL_HIDDEN>');
    expect(result.masked).not.toContain('test@example.com');
    expect(result.matches.email).toBe(1);
  });

  it('masks IPv4 addresses', () => {
    const input = 'Ping 192.168.1.1 now';
    const result = sanitizer.sanitize(input, ['ipv4']);

    expect(result.masked).toContain('<IP_REDACTED>');
    expect(result.matches['IPv4 address']).toBe(1);
  });

  it('masks OpenAI API keys', () => {
    const input = 'Key: sk-1234567890abcdefghijklmnopqrstuvwxyz';
    const result = sanitizer.sanitize(input, ['api_key']);

    expect(result.masked).toContain('<API_KEY_SECURED>');
    expect(result.matches['OpenAI API key']).toBe(1);
  });

  it('respects exclude paths', () => {
    const input = 'Secret: sk-1234567890abcdefghijklmnopqrstuvwxyz';
    const result = sanitizer.sanitize(input, ['api_key'], ['**/fixtures/**'], '/repo/fixtures/data.ts');

    expect(result.skipped).toBe(true);
    expect(result.masked).toBe(input);
    expect(result.matches).toEqual({});
  });

  it('reports analysis counts without masking', () => {
    const input = 'Call me at +46701234567 and email test@example.com';
    const analysis = sanitizer.analyze(input, ['phone', 'email']);

    expect(analysis.hasSensitiveData).toBe(true);
    expect(analysis.matches['phone number']).toBeGreaterThan(0);
    expect(analysis.matches.email).toBeGreaterThan(0);
    expect(input).toContain('+46701234567'); // Ensure analyze does not mutate input
  });
});


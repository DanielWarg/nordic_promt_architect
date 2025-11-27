/**
 * Example test file for Sanitizer
 * This demonstrates how to test the sanitizer manually
 * 
 * To use: Import this in extension.ts temporarily or run in a test environment
 */

import { Sanitizer } from './Sanitizer';
import { Logger } from '../ui/Logger';

/**
 * Example test data with sensitive information
 */
const testInput = `
// Example code with sensitive data
const userEmail = "test@example.com";
const userPNR = "19900101-1234";
const apiKey = "sk-1234567890abcdefghijklmnopqrstuvwxyz";
const serverIP = "192.168.1.1";
const awsKey = "AKIAIOSFODNN7EXAMPLE";
const anotherEmail = "admin@company.se";
const anotherPNR = "850101-1234";
const longToken = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0";
`;

/**
 * Run manual test
 */
export function runSanitizerTest(): void {
  const logger = new Logger();
  const sanitizer = new Sanitizer(logger);
  
  const activePatterns = ['se_personnummer', 'email', 'ipv4', 'api_key'];
  
  console.log('=== SANITIZER TEST ===');
  console.log('\nOriginal input:');
  console.log(testInput);
  
  const result = sanitizer.sanitize(testInput, activePatterns);
  
  console.log('\nSanitized output:');
  console.log(result.masked);
  
  console.log('\nFindings:');
  console.log(result.matches);
  
  console.log('\n=== TEST COMPLETE ===');
  
  // Verify expected replacements
  const expectedReplacements = [
    { original: 'test@example.com', placeholder: '<EMAIL_HIDDEN>' },
    { original: 'admin@company.se', placeholder: '<EMAIL_HIDDEN>' },
    { original: '19900101-1234', placeholder: '<PNR_REDACTED>' },
    { original: '850101-1234', placeholder: '<PNR_REDACTED>' },
    { original: '192.168.1.1', placeholder: '<IP_REDACTED>' },
    { original: 'sk-1234567890abcdefghijklmnopqrstuvwxyz', placeholder: '<API_KEY_SECURED>' },
    { original: 'AKIAIOSFODNN7EXAMPLE', placeholder: '<API_KEY_SECURED>' },
  ];
  
  console.log('\nVerification:');
  let allPassed = true;
  for (const expected of expectedReplacements) {
    const wasReplaced = !result.masked.includes(expected.original);
    const hasPlaceholder = result.masked.includes(expected.placeholder);
    const passed = wasReplaced && hasPlaceholder;
    console.log(`${passed ? '✓' : '✗'} ${expected.original} → ${expected.placeholder}: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      allPassed = false;
    }
  }
  
  console.log(`\nOverall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
}


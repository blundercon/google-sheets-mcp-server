
import { describe, it, expect, beforeAll } from 'vitest';
import { execute as getValues } from '../../tools/google-api-workspace/google-sheets-api/get-values.js';

describe('Service Account Authentication Integration', () => {
  beforeAll(() => {
    // Requires GOOGLE_APPLICATION_CREDENTIALS to be set
    expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).toBeDefined();
  });

  it('should authenticate and fetch values from a public spreadsheet', async () => {
    // Use Google's public demo spreadsheet
    const result = await getValues({
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      range: 'Class Data!A2:E'
    });
    
    expect(result.values).toBeDefined();
    expect(Array.isArray(result.values)).toBe(true);
    expect(result.values.length).toBeGreaterThan(0);
  });

  it('should handle authentication errors gracefully', async () => {
    // Temporarily corrupt credentials
    const original = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    process.env.GOOGLE_APPLICATION_CREDENTIALS = 'invalid-credentials';
    
    await expect(getValues({
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', 
      range: 'Class Data!A2:E'
    })).rejects.toThrowError('The file at invalid-credentials does not exist, or it is not a file.');
    
    // Restore credentials
    process.env.GOOGLE_APPLICATION_CREDENTIALS = original;
  });
});

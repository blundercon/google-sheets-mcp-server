# Data Model: Service Account Authentication

## Overview
This refactoring changes authentication mechanism only. The data models for Google Sheets operations remain unchanged.

## Authentication Data Flow

```
Environment Variable → google-auth-library → Access Token → Google Sheets API
```

## Key Entities

### Service Account Credentials (Environment)
**Source**: `GOOGLE_APPLICATION_CREDENTIALS` environment variable  
**Format**: JSON string or file path  
**Fields**:
- `type`: "service_account"
- `client_email`: Service account email
- `private_key`: Private key for JWT signing
- `project_id`: Google Cloud project ID

### Access Token (Managed by google-auth-library)
**Lifecycle**: Auto-generated and refreshed  
**Scope**: `https://www.googleapis.com/auth/spreadsheets`  
**Expiry**: ~1 hour (handled automatically)

### Tool Request Pattern (Updated)
**Before**:
```javascript
const accessToken = process.env.GOOGLE_API_WORKSPACE_API_KEY;
const headers = { 'Authorization': `Bearer ${accessToken}` };
const response = await fetch(url, { headers });
```

**After**:
```javascript
import { GoogleAuth } from 'google-auth-library';
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
const client = await auth.getClient();
const response = await client.request({ url });
```

## Specific Test Scenarios

### Integration Test Requirements
**Test File**: `test/integration/service-account-auth.test.js`
**Purpose**: Verify google-auth-library integration works with our Google Sheets API patterns

```javascript
// Integration test should verify:
import { describe, it, expect, beforeAll } from 'vitest';

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
    })).rejects.toThrow();
    
    // Restore credentials
    process.env.GOOGLE_APPLICATION_CREDENTIALS = original;
  });
});
```

### Validation Rules
- **Environment**: `GOOGLE_APPLICATION_CREDENTIALS` MUST be set and valid
- **Permissions**: Service account MUST have Google Sheets API access
- **Format**: JSON credentials MUST contain `type: "service_account"`
- **Scopes**: `https://www.googleapis.com/auth/spreadsheets` MUST be accessible

### Error Handling Scenarios
1. **Missing credentials** → `Error: Could not load the default credentials`
2. **Invalid JSON** → `Error: Unexpected token in JSON`  
3. **Wrong permissions** → `Error: The caller does not have permission`
4. **Network timeout** → Auto-retry with exponential backoff (google-auth-library handles this)

## Migration Compatibility

### Backward Compatibility
- Legacy `GOOGLE_API_WORKSPACE_API_KEY` supported during transition
- Show deprecation warning if legacy token detected
- Same tool interfaces and responses

### Breaking Changes
- Environment variable change (documented migration)
- Credential format change (JSON vs token string)
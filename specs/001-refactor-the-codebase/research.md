# Research: Service Account Authentication with google-auth-library

## Decision: Use google-auth-library directly
**Rationale**: 
- Official Google library with 67 dependencies already installed in project
- Handles all complexity: JWT tokens, auto-refresh, environment config, validation
- Battle-tested at scale across thousands of projects
- No need for custom authentication logic

**Alternatives considered**:
- Custom JWT implementation: Rejected - reinventing the wheel, security risks
- Other auth libraries: Rejected - google-auth-library is the official solution

## Concrete Implementation Pattern

### Current Pattern (Before - from get-values.js)
```javascript
const executeFunction = async ({ spreadsheetId, range, majorDimension, valueRenderOption, dateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  const accessToken = process.env.GOOGLE_API_WORKSPACE_API_KEY; // Manual token
  
  // Construct URL with manual token parameter
  const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}/values/${range}`);
  if (accessToken) url.searchParams.append('access_token', accessToken);

  // Manual authorization header
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  // Manual fetch with headers
  const response = await fetch(url.toString(), { method: 'GET', headers });
  // ... error handling
};
```

### New Pattern (After - google-auth-library)
```javascript
import { GoogleAuth } from 'google-auth-library';

const executeFunction = async ({ spreadsheetId, range, majorDimension, valueRenderOption, dateTimeRenderOption }) => {
  const baseUrl = 'https://sheets.googleapis.com';
  
  // google-auth-library handles all authentication
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const client = await auth.getClient();

  // Construct URL (no manual token needed)
  const url = new URL(`${baseUrl}/v4/spreadsheets/${spreadsheetId}/values/${range}`);
  if (majorDimension) url.searchParams.append('majorDimension', majorDimension);
  if (valueRenderOption) url.searchParams.append('valueRenderOption', valueRenderOption);
  if (dateTimeRenderOption) url.searchParams.append('dateTimeRenderOption', dateTimeRenderOption);

  // Authenticated request (headers handled automatically)
  const response = await client.request({
    url: url.toString(),
    method: 'GET'
  });
  
  return response.data; // google-auth-library returns response.data
};
```

### Key Changes Per Tool
1. **Remove**: `const accessToken = process.env.GOOGLE_API_WORKSPACE_API_KEY`
2. **Add**: `import { GoogleAuth } from 'google-auth-library'`
3. **Replace**: Manual `fetch()` calls with `client.request()`
4. **Remove**: Manual authorization headers and URL token parameters
5. **Update**: Return `response.data` instead of parsing JSON manually

## Files to Update
**Google Sheets API Tools (10 files):**
1. `get-values.js` ✓ (in paths.js)
2. `append-values.js` ✓ (in paths.js)
3. `get-sheet.js` ✓ (in paths.js)
4. `update-values.js` ✓ (in paths.js)
5. `create-sheet.js` ✓ (in paths.js)
6. `get-sheet-by-data-filter.js` ✓ (in paths.js)
7. `batch-update-values.js` ❌ (missing from paths.js)
8. `get-values-batch.js` ❌ (missing from paths.js)
9. `update-by-data-filter.js` ❌ (missing from paths.js)
10. `copy-to-sheet.js` ❌ (missing from paths.js)

**Configuration:**
- `tools/paths.js` - Add 4 missing tool registrations

## Testing Strategy
- One integration test: Verify successful authentication and API call
- Update environment documentation
- Existing tool tests continue to work (they test business logic, not auth)

## Migration Plan
1. Write failing integration test
2. Update `tools/paths.js` to register all 10 tools
3. Update tools one by one to use google-auth-library
4. Update .env and documentation
5. Remove legacy `GOOGLE_API_WORKSPACE_API_KEY` support

**Complexity**: LOW - Simple library replacement in 10 files + 1 config file
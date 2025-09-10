# Implementation Guide: Service Account Authentication Refactoring

## Quick Navigation
- **📋 [Plan Overview](./plan.md)** - Full implementation plan and progress tracking
- **🔬 [Research & Code Examples](./research.md#concrete-implementation-pattern)** - Before/after code patterns for all 10 tools
- **🧪 [Test Scenarios](./data-model.md#specific-test-scenarios)** - Integration test requirements and error handling
- **⚡ [Setup Instructions](./quickstart.md)** - Environment configuration and migration steps  
- **📝 [Authentication Contract](./contracts/authentication.md)** - Environment variables and error handling

## Implementation Checklist

### Phase 1: Setup & Testing
- [ ] **Write failing integration test** → Use code from [data-model.md](./data-model.md#integration-test-requirements)
- [ ] **Set up service account** → Follow [quickstart.md](./quickstart.md#1-create-service-account)
- [ ] **Configure environment** → Set `GOOGLE_APPLICATION_CREDENTIALS` per [quickstart.md](./quickstart.md#2-configure-environment)

### Phase 2: Tool Registration  
- [ ] **Update tools/paths.js** → Add 4 missing tools from [research.md](./research.md#files-to-update)

### Phase 3: Tool Refactoring (Apply to all 10 tools)
**Reference Pattern**: [research.md - Key Changes Per Tool](./research.md#key-changes-per-tool)

For each tool file:
- [ ] **Add import**: `import { GoogleAuth } from 'google-auth-library';`
- [ ] **Remove line**: `const accessToken = process.env.GOOGLE_API_WORKSPACE_API_KEY;`
- [ ] **Replace fetch pattern**: Use `client.request()` instead of manual `fetch()`
- [ ] **Remove manual auth**: Delete authorization headers and URL token parameters
- [ ] **Update response**: Return `response.data` instead of parsing JSON

### Phase 4: Documentation & Cleanup
- [ ] **Update .env example** → Add `GOOGLE_APPLICATION_CREDENTIALS` 
- [ ] **Migration documentation** → Reference [quickstart.md migration steps](./quickstart.md#5-migration-from-legacy-auth)
- [ ] **Remove legacy support** → Delete `GOOGLE_API_WORKSPACE_API_KEY` references

## Expected Outcomes

### Before Refactoring
- Manual OAuth token management in 10+ places
- Token expiry requires manual intervention  
- Environment variable: `GOOGLE_API_WORKSPACE_API_KEY`

### After Refactoring  
- Automatic service account authentication
- Auto-refresh handled by google-auth-library
- Environment variable: `GOOGLE_APPLICATION_CREDENTIALS`
- Same external tool interfaces (no breaking changes for users)

## Validation Steps
1. **Integration test passes** → Verifies authentication works
2. **All 10 tools work** → Same functionality, new auth method
3. **Environment migration** → Legacy and new auth both work during transition
4. **Clean removal** → No references to old auth method remain

## Key Files Modified
- `test/integration/service-account-auth.test.js` (new)
- `tools/paths.js` (add 4 missing tools)
- `tools/google-api-workspace/google-sheets-api/*.js` (10 tools refactored)
- `.env` and documentation (environment variable changes)
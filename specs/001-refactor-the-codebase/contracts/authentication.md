# Authentication Contract

## Overview
This refactoring maintains the same external contracts (MCP tool interfaces) while changing internal authentication mechanism.

## External Contract (Unchanged)
**MCP Tool Interface**: All Google Sheets tools maintain identical function signatures and responses.

Example - `get_values` tool:
```javascript
// Input parameters (unchanged)
{
  spreadsheetId: "1ABC123",
  range: "Sheet1!A1:B2"
}

// Output format (unchanged)
{
  values: [["A1", "B1"], ["A2", "B2"]]
}
```

## Internal Contract (Changed)
**Authentication Method**:
- **Before**: Manual OAuth token in `GOOGLE_API_WORKSPACE_API_KEY`
- **After**: Service account via `GOOGLE_APPLICATION_CREDENTIALS`

## Environment Contract

### Required Environment Variables (New)
```bash
# Option 1: Service account JSON file path
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Option 2: Service account JSON string
GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account","client_email":"..."}'
```

### Deprecated (Transitional)
```bash
# Legacy OAuth token (will be removed)
GOOGLE_API_WORKSPACE_API_KEY=ya29.a0AS3H6Nz...
```

## Error Contract

### Authentication Errors (Enhanced)
- **Invalid credentials**: Clear error message with setup instructions
- **Missing credentials**: Fail fast with environment variable guidance
- **Insufficient permissions**: Specific scope and permission requirements
- **Network failures**: Auto-retry with backoff (transparent to user)

## Migration Contract
- **Phase 1**: Both authentication methods supported
- **Phase 2**: Deprecation warnings for legacy method
- **Phase 3**: Legacy method removed (breaking change with major version)
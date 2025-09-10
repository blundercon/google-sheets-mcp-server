# Quickstart: Service Account Authentication Setup

## Prerequisites
- Node.js 16+ installed
- Google Cloud project with Sheets API enabled
- Service account with appropriate permissions

## 1. Create Service Account
```bash
# Create service account
gcloud iam service-accounts create sheets-mcp-server \
    --display-name="Sheets MCP Server"

# Grant Sheets API access
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:sheets-mcp-server@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/editor"

# Generate key file
gcloud iam service-accounts keys create service-account.json \
    --iam-account=sheets-mcp-server@PROJECT_ID.iam.gserviceaccount.com
```

## 2. Configure Environment

### Option A: File Path (Recommended)
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
```

### Option B: JSON String (For containers/CI)
```bash
export GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account","project_id":"your-project",...}'
```

## 3. Install Dependencies
```bash
npm install google-auth-library
```

## 4. Test Authentication
```bash
# Start MCP server
node mcpServer.js

# Test with a simple sheets operation
# Should authenticate automatically without manual tokens
```

## 5. Migration from Legacy Auth
If currently using `GOOGLE_API_WORKSPACE_API_KEY`:

1. **Keep both** environment variables during transition:
   ```bash
   export GOOGLE_API_WORKSPACE_API_KEY="ya29.a0AS3H6Nz..."  # Legacy (temporary)
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"  # New
   ```

2. **Test** that new authentication works
3. **Remove** legacy `GOOGLE_API_WORKSPACE_API_KEY`

## Validation Test
```javascript
// This should work without manual token management
const result = await getValues({
  spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  range: "Class Data!A2:E"
});
console.log(result); // Should show spreadsheet data
```

## Troubleshooting
- **"No authentication credentials"**: Set `GOOGLE_APPLICATION_CREDENTIALS`
- **"Insufficient permissions"**: Grant Sheets API access to service account
- **"File not found"**: Check service account JSON file path
- **"Invalid JSON"**: Validate service account JSON format
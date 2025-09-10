# google-sheets-mcp-server Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-01-07

## Active Technologies
- **Node.js 16+** (ES modules)
- **google-auth-library** - Official Google authentication (001-refactor-the-codebase)
- **@modelcontextprotocol/sdk** - MCP server framework
- **Vitest** - Testing framework

## Project Structure
```
lib/auth/                    # Authentication modules (if needed)
tools/google-api-workspace/  # Google Sheets API tools (10 files to refactor)
specs/001-refactor-the-codebase/  # Current feature documentation
tests/                       # Integration tests
```

## Environment Variables
```bash
# New authentication (preferred)
GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
```

## Code Style
- Use google-auth-library directly, no custom wrappers
- TDD approach: write failing tests first
- Environment-only configuration (12-factor compliant)

## Recent Changes
- 001-refactor-the-codebase: Refactoring 10 Google Sheets tools to use service account authentication

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
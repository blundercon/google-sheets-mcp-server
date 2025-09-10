# Tasks: Service Account Authentication Refactoring

**Input**: Design documents from `/specs/001-refactor-the-codebase/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓), quickstart.md (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Tech stack: Node.js 16+, google-auth-library, Vitest
   → Scope: Refactor 10 Google Sheets tools + 1 config file
2. Load design documents ✓:
   → data-model.md: Integration test scenarios
   → contracts/: Authentication environment contracts
   → research.md: Before/after code patterns and file list
   → quickstart.md: Environment setup steps
3. Generate tasks by category:
   → Setup: Dependencies, test structure
   → Tests: Integration test (TDD - must fail first)
   → Core: Tool registration, 10 tool refactorings
   → Integration: Environment setup, documentation
   → Polish: Legacy cleanup, validation
4. Apply task rules:
   → Different tool files = [P] for parallel execution
   → Same file (paths.js) = sequential
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate parallel execution examples ✓
7. Validate: All 10 tools covered, test-first approach ✓
8. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All file paths are absolute from repository root

## Phase 3.1: Setup
- [ ] **T001** Install google-auth-library dependency (already installed per plan.md)
- [ ] **T002** Create test directory structure `test/integration/`
- [ ] **T003** Verify existing Vitest configuration is compatible

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: This test MUST be written and MUST FAIL before ANY implementation**
- [ ] **T004** Write failing integration test in `test/integration/service-account-auth.test.js`
  - Use test code from data-model.md integration test requirements
  - Test authentication with Google's public demo spreadsheet (1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms)
  - Include error handling test for invalid credentials
  - Must import and test the `getValues` function from refactored tool

## Phase 3.3: Tool Registration (Prerequisite for tool usage)
- [ ] **T005** Update `tools/paths.js` to register 4 missing tools:
  - Add 'google-api-workspace/google-sheets-api/batch-update-values.js'
  - Add 'google-api-workspace/google-sheets-api/get-values-batch.js' 
  - Add 'google-api-workspace/google-sheets-api/update-by-data-filter.js'
  - Add 'google-api-workspace/google-sheets-api/copy-to-sheet.js'

## Phase 3.4: Core Implementation (ONLY after T004 is failing)
**Apply the 5-step pattern from research.md to each tool:**
1. Add import: `import { GoogleAuth } from 'google-auth-library';`
2. Remove: `const accessToken = process.env.GOOGLE_API_WORKSPACE_API_KEY;`
3. Replace: Manual `fetch()` calls with `client.request()`
4. Remove: Manual authorization headers and URL token parameters
5. Update: Return `response.data` instead of parsing JSON manually

**Tool Refactoring Tasks (Can run in parallel - different files):**
- [ ] **T006** [P] Refactor `tools/google-api-workspace/google-sheets-api/get-values.js`
- [ ] **T007** [P] Refactor `tools/google-api-workspace/google-sheets-api/append-values.js`
- [ ] **T008** [P] Refactor `tools/google-api-workspace/google-sheets-api/get-sheet.js`
- [ ] **T009** [P] Refactor `tools/google-api-workspace/google-sheets-api/update-values.js`
- [ ] **T010** [P] Refactor `tools/google-api-workspace/google-sheets-api/create-sheet.js`
- [ ] **T011** [P] Refactor `tools/google-api-workspace/google-sheets-api/get-sheet-by-data-filter.js`
- [ ] **T012** [P] Refactor `tools/google-api-workspace/google-sheets-api/batch-update-values.js`
- [ ] **T013** [P] Refactor `tools/google-api-workspace/google-sheets-api/get-values-batch.js`
- [ ] **T014** [P] Refactor `tools/google-api-workspace/google-sheets-api/update-by-data-filter.js`
- [ ] **T015** [P] Refactor `tools/google-api-workspace/google-sheets-api/copy-to-sheet.js`

## Phase 3.5: Environment & Documentation
- [ ] **T016** Update `.env` example to include `GOOGLE_APPLICATION_CREDENTIALS`
- [ ] **T017** Update `README.md` with service account setup instructions from quickstart.md
- [ ] **T018** Test integration test passes with new implementation
- [ ] **T019** Verify all 10 refactored tools work with MCP server

## Phase 3.6: Legacy Cleanup & Polish
- [ ] **T020** [P] Remove all references to `GOOGLE_API_WORKSPACE_API_KEY` from codebase
- [ ] **T021** [P] Update CLAUDE.md with finalized authentication approach
- [ ] **T022** Run full test suite to ensure no regressions
- [ ] **T023** Manual verification: Start MCP server and test Google Sheets operations

## Dependencies
```
T001-T003 (Setup) → T004 (Integration Test) → T005 (Tool Registration)
T004-T005 → T006-T015 (Tool Refactoring - parallel)
T006-T015 → T016-T019 (Environment & Documentation)
T019 → T020-T023 (Legacy Cleanup & Polish)
```

## Parallel Execution Examples

### Phase 3.2: Write Failing Test (Single Task)
```bash
# T004: Must complete and fail before proceeding
Task: "Write failing integration test in test/integration/service-account-auth.test.js using code from data-model.md"
```

### Phase 3.4: Refactor All Tools (10 Parallel Tasks)
```bash
# Launch T006-T015 together (different files, same pattern):
Task: "Refactor tools/google-api-workspace/google-sheets-api/get-values.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/append-values.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/get-sheet.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/update-values.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/create-sheet.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/get-sheet-by-data-filter.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/batch-update-values.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/get-values-batch.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/update-by-data-filter.js using 5-step pattern from research.md"
Task: "Refactor tools/google-api-workspace/google-sheets-api/copy-to-sheet.js using 5-step pattern from research.md"
```

### Phase 3.6: Polish Tasks (3 Parallel Tasks)
```bash
# Launch T020-T021 together (different concerns):
Task: "Remove all GOOGLE_API_WORKSPACE_API_KEY references from codebase"
Task: "Update CLAUDE.md with finalized authentication approach"
```

## Implementation References
- **Code Pattern**: [research.md - Concrete Implementation Pattern](./research.md#concrete-implementation-pattern)
- **Test Code**: [data-model.md - Integration Test Requirements](./data-model.md#integration-test-requirements)
- **Environment Setup**: [quickstart.md - Configure Environment](./quickstart.md#2-configure-environment)
- **File List**: [research.md - Files to Update](./research.md#files-to-update)

## Success Criteria
1. Integration test passes with service account authentication
2. All 10 Google Sheets tools use google-auth-library instead of manual tokens
3. 4 missing tools are registered and working
4. Environment uses `GOOGLE_APPLICATION_CREDENTIALS` instead of `GOOGLE_API_WORKSPACE_API_KEY`
5. No breaking changes to external MCP tool interfaces
6. Documentation updated with new setup instructions

## Notes
- **TDD Critical**: T004 must fail before implementing T006-T015
- **[P] Tasks**: Can be executed simultaneously (different files)
- **Sequential Tasks**: Must complete in order (same file or dependencies)
- **Reference Documents**: Each task references specific sections in design docs for implementation details
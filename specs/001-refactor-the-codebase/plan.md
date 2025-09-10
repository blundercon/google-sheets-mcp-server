# Implementation Plan: Service Account Authentication Refactoring

**Branch**: `001-refactor-the-codebase` | **Date**: 2025-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/blundercon/code/learning/google-sheets-mcp-server/specs/001-refactor-the-codebase/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Replace manual OAuth access token handling with `google-auth-library` in existing Google Sheets tools. This is a simple library replacement - no new architecture needed. The google-auth-library handles all complexity: environment config, JWT tokens, auto-refresh, validation. We just update 6 tool files to use the library instead of manual token management.

## Technical Context
**Language/Version**: Node.js 16+ (ES modules)
**Primary Dependencies**: google-auth-library (handles all auth complexity)
**Storage**: N/A (google-auth-library manages tokens internally)
**Testing**: Vitest - one integration test only
**Target Platform**: Linux server, cross-platform Node.js  
**Project Type**: single - library replacement in existing MCP server
**Performance Goals**: Default google-auth-library performance (proven at scale)
**Constraints**: Use GOOGLE_APPLICATION_CREDENTIALS environment variable
**Scale/Scope**: Refactor 6 existing tool files, add 1 test

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (existing MCP server, no new projects)
- Using framework directly? YES (google-auth-library directly, no wrappers)
- Single data model? YES (auth handled by library)
- Avoiding patterns? YES (no custom auth patterns, use proven library)

**Architecture**:
- EVERY feature as library? N/A (this is refactoring existing tools)
- Libraries listed: N/A (using existing google-auth-library)
- CLI per library: N/A (existing MCP CLI unchanged)
- Library docs: Will update CLAUDE.md with new environment variables

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? YES (write failing test first)
- Git commits show tests before implementation? YES
- Order: Contract→Integration→E2E→Unit strictly followed? SIMPLIFIED - One integration test only
- Real dependencies used? YES (real Google Sheets API)
- Integration tests for: Library integration with google-auth-library? YES
- FORBIDDEN: Implementation before test, skipping RED phase ACKNOWLEDGED

**Observability**:
- Structured logging included? Use google-auth-library's existing logging
- Frontend logs → backend? N/A
- Error context sufficient? google-auth-library provides detailed errors

**Versioning**:
- Version number assigned? PATCH increment (internal refactoring)
- BUILD increments on every change? YES
- Breaking changes handled? Environment variable change only (documented)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 1 (Single project) - MCP server with authentication libraries

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh [claude|gemini|copilot]` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- **Integration test task**: Use test code from [data-model.md](./data-model.md#specific-test-scenarios)
- **Register missing tools**: Add 4 tools to `tools/paths.js` (see [research.md](./research.md#files-to-update))
- **10 tool refactoring tasks**: Apply pattern from [research.md](./research.md#concrete-implementation-pattern) to each tool
- **Environment setup**: Follow [quickstart.md](./quickstart.md) migration steps
- **Legacy cleanup**: Remove `GOOGLE_API_WORKSPACE_API_KEY` references

**Detailed Task Breakdown**:
1. **Write failing integration test** 
   - Reference: [data-model.md - Integration Test Requirements](./data-model.md#integration-test-requirements)
   - Create `test/integration/service-account-auth.test.js`
   - Use Google's public demo spreadsheet for testing
2. **Update tools/paths.js** 
   - Reference: [research.md - Files to Update](./research.md#files-to-update)
   - Add 4 missing tool paths to registration array
3. **Refactor 10 Google Sheets tools** [P] (parallel execution)
   - Reference: [research.md - Key Changes Per Tool](./research.md#key-changes-per-tool)
   - Apply the before/after pattern to each tool file
   - Update import statements and request handling
4. **Update documentation**
   - Reference: [quickstart.md - Migration steps](./quickstart.md#5-migration-from-legacy-auth)
   - Update .env.example and README
5. **Remove legacy auth support**
   - Remove `GOOGLE_API_WORKSPACE_API_KEY` usage across codebase

**Cross-Document References**:
- Implementation pattern: [research.md](./research.md#concrete-implementation-pattern)
- Test scenarios: [data-model.md](./data-model.md#specific-test-scenarios) 
- Setup instructions: [quickstart.md](./quickstart.md)
- Environment contracts: [contracts/authentication.md](./contracts/authentication.md)

**Estimated Output**: ~15 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A - simple library replacement)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
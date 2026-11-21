---
name: testing-code-review
description: Defines testing, debugging and code review standards for X3M Ideas Agency Life Simulation. Use when implementing, reviewing, debugging or validating application code and game features.
---

# Testing and Code Review Skill

## 1. Project Context

Maintain the reliability of X3M Ideas Agency Life Simulation.

Use the PRD, GDD and other project skills as the primary references.

Every implementation must be tested within its scope before being considered complete.

## 2. Core Testing Principles

- Test functionality, not just whether the application builds.
- Test both successful and unsuccessful user actions.
- Validate important game rules on the server.
- Check that changes do not break existing functionality.
- Prioritise critical game systems over cosmetic details.
- Keep tests focused on the feature being implemented.
- Do not claim a feature works without verifying it.

## 3. Testing Priorities

### Application
- Application starts successfully.
- Production build completes.
- Routes load correctly.
- Forms and buttons behave as expected.
- No unexpected console or runtime errors.

### Authentication
- Registration and login work.
- Protected routes require authentication.
- Users cannot access another player's records.
- Invalid sessions are handled correctly.

### Game Mechanics
- Brief assignment and submission work.
- Objective answers are scored correctly.
- AI evaluations follow the configured rubric.
- Deadlines use the server-controlled game clock.
- Rewards and penalties follow game rules.
- Promotions require the correct eligibility conditions.
- Salary negotiations respect configured salary bands.

### Virtual Economy
- Salary payments are recorded correctly.
- Purchases validate available funds.
- Expenses are applied correctly.
- Duplicate transactions are prevented.
- Balances and transaction histories remain consistent.

### 3D Office
- The office scene renders correctly.
- Player movement and camera controls work.
- NPCs follow configured schedules.
- Interactive objects trigger the correct actions.
- UI panels open and close correctly.
- Rendering remains responsive on supported devices.

### AI Features
- Gemini responses follow the expected output structure.
- Invalid or incomplete responses are handled safely.
- AI evaluations are checked against approved rubrics.
- AI cannot directly modify authoritative game records.
- API failures and timeouts do not break the game.

## 4. Code Review Standards

Before approving code, check for:

- Correct implementation of the requested feature.
- Consistency with the existing architecture.
- Reuse of existing components and services.
- Clear separation of responsibilities.
- TypeScript errors and unsafe type usage.
- Duplicated or unnecessary code.
- Incorrect database queries or data handling.
- Missing validation and error handling.
- Exposed API keys or sensitive information.
- Unnecessary dependencies.
- Potential performance issues.

Do not rewrite working code simply to change its style.

## 5. Security and Data Integrity

Pay particular attention to:

- Server-side validation.
- Authentication and access control.
- Player data isolation.
- Secure API key handling.
- Database transaction integrity.
- Duplicate requests and submissions.
- Financial record consistency.
- Protection against unauthorised game-state changes.

Never trust client-submitted balances, scores, deadlines or employment status.

## 6. Debugging Process

When a bug is reported:

1. Reproduce the issue.
2. Identify the affected feature and files.
3. Inspect the relevant code and error messages.
4. Identify the root cause.
5. Make the smallest appropriate fix.
6. Test the fix.
7. Check for regressions in related functionality.

Do not make unrelated changes while fixing a bug.

Do not hide errors with empty catch blocks, arbitrary delays or superficial workarounds.

## 7. Testing Workflow

For every development task:

1. Review the task requirements.
2. Inspect the existing implementation.
3. Identify the expected behaviour.
4. Implement the change.
5. Run relevant tests.
6. Run TypeScript checks and a production build where appropriate.
7. Review the changed files.
8. Report the results.

If a test cannot be performed, state that clearly.

## 8. Completion Report

After completing a task, provide a concise report covering:

- **Implemented:** What was changed.
- **Files changed:** Relevant files.
- **Tests performed:** Commands and scenarios tested.
- **Results:** Passed or failed checks.
- **Outstanding issues:** Known bugs or untested areas.

Do not report failed or skipped tests as successful.

## 9. Review Priority

When identifying issues, prioritise them in this order:

1. Security vulnerabilities and data loss.
2. Incorrect game logic and financial calculations.
3. Broken functionality.
4. Performance and rendering problems.
5. Maintainability and code quality.
6. Minor styling and formatting issues.

**Primary rule:** A feature is not complete because the code has been written. It is complete when its expected behaviour has been tested, its important edge cases have been considered and its implementation does not compromise existing functionality.
---
name: "Testing dataToDiagram"
description: "How to run and write tests for the dataToDiagram project."
---

# Testing Skill for dataToDiagram

This project uses **Vitest** for unit and graphical component testing, alongside **JSDOM** to ensure DOM-related utilities (like canvas sizing) function properly.

## Running Tests

To run the complete test suite:
```bash
npm run test
```

This will run all `.test.ts` and `.test.tsx` files located in the `tests/` directory and output a coverage report. 

## Writing Tests

1. **Location**: All tests must be placed in the centralized `tests/` directory matching the source path structure (e.g., `src/engine/dataParser.ts` -> `tests/engine/dataParser.test.ts`).
2. **Imports**: Make sure test file imports point to `../../src/...` using relative links.
3. **Mocks**: When testing React components or complex ECharts rendering logic, you can use Vitest’s `vi.mock()` out of the box. 

## Coverage Expectations

We aim to keep statement coverage over 80%. When making structural changes to `engine/specBuilder.ts` or `engine/dataParser.ts`, please write corresponding tests before committing.

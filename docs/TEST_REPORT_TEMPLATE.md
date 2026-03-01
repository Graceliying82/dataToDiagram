# Test Report

**Date:** {{DATE}}
**Framework:** {{FRAMEWORK}}
**Coverage Tool:** {{COVERAGE_TOOL}}

## Summary
{{SUMMARY_DESCRIPTION}}

**Result:** {{TEST_RESULT}}

## Diagram Coverage Details
{{DIAGRAM_COVERAGE_DETAILS}}

## Coverage Overview

| Module Category     | Statement Coverage | Branch Coverage | Function Coverage | Line Coverage |
|---------------------|--------------------|-----------------|-------------------|---------------|
| **All Files**       | **{{ALL_STATEMENT_COV}}** | **{{ALL_BRANCH_COV}}** | **{{ALL_FUNC_COV}}** | **{{ALL_LINE_COV}}** |
| `diagrams/`         | {{DIAG_STATEMENT_COV}} | {{DIAG_BRANCH_COV}} | {{DIAG_FUNC_COV}} | {{DIAG_LINE_COV}} |
| `engine/`           | {{ENG_STATEMENT_COV}} | {{ENG_BRANCH_COV}} | {{ENG_FUNC_COV}} | {{ENG_LINE_COV}} |
| `utils/`            | {{UTILS_STATEMENT_COV}} | {{UTILS_BRANCH_COV}} | {{UTILS_FUNC_COV}} | {{UTILS_LINE_COV}} |
| `types/`            | {{TYPES_STATEMENT_COV}} | {{TYPES_BRANCH_COV}} | {{TYPES_FUNC_COV}} | {{TYPES_LINE_COV}} |

## Detailed Analysis & Resolved Issues
{{DETAILED_ANALYSIS}}

*All test files are centralized in the `/tests` root directory. Run tests locally using `npm run test`.*

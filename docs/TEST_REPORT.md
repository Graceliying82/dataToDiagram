# Test Report

**Date:** March 1, 2026
**Framework:** Vitest + JSDOM
**Coverage Tool:** V8

## Summary
A comprehensive test suite was established for the core logic of the `dataToDiagram` engine, including `dataParser`, `specBuilder`, `legendUtils`, and all 14 `diagram Generators`. This update explicitly adds coverage for the **"Show Total"** feature across all supported renderers (Waterfall, Stacked Bar, Donut Pie) and the `DiagramControls` UI component.

**Result:** **All tests passed successfully.**

## Diagram Coverage Details
The test suite validates **all 14 supported diagram types** dynamically. Additionally, specialized tests verify the conditional rendering and calculation of totals for specific chart types:
- **Waterfall**: Verified toggle between 3-color waterfall (with Total) and item-only waterfall.
- **Stacked Bar**: Verified phantom `_total_` series generation and label summation.
- **Donut Pie**: Verified centered `graphic` total value and sub-label rendering.

## Coverage Overview

| Module Category     | Statement Coverage | Branch Coverage | Function Coverage | Line Coverage |
|---------------------|--------------------|-----------------|-------------------|---------------|
| **All Files**       | **86.37%** | **65.98%** | **92.02%** | **90.00%** |
| `diagrams/`         | 86.76% | 62.58% | 92.64% | 91.61% |
| `engine/`           | 83.78% | 72.56% | 86.36% | 84.53% |
| `utils/`            | 91.30% | 86.66% | 100.00% | 90.90% |
| `types/`            | 100.00% | 100.00% | 100.00% | 100.00% |

## Detailed Analysis & Resolved Issues

1. **"Show Total" Feature Coverage**:
   - Added `tests/components/DiagramControls.test.tsx` using `jsdom` to verify the "Show Total" checkbox visibility logic and its integration with `onChange`.
   - Expanded `tests/diagrams/waterfall.test.ts`, `tests/diagrams/bar.test.ts`, and `tests/diagrams/pie.test.ts` to cover all `showTotal` logic branches.
2. **Environment Configuration**:
   - Updated `vite.config.ts` to enable `globals` and `jsdom` for Vitest.
   - Added `tests/setup.ts` to extend Vitest with `jest-dom` matchers.
3. **Previously Resolved Issues**:
   - Scatter coordinate mapping fallbacks.
   - Waterfall negative total anchoring.
   - Excel file parsing mocks.

*All test files are centralized in the `/tests` root directory. Run tests locally using `npm run test`.*

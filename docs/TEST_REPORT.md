# Test Report

**Date:** March 1, 2026
**Framework:** Vitest + JSDOM
**Coverage Tool:** V8

## Summary
A comprehensive test suite was established for the core logic of the `dataToDiagram` engine, including `dataParser`, `specBuilder`, `legendUtils`, and all 14 `diagram Generators` (Bar, Line, Pie, Radar, Scatter, Waterfall, Combo, Sankey, Treemap, Sunburst, Funnel, Heatmap, Rose, Gauge). Edge cases for data parsing and diagram rendering have been addressed explicitly.

**Result:** **All tests passed successfully.**

## Diagram Coverage Details
The test suite validates **all 14 supported diagram types** dynamically without hardcoded separate files. A single registry test (`tests/diagrams/registry.test.ts`) loops over the `DIAGRAM_META` registry, fetching the specific renderer for each chart. For each diagram, it mocks the required data roles and executes the `toOption()` rendering logic to ensure valid, error-free ECharts configurations are generated.

## Coverage Overview

| Module Category     | Statement Coverage | Branch Coverage | Function Coverage | Line Coverage |
|---------------------|--------------------|-----------------|-------------------|---------------|
| **All Files**       | **86.37%** | **65.98%** | **92.02%** | **90.00%** |
| `diagrams/`         | 86.76% | 62.58% | 92.64% | 91.61% |
| `engine/`           | 83.78% | 72.56% | 86.36% | 84.53% |
| `utils/`            | 91.30% | 86.66% | 100.00% | 90.90% |
| `types/`            | 100.00% | 100.00% | 100.00% | 100.00% |

## Detailed Analysis & Resolved Issues
Based on initial test coverage metrics, the following edge cases were identified, addressed, and are now fully covered by tests:

1. **Resolved: scatter.ts - Missing explicit coordinate mapping fallbacks:** 
   * Added `tests/diagrams/scatter.test.ts` to ensure that string/invalid X/Y coordinates fed to numeric expectations are gracefully filtered out without halting execution or plotting `NaN`. Verified bubble sizing ratio calculations explicitly.
2. **Resolved: waterfall.ts - Edge cases in totals logic:** 
   * Added `tests/diagrams/waterfall.test.ts` to validate that negative total accumulations correctly anchor the transparent baseline block upward, keeping the labels situated perfectly on the 0-axis.
3. **Resolved: dataParser.ts - Excel files:** 
   * Added explicit mocks in `tests/engine/dataParser.test.ts` utilizing `xlsx`'s ArrayBuffer utilities to generate simulated Excel sheet inputs. Fully verified header extraction and column type mapping for Excel file drops.

*All test files are centralized in the `/tests` root directory. Run tests locally using `npm run test`.*

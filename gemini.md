# dataToDiagram Project Context

## Overview
**dataToDiagram** is a frontend web application built to convert tabular data (CSV, Excel) into interactive charts and diagrams utilizing Apache ECharts. 

## Tech Stack & Architecture
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS v4
- **Charting Engine:** Apache ECharts (`echarts`, `echarts-for-react`)
- **Data Parsing:** PapaParse (CSV), xlsx (Excel)
- **Linting:** ESLint with React/TypeScript plugins

## Directory Structure
- `src/components/`: Reusable React UI components
- `src/diagrams/`: ECharts configuration logic and specific chart wrapper components
- `src/engine/`: Core data evaluation, schema mapping, and transformation logic
- `src/types/`: TypeScript definitions for standard data objects and components
- `src/utils/`: Helper and utility functions

## Core Development Guidelines (STRICT)

### 1. Code Quality & Typing
*   **TypeScript First:** Provide strict and robust typing for all React components, functional utilities, and especially ECharts options (`echarts.EChartsOption`). 
*   **Functional Architecture:** Keep the UI layer separate from data processing logic. Build functional React components utilizing modern hooks.

### 2. Charting & Visualization Rules
*   **ECharts Mastery:** Rely heavily on native ECharts configurations for complex rendering logic where possible.
*   **Interactive Elements (Critical):** The application MUST support easily draggable legends and resizable labels around the chart. Since ECharts does not support native drag-and-drop legends out of the box, we must implement robust custom solutions (such as using ECharts' `graphic` component, custom React overlay components, or specific pointer event handling).
*   **Handle Edge Cases & UI Constraints:** For dense data, ensure legends, tooltips, and labels are responsive.
*   **Data Reliability:** Validate external data (CSV/Excel) thoroughly. Implement robust fallback logic for missing values or unexpected encodings.

### 3. Agent Instruction & Context
*   **No AI Assistant GUI:** The interactive AI Assistant UI component was intentionally removed from this application. Do not reintroduce it.
*   **No "Nuclear" Changes:** Never rewrite large swaths of working code entirely from scratch in a single shot. Use surgical, incremental edits.
*   **Honesty & Precision:** If a desired charting capability (e.g., native SVG element dragging) is exceedingly complex or largely unsupported natively by ECharts without severe side-effects, state this clearly instead of creating flaky workarounds. Do not hallucinate properties that do not exist in the official documentation.
*   **Stay Focused:** Limit all recommendations, debugging, and code generation strictly to the stack established above.

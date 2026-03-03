# Low-Level Design: Show Total Feature

**Feature:** Show Total toggle
**Date:** 2026-03-01
**Status:** Implemented

---

## 1. Overview

Adds a `showTotal` boolean flag to `DiagramStyle` that lets users toggle a grand-total annotation on supported chart types. The toggle appears in the Diagram Settings panel only when the active chart type can meaningfully display a total.

---

## 2. Supported Chart Types & Behavior

| Chart Type | Condition for Toggle to Appear | What `showTotal: true` Renders |
|---|---|---|
| Waterfall | Always | A "Total" bar appended as the last category, colored with `palette[2]` |
| Bar | Only when `spec.options.stacked === true` | A zero-height phantom series at the top of each stack, with a bold label showing the column sum |
| Pie | Only when `spec.options.donut === true` | Two centered `graphic` text elements inside the donut hole: the formatted grand total (large, bold) + "Total" sub-label |

All other chart types: toggle is hidden; flag has no effect.

---

## 3. Data Model Changes

**File:** `src/types/diagram.ts`

```ts
// Added to DiagramStyle interface
showTotal: boolean;

// Added to DEFAULT_STYLE
showTotal: true,
```

`DEFAULT_STYLE.showTotal` is `true` so that existing waterfall charts retain their previous behavior (total bar was always shown before this feature).

---

## 4. UI — DiagramControls

**File:** `src/components/DiagramControls.tsx`

- "Show Total" checkbox is rendered **after** the existing Show Legend / Show Labels / Show Grid toggles.
- Visibility condition:
  ```ts
  spec.type === 'waterfall' ||
  (spec.type === 'bar' && spec.options.stacked === true) ||
  (spec.type === 'pie' && spec.options.donut === true)
  ```
- On change: calls `updateStyle({ showTotal: e.target.checked })` — same pattern as all other style toggles.

---

## 5. Renderer Changes

### 5a. Waterfall (`src/diagrams/waterfall.ts`)

**When `showTotal: true`:**
- `categories` array = `[...itemLabels, 'Total']`
- `baseData` and `visibleData` each get one extra entry for the total bar
- `colors` gets `palette[2]` (totalColor)
- Tooltip formatter: `isTotal = showTotal && idx === categories.length - 1`
- Label formatter: same guard

**When `showTotal: false`:**
- `categories` = item labels only (no "Total")
- No extra entries pushed to `baseData`, `visibleData`, `colors`
- Tooltip and label formatters never hit the total branch

**No other code paths change.**

---

### 5b. Bar — Stacked (`src/diagrams/bar.ts`)

**When `showTotal: true` (and stacked):**
A phantom series is appended to the `series` array:

```ts
{
  name: '_total_',
  type: 'bar',
  stack: 'total',           // same stack key as real series
  data: [{value: 0, label: { show: true, position: 'top', formatter: () => totals[idx].toLocaleString() }}, ...],
  itemStyle: { color: 'transparent', borderColor: 'transparent' },
  emphasis: { itemStyle: { color: 'transparent', borderColor: 'transparent' } },
  tooltip: { show: false },
  legendHoverLink: false,
}
```

**How it works:** A zero-value bar in a stack sits at the top of the existing stack without adding height. Its `label.position: 'top'` therefore appears directly above the full stacked bar. The formatter reads from a pre-computed `totals[]` array (sum of all value columns per category index).

**When `showTotal: false` (or not stacked):** the phantom series is never created.

**The custom draggable legend excludes `_total_`** because the legend items are built from `valCols` (the actual data columns), not from the ECharts series array.

---

### 5c. Pie — Donut (`src/diagrams/pie.ts`)

**When `showTotal: true` (and donut):**
Two ECharts `graphic` text elements are added to the `graphic` array:

```ts
// Value label
{ type: 'text', left: 'center', top: '46%',
  style: { text: grandTotal.toLocaleString(), fontSize: fontSize+6, fontWeight: 700, fill: '#1f2937' } }

// Sub-label
{ type: 'text', left: 'center', top: '54%',
  style: { text: 'Total', fontSize: fontSize-1, fill: '#9ca3af' } }
```

`grandTotal` = `pieData.reduce((sum, d) => sum + d.value, 0)` (computed after filtering out zero-value slices).

**When `showTotal: false` (or not donut):** the spread is an empty array `[]` — no graphic elements added.

---

## 6. Edge Cases & Expected Behavior

| Scenario | Expected Result |
|---|---|
| Waterfall with all positive values, `showTotal: true` | Total bar appears at end, anchored at y=0, height = sum |
| Waterfall with all negative values, `showTotal: true` | Total bar appears below x-axis; transparent base anchored at `total`, visible bar = `Math.abs(total)` |
| Waterfall with mixed values, `showTotal: false` | No "Total" category in x-axis; chart ends at last item |
| Waterfall tooltip on non-total bar | Shows the individual item's raw value (positive or negative) |
| Stacked bar, 1 value column, `showTotal: true` | Phantom series label shows the single column's value — same as the bar's own label |
| Stacked bar, `showTotal: true`, then switch to non-stacked | Toggle disappears from UI; `showTotal` flag persists in spec but renderer ignores it (`showTotal = isStacked && spec.style.showTotal`) |
| Donut pie, `showTotal: true`, then switch to regular pie | Toggle disappears from UI; center graphic is not rendered (`showTotal = isDonut && spec.style.showTotal`) |
| Donut pie with zero-value slices | `grandTotal` is computed from `pieData` (after `.filter(d => d.value > 0)`), so zeros are excluded |
| Any chart type not in the supported list (e.g., line, heatmap) | Toggle is hidden; flag has no visual effect |
| `DEFAULT_STYLE` freshly applied | `showTotal: true` — waterfall charts display total bar by default, consistent with pre-feature behavior |

---

## 7. Files Changed

| File | Change Type |
|---|---|
| `src/types/diagram.ts` | Added `showTotal: boolean` to `DiagramStyle`; added `showTotal: true` to `DEFAULT_STYLE` |
| `src/components/DiagramControls.tsx` | Added conditional "Show Total" checkbox |
| `src/diagrams/waterfall.ts` | Gated Total bar behind `spec.style.showTotal` |
| `src/diagrams/bar.ts` | Added phantom total series when stacked + `showTotal` |
| `src/diagrams/pie.ts` | Added center graphic elements when donut + `showTotal` |

---

## 8. Test Entry Points

Tests live in `/tests`. Run with `npm run test`.

Suggested test coverage areas per this feature:

**`src/diagrams/waterfall.ts`**
- `toOption` with `showTotal: true` → `xAxis.data` includes `'Total'`; `series[1].data` length = items + 1
- `toOption` with `showTotal: false` → `xAxis.data` length = items only; `series[1].data` length = items
- Tooltip formatter: total index returns `total`, non-total index returns item value
- Label formatter: same as above
- Negative total case: `baseData[last]` = total (negative), `visibleData[last]` = `Math.abs(total)`

**`src/diagrams/bar.ts`**
- `toOption` with `stacked: true, showTotal: true` → `series` array includes a series named `'_total_'`; its data length matches categories
- `toOption` with `stacked: true, showTotal: false` → no `'_total_'` series
- `toOption` with `stacked: false, showTotal: true` → no `'_total_'` series (guard is `isStacked && showTotal`)
- Phantom series `itemStyle.color` = `'transparent'`
- Phantom series `tooltip.show` = `false`

**`src/diagrams/pie.ts`**
- `toOption` with `donut: true, showTotal: true` → `graphic` array contains elements with `text: grandTotal.toLocaleString()` and `text: 'Total'`
- `toOption` with `donut: true, showTotal: false` → no center graphic text elements
- `toOption` with `donut: false, showTotal: true` → no center graphic text elements
- `grandTotal` excludes zero-value slices (computed post-filter)

**`src/types/diagram.ts`**
- `DEFAULT_STYLE.showTotal === true`

**`src/components/DiagramControls.tsx`**
- Checkbox renders for `type: 'waterfall'`
- Checkbox renders for `type: 'bar'` + `options.stacked: true`
- Checkbox renders for `type: 'pie'` + `options.donut: true`
- Checkbox does **not** render for `type: 'bar'` without `stacked`
- Checkbox does **not** render for `type: 'pie'` without `donut`
- Checkbox does **not** render for `type: 'line'`, `'heatmap'`, `'scatter'`, etc.
- Toggling the checkbox calls `onChange` with updated `spec.style.showTotal`

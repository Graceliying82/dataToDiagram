export const PALETTES: Record<string, { colors: string[]; label: string; description: string }> = {
  // SSP Bright: 8 saturated colors for contrasting categories.
  // Source: Simplified Science Publishing — "Any Eight Contrasting Colors"
  'ssp-bright': {
    label: 'SSP Bright',
    description: 'Saturated 8-category',
    colors: ['#003a7d', '#008dff', '#ff73b6', '#c701ff', '#4ecb8d', '#ff9d3a', '#f9e858', '#d83034'],
  },
  // SSP Muted: 8 softer colors for dense figures or when bright is too harsh.
  // Source: Simplified Science Publishing — "Muted" palette
  'ssp-muted': {
    label: 'SSP Muted',
    description: 'Soft 8-category',
    colors: ['#0b81a2', '#59a89c', '#36b700', '#f0c571', '#e25759', '#9d2c00', '#7e4794', '#c8c8c8'],
  },
  // SSP Qualitative: 6-color palette for named categorical data.
  // Source: Simplified Science Publishing — "Qualitative" 6-color chart examples
  'ssp-qualitative': {
    label: 'SSP Qualitative',
    description: '6-color categorical',
    colors: ['#082a54', '#2066a8', '#59a89c', '#f0c571', '#e02b35', '#a559aa'],
  },
  // SSP Paired: Alternating light/dark pairs — ideal for grouped comparisons (e.g. before/after, male/female).
  // Source: Simplified Science Publishing — "Alternating Light/Dark Pairs"
  'ssp-paired': {
    label: 'SSP Paired',
    description: 'Light/dark grouped pairs',
    colors: ['#8fd7d7', '#00b0be', '#ff8ca1', '#f45f74', '#bdd373', '#98c127', '#ffcd8e', '#ffb255'],
  },
  // SSP Divergent: 7-step blue→gray→red for heat maps and data that diverges from a midpoint.
  // Source: Simplified Science Publishing — "Divergent (Heat maps)"
  'ssp-divergent': {
    label: 'SSP Divergent',
    description: 'Blue–gray–red heatmap',
    colors: ['#2066a8', '#8ec1da', '#cde1ec', '#ededed', '#f6d6c2', '#d47264', '#ae282c'],
  },
  // SSP Sequential: 6-step teal ramp for ordered/continuous data.
  // Source: Simplified Science Publishing — "Sequential" 6-color chart examples
  'ssp-sequential': {
    label: 'SSP Sequential',
    description: 'Teal ramp (ordered data)',
    colors: ['#b5d1ae', '#80ae9a', '#568b87', '#326b77', '#1b485e', '#122740'],
  },
  // Okabe-Ito: Gold standard colorblind-safe palette (CVD-safe for all 3 types).
  // Designed by Masataka Okabe & Kei Ito; independently recommended by SSP for CVD accessibility.
  'okabe-ito': {
    label: 'Okabe-Ito',
    description: 'Colorblind-safe (CVD)',
    colors: ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#000000'],
  },
  // SSP Grayscale: 8-step ramp for monochrome print or supplementary figures.
  // Source: Simplified Science Publishing — "Grayscale" palette (15–30% saturation steps)
  mono: {
    label: 'Mono',
    description: 'Grayscale for print',
    colors: ['#0d0d0d', '#262626', '#595959', '#7f7f7f', '#a1a1a1', '#bababa', '#d4d4d4', '#ededed'],
  },
};

export const DEFAULT_PALETTE = 'ssp-divergent';

// Flat color array export for backwards compatibility
export const PALETTE_COLORS: Record<string, string[]> = Object.fromEntries(
  Object.entries(PALETTES).map(([k, v]) => [k, v.colors])
);

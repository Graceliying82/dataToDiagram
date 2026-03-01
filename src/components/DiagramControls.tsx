import type { DiagramSpec, DiagramStyle } from '../types/diagram';
import { PALETTES } from '../themes/palettes';

interface DiagramControlsProps {
  spec: DiagramSpec;
  onChange: (spec: DiagramSpec) => void;
}

const POSITION_OPTIONS: { value: DiagramStyle['legendPosition']; label: string; icon: string }[] = [
  { value: 'top-left',     label: 'Top left',     icon: '↖' },
  { value: 'top-right',    label: 'Top right',    icon: '↗' },
  { value: 'bottom-left',  label: 'Bottom left',  icon: '↙' },
  { value: 'bottom-right', label: 'Bottom right', icon: '↘' },
];

export function DiagramControls({ spec, onChange }: DiagramControlsProps) {
  const updateStyle = (partial: Partial<DiagramStyle>) => {
    onChange({ ...spec, style: { ...spec.style, ...partial } });
  };

  const activePaletteName = Object.entries(PALETTES).find(
    ([, v]) => JSON.stringify(v.colors) === JSON.stringify(spec.style.palette)
  )?.[0];

  return (
    <div className="space-y-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-700 text-sm">Diagram Settings</h3>

      {/* Title */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Title</label>
        <input
          type="text"
          value={spec.title}
          onChange={(e) => onChange({ ...spec, title: e.target.value })}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {/* Color Palette */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Color Palette</label>
        <div className="grid grid-cols-1 gap-1.5">
          {Object.entries(PALETTES).map(([name, { label, description, colors }]) => {
            const isActive = name === activePaletteName;
            return (
              <button
                key={name}
                onClick={() => updateStyle({ palette: colors })}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg border text-sm transition-all ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-400'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40'
                }`}
              >
                {/* 8-color swatch row */}
                <div className="flex gap-px flex-shrink-0">
                  {colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-5 first:rounded-l-sm last:rounded-r-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="text-left leading-tight min-w-0">
                  <div className="font-medium text-gray-700 text-xs">{label}</div>
                  <div className="text-gray-400 text-[10px] truncate">{description}</div>
                </div>
                {isActive && (
                  <div className="ml-auto flex-shrink-0 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        {[
          { key: 'showLegend' as const, label: 'Show Legend' },
          { key: 'showLabels' as const, label: 'Show Labels' },
          { key: 'showGrid' as const, label: 'Show Grid' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={spec.style[key]}
              onChange={(e) => updateStyle({ [key]: e.target.checked })}
              className="rounded border-gray-300 text-indigo-500 focus:ring-indigo-300"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Legend Position — only shown when legend is visible */}
      {spec.style.showLegend && (
        <div>
          <label className="block text-xs text-gray-500 mb-2">Legend Position</label>
          <div className="inline-grid grid-cols-2 gap-1 p-1 bg-white border border-gray-200 rounded-lg">
            {POSITION_OPTIONS.map(({ value, label, icon }) => (
              <button
                key={value}
                title={label}
                onClick={() => updateStyle({ legendPosition: value })}
                className={`w-10 h-9 rounded-md flex items-center justify-center text-base transition-all ${
                  spec.style.legendPosition === value
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Drag to reposition freely</p>
        </div>
      )}

      {/* Font Size */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Font Size: {spec.style.fontSize}px</label>
        <input
          type="range"
          min="8"
          max="18"
          value={spec.style.fontSize}
          onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
}

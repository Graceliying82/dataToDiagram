import { DIAGRAM_META } from '../diagrams/registry';
import type { DiagramType } from '../types/diagram';

interface DiagramPickerProps {
  selected: DiagramType | null;
  onSelect: (type: DiagramType) => void;
  recommended?: DiagramType[];
  applicable?: DiagramType[];
  variant?: 'grid' | 'compact';
}

export function DiagramPicker({
  selected,
  onSelect,
  recommended = [],
  applicable = [],
  variant = 'grid'
}: DiagramPickerProps) {
  const isTypeApplicable = (type: DiagramType) => applicable.length === 0 || applicable.includes(type);

  if (variant === 'compact') {
    return (
      <div className="flex flex-col gap-2">
        {DIAGRAM_META.map((meta) => {
          const isRecommended = recommended.includes(meta.type);
          const isSelected = selected === meta.type;
          const isApplicable = isTypeApplicable(meta.type);

          return (
            <button
              key={meta.type}
              onClick={() => isApplicable && onSelect(meta.type)}
              disabled={!isApplicable}
              className={`
                flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                ${isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'}
                ${!isApplicable ? 'opacity-40 grayscale cursor-not-allowed border-dashed' : ''}
              `}
            >
              <div className="text-xl">{meta.icon}</div>
              <div className="flex-1 text-left">
                <div className={`font-semibold text-xs ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {meta.label}
                </div>
                {isRecommended && !isSelected && isApplicable && (
                  <div className="text-[10px] text-green-600 font-medium">✨ Recommended</div>
                )}
                {!isApplicable && (
                  <div className="text-[10px] text-slate-400 font-medium italic">Not suitable for data</div>
                )}
              </div>
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {DIAGRAM_META.map((meta) => {
        const isRecommended = recommended.includes(meta.type);
        const isSelected = selected === meta.type;
        const isApplicable = isTypeApplicable(meta.type);

        return (
          <button
            key={meta.type}
            onClick={() => isApplicable && onSelect(meta.type)}
            disabled={!isApplicable}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all
              ${isSelected
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
              ${!isApplicable ? 'opacity-40 grayscale cursor-not-allowed border-dashed' : ''}
            `}
          >
            {isRecommended && isApplicable && (
              <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Recommended
              </span>
            )}
            {!isApplicable && (
              <span className="absolute top-2 right-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium italic">
                N/A
              </span>
            )}
            <div className="text-2xl mb-1">{meta.icon}</div>
            <div className="font-medium text-gray-800 text-sm">{meta.label}</div>
            <div className="text-xs text-gray-500 mt-1 leading-tight">{meta.description}</div>
          </button>
        );
      })}
    </div>
  );
}

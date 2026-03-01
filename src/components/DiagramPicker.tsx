import { DIAGRAM_META } from '../diagrams/registry';
import type { DiagramType } from '../types/diagram';

interface DiagramPickerProps {
  selected: DiagramType | null;
  onSelect: (type: DiagramType) => void;
  recommended?: DiagramType[];
}

export function DiagramPicker({ selected, onSelect, recommended = [] }: DiagramPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {DIAGRAM_META.map((meta) => {
        const isRecommended = recommended.includes(meta.type);
        const isSelected = selected === meta.type;
        return (
          <button
            key={meta.type}
            onClick={() => onSelect(meta.type)}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all
              ${isSelected
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
            `}
          >
            {isRecommended && (
              <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Recommended
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

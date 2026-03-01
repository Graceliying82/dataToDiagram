import type { EChartsOption } from 'echarts';
import type { DiagramSpec } from '../types/diagram';

export interface LegendItem {
    id: string;
    label: string;
    color: string;
}

function positionFromSpec(legendPosition: DiagramSpec['style']['legendPosition']) {
    switch (legendPosition) {
        case 'top-left':    return { left: 16, top: 16 };
        case 'top-right':   return { right: 16, top: 16 };
        case 'bottom-left': return { left: 16, bottom: 16 };
        case 'bottom-right':
        default:            return { right: 16, bottom: 16 };
    }
}

export function createDraggableLegend(
    items: LegendItem[],
    spec: DiagramSpec,
): NonNullable<EChartsOption['graphic']> {
    if (!spec.style.showLegend || items.length === 0) {
        return { elements: [] };
    }

    const { fontSize } = spec.style;
    const itemHeight = fontSize + 14;
    const padding = 12;
    const handleHeight = 18; // drag-handle strip at top
    const groupHeight = items.length * itemHeight + padding * 2 + handleHeight;
    const maxLabelLength = Math.max(...items.map(item => item.label.length));
    const groupWidth = Math.max(130, maxLabelLength * (fontSize * 0.58) + 52);

    const pos = positionFromSpec(spec.style.legendPosition);

    const elements: any[] = [
        // Background card
        {
            type: 'rect',
            z: 100,
            left: 0,
            top: 0,
            shape: { width: groupWidth, height: groupHeight, r: 6 },
            style: {
                fill: 'rgba(255,255,255,0.95)',
                stroke: '#e5e7eb',
                lineWidth: 1,
                shadowBlur: 12,
                shadowColor: 'rgba(0,0,0,0.10)',
                shadowOffsetX: 0,
                shadowOffsetY: 3,
            },
        },
        // Drag handle strip
        {
            type: 'rect',
            z: 101,
            left: 0,
            top: 0,
            shape: { width: groupWidth, height: handleHeight, r: [6, 6, 0, 0] },
            style: { fill: '#f3f4f6' },
        },
        // Drag handle dots
        {
            type: 'text',
            z: 102,
            left: groupWidth / 2 - 10,
            top: 3,
            style: {
                fill: '#9ca3af',
                text: '⠿',
                font: `11px sans-serif`,
            },
        },
        // "Legend" label in handle
        {
            type: 'text',
            z: 102,
            left: padding,
            top: 2,
            style: {
                fill: '#6b7280',
                text: 'Legend',
                font: `bold ${fontSize - 1}px sans-serif`,
            },
        },
    ];

    items.forEach((item, index) => {
        const yPos = handleHeight + padding + index * itemHeight;

        // Color swatch
        elements.push({
            type: 'rect',
            z: 101,
            left: padding,
            top: yPos + (itemHeight - 12) / 2,
            shape: { width: 12, height: 12, r: 3 },
            style: { fill: item.color },
        });

        // Label
        elements.push({
            type: 'text',
            z: 101,
            left: padding + 20,
            top: yPos + (itemHeight - fontSize) / 2,
            style: {
                fill: '#374151',
                text: item.label,
                font: `${fontSize}px sans-serif`,
                overflow: 'truncate',
                width: groupWidth - padding * 2 - 20,
            },
        });
    });

    return {
        elements: [
            {
                type: 'group',
                id: `draggable-legend-${spec.style.legendPosition}`,
                ...pos,
                draggable: true,
                cursor: 'move',
                children: elements,
            },
        ],
    };
}

export function createResizableLabel(
    text: string,
    spec: DiagramSpec,
    options?: { top?: number | string; left?: number | string; id?: string }
): NonNullable<EChartsOption['graphic']> {
    return {
        elements: [
            {
                type: 'group',
                id: options?.id ?? 'resizable-label',
                left: options?.left ?? 'center',
                top: options?.top ?? 'top',
                draggable: true,
                children: [
                    {
                        type: 'text',
                        z: 100,
                        style: {
                            fill: '#1f2937',
                            text: text,
                            font: `bold ${spec.style.fontSize + 4}px sans-serif`,
                        },
                    },
                ],
            },
        ],
    };
}

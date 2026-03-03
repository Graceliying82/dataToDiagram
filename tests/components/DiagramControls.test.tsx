import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiagramControls } from '../../src/components/DiagramControls';
import type { DataSet } from '../../src/types/data';
import { DEFAULT_STYLE, DiagramSpec } from '../../src/types/diagram';
import '@testing-library/jest-dom';

describe('DiagramControls', () => {
    const baseSpec: DiagramSpec = {
        type: 'line',
        title: 'My Chart',
        mappings: [],
        style: DEFAULT_STYLE,
        options: {},
        disabledCategories: []
    };

    const mockData: DataSet = {
        rowCount: 3,
        columns: [
            { name: 'Cat', type: 'string', values: ['A', 'B', 'C'] },
            { name: 'Val', type: 'number', values: [10, 20, 30] }
        ]
    };

    it('renders basic settings like title', () => {
        render(<DiagramControls spec={baseSpec} onChange={() => { }} />);
        const input = screen.getByDisplayValue('My Chart');
        expect(input).toBeInTheDocument();
    });

    it('shows "Show Total" checkbox for waterfall chart', () => {
        const spec = { ...baseSpec, type: 'waterfall' as const };
        render(<DiagramControls spec={spec} onChange={() => { }} />);
        expect(screen.getByText('Show Total')).toBeInTheDocument();
    });

    it('shows "Show Total" checkbox for stacked bar chart', () => {
        const spec = { ...baseSpec, type: 'bar' as const, options: { stacked: true } };
        render(<DiagramControls spec={spec} onChange={() => { }} />);
        expect(screen.getByText('Show Total')).toBeInTheDocument();
    });

    it('shows "Show Total" checkbox for donut pie chart', () => {
        const spec = { ...baseSpec, type: 'pie' as const, options: { donut: true } };
        render(<DiagramControls spec={spec} onChange={() => { }} />);
        expect(screen.getByText('Show Total')).toBeInTheDocument();
    });

    it('hides "Show Total" for regular bar chart', () => {
        const spec = { ...baseSpec, type: 'bar' as const, options: { stacked: false } };
        render(<DiagramControls spec={spec} onChange={() => { }} />);
        expect(screen.queryByText('Show Total')).not.toBeInTheDocument();
    });

    it('calls onChange when "Show Total" is toggled', () => {
        const spec = { ...baseSpec, type: 'waterfall' as const, style: { ...DEFAULT_STYLE, showTotal: false } };
        const onChange = vi.fn();
        render(<DiagramControls spec={spec} onChange={onChange} />);

        const checkbox = screen.getByLabelText('Show Total');
        fireEvent.click(checkbox);

        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            style: expect.objectContaining({ showTotal: true })
        }));
    });

    it('renders category filter chips when categories are present', () => {
        const spec: DiagramSpec = {
            ...baseSpec,
            type: 'pie',
            mappings: [{ role: 'category', columnName: 'Cat' }]
        };
        render(<DiagramControls spec={spec} data={mockData} onChange={() => { }} />);

        expect(screen.getByText('Filter Data')).toBeInTheDocument();
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('toggles category when chip is clicked', () => {
        const spec: DiagramSpec = {
            ...baseSpec,
            type: 'pie',
            mappings: [{ role: 'category', columnName: 'Cat' }]
        };
        const onChange = vi.fn();
        render(<DiagramControls spec={spec} data={mockData} onChange={onChange} />);

        const chipA = screen.getByText('A');
        fireEvent.click(chipA);

        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
            disabledCategories: ['A']
        }));
    });
});

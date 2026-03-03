import { useState, useCallback } from 'react';
import type { ECharts } from 'echarts/core';
import type { DataSet } from './types/data';
import type { DiagramSpec, DiagramType } from './types/diagram';
import { parseFile } from './engine/dataParser';
import { suggestDiagrams, buildSpec } from './engine/specBuilder';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { DiagramPicker } from './components/DiagramPicker';
import { DiagramCanvas } from './components/DiagramCanvas';
import { DiagramControls } from './components/DiagramControls';
import { ExportButton } from './components/ExportButton';

type Step = 'upload' | 'pick' | 'view';

export default function App() {
  const [step, setStep] = useState<Step>('upload');
  const [data, setData] = useState<DataSet | null>(null);
  const [fileName, setFileName] = useState('');
  const [spec, setSpec] = useState<DiagramSpec | null>(null);
  const [recommended, setRecommended] = useState<DiagramType[]>([]);
  const [applicableTypes, setApplicableTypes] = useState<DiagramType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chartInstance, setChartInstance] = useState<ECharts | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    try {
      const parsed = await parseFile(file);
      setData(parsed);
      setFileName(file.name);

      const suggestions = suggestDiagrams(parsed);
      setApplicableTypes(suggestions.map(s => s.type));
      setRecommended(suggestions.slice(0, 3).map(s => s.type));

      if (suggestions.length > 0) {
        const top = suggestions[0];
        setSpec(buildSpec(top.type, top.mappings, file.name.replace(/\.\w+$/, '')));
      }

      setStep('view');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  }, []);

  const handleDiagramSelect = useCallback((type: DiagramType) => {
    if (!data) return;
    const suggestions = suggestDiagrams(data);
    const match = suggestions.find(s => s.type === type);
    if (match) {
      setSpec(prev => buildSpec(type, match.mappings, prev?.title || 'Untitled'));
    }
  }, [data]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setData(null);
    setSpec(null);
    setFileName('');
    setError(null);
    setChartInstance(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            <span className="text-indigo-600">data</span>ToDiagram
          </h1>
          {step !== 'upload' && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{fileName}</span>
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="max-w-lg mx-auto mt-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Beautiful diagrams from your data</h2>
              <p className="text-gray-500">Upload a CSV or Excel file to get started</p>
            </div>
            <FileUpload onFile={handleFile} />
          </div>
        )}

        {/* Step 2: Pick diagram */}
        {step === 'pick' && data && (
          <div className="space-y-6">
            <DataPreview data={data} />

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Choose a diagram type</h2>
              <DiagramPicker
                selected={spec?.type || null}
                onSelect={(type) => {
                  handleDiagramSelect(type);
                  setStep('view');
                }}
                recommended={recommended}
                applicable={applicableTypes}
              />
            </div>

            {spec && (
              <div className="text-center">
                <button
                  onClick={() => setStep('view')}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-all"
                >
                  View Diagram
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: View & refine */}
        {step === 'view' && data && spec && (
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-8">
            {/* Left Sidebar: Diagram Type Selector */}
            <aside className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Chart Type</h3>
              </div>
              <div className="flex flex-col gap-3">
                <DiagramPicker
                  selected={spec.type}
                  onSelect={handleDiagramSelect}
                  recommended={recommended}
                  applicable={applicableTypes}
                  variant="compact"
                />
              </div>
            </aside>

            {/* Middle: Canvas */}
            <div className="space-y-6">
              <div className="flex items-center justify-end">
                <ExportButton chartInstance={chartInstance} />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <DiagramCanvas data={data} spec={spec} onChartReady={setChartInstance} />
              </div>
            </div>

            {/* Right Sidebar: Controls & Preview */}
            <aside className="space-y-6 relative group">
              <div className="transition-all duration-500 opacity-20 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
                <DiagramControls spec={spec} onChange={setSpec} data={data} />
              </div>
              <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                <DataPreview data={data} maxRows={5} />
              </div>

              {/* Hint when not hovered */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 pr-4 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 rotate-90 origin-right whitespace-nowrap">
                  <span>SETTINGS & PREVIEW</span>
                  <svg className="w-3 h-3 rotate-[-90deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

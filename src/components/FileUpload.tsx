import { useCallback, useState } from 'react';

interface FileUploadProps {
  onFile: (file: File) => void;
}

export function FileUpload({ onFile }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        relative group border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300
        ${dragging
          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02] shadow-xl'
          : 'border-slate-200 bg-white/50 hover:border-indigo-400 hover:bg-white hover:scale-[1.01] hover:shadow-lg'}
      `}
    >
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-indigo-200 shadow-lg group-hover:rotate-3 transition-transform duration-300">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Ready to visualize?
        </h3>
        <p className="text-slate-500 text-lg">
          Drop your <span className="text-indigo-600 font-semibold">CSV</span> or <span className="text-indigo-600 font-semibold">Excel</span> file here
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
          <span>Click to browse</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>Max 10MB</span>
        </div>
      </label>
    </div>
  );
}

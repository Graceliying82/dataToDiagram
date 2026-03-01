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
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
        ${dragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}
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
        <div className="text-4xl mb-3">📁</div>
        <p className="text-lg font-medium text-gray-700">
          Drop your CSV or Excel file here
        </p>
        <p className="text-sm text-gray-500 mt-1">
          or click to browse
        </p>
      </label>
    </div>
  );
}

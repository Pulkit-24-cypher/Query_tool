import React from 'react';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ value, onChange }) => {
  return (
    <div className="relative max-w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 p-4 bg-slate-900 text-white rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-x-auto"
        placeholder="Enter your SQL query here..."
        spellCheck={false}
      />
      <div className="absolute top-2 right-2">
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">SQL</span>
      </div>
    </div>
  );
};

export default QueryEditor;
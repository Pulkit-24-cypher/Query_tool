import React from 'react';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ value, onChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      // The parent component will handle the query execution
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-32 p-4 bg-slate-900 text-white rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        placeholder="Enter your SQL query here... (Ctrl+Enter to execute)"
        spellCheck={false}
      />
      <div className="absolute top-2 right-2">
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">SQL</span>
      </div>
    </div>
  );
};

export default QueryEditor;

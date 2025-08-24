import React, { useState } from 'react';
import { Table, Code, ChevronDown, ChevronRight, Info } from 'lucide-react';

interface Table {
  name: string;
  schema?: any[];
}

interface SidebarProps {
  tables: Table[];
  onTableSelect: (tableName: string) => void;
  activeView: 'query' | 'api';
  onViewChange: (view: 'query' | 'api') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tables, onTableSelect, activeView, onViewChange }) => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
      {/* Navigation */}
      <div className="p-4 border-b border-slate-200">
        <nav className="space-y-2">
          <button
            onClick={() => onViewChange('query')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150 ${
              activeView === 'query'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Table className="w-5 h-5" />
            <span className="font-medium">Query Tool</span>
          </button>
          <button
            onClick={() => onViewChange('api')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150 ${
              activeView === 'api'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Code className="w-5 h-5" />
            <span className="font-medium">API Docs</span>
          </button>
        </nav>
      </div>

      {/* Tables */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-slate-900 mb-3">Database Tables</h3>
          <div className="space-y-1">
            {tables.length > 0 ? (
              tables.map((table) => (
                <div key={table.name} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleTable(table.name)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-2">
                      <Table className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-900">{table.name}</span>
                    </div>
                    {expandedTables.has(table.name) ? (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  
                  {expandedTables.has(table.name) && (
                    <div className="bg-slate-50 border-t border-slate-200 p-3 space-y-2">
                      <button
                        onClick={() => onTableSelect(table.name)}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150"
                      >
                        Browse data
                      </button>
                      <button
                        onClick={() => onTableSelect(`PRAGMA table_info(${table.name})`)}
                        className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded transition-colors duration-150"
                      >
                        View schema
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Table className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tables found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Make sure your database file is accessible
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Info className="w-4 h-4" />
          <span>{tables.length} tables found</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
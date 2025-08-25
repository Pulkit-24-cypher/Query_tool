import React, { useState, useEffect } from 'react';
import { Database, Play, Download, Table, Info, AlertCircle } from 'lucide-react';
import QueryEditor from './components/QueryEditor';
import ResultsTable from './components/ResultsTable';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import ApiDocumentation from './components/ApiDocumentation';

interface QueryResult {
  success: boolean;
  data?: any[];
  rowCount?: number;
  query?: string;
  error?: string;
}

interface Table {
  name: string;
  schema?: any[];
}

function App() {
  const [query, setQuery] = useState('SELECT * FROM Incentive LIMIT 10');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [activeView, setActiveView] = useState<'query' | 'api'>('query');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/tables');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setTables(data.tables.map((name: string) => ({ name })));
      } else {
        console.error('Failed to fetch tables:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      // Check if backend is running
      try {
        const healthCheck = await fetch('http://localhost:3001/api/health');
        if (!healthCheck.ok) {
          console.error('Backend server is not responding properly');
        }
      } catch (healthError) {
        console.error('Backend server is not running. Please start it with: npm run server');
      }
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      setResults(result);
    } catch (error) {
      setResults({
        success: false,
        error: 'Failed to connect to the server. Make sure the API server is running.',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!results?.data) return;

    const csv = [
      Object.keys(results.data[0]).join(','),
      ...results.data.map(row => 
        Object.values(row).map(val => 
          typeof val === 'string' ? `"${val}"` : val
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <Sidebar 
        tables={tables}
        onTableSelect={(tableName) => setQuery(`SELECT * FROM ${tableName} LIMIT 10`)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Investment Incentive Query Tool
                </h1>
                <p className="text-slate-600">Execute SQL queries and explore your database</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-hidden max-w-full">
          {activeView === 'query' ? (
            <div className="space-y-6 max-w-full overflow-hidden">
              {/* Query Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">SQL Query Editor</h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={executeQuery}
                      disabled={loading || !query.trim()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {loading ? 'Running...' : 'Run Query'}
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-hidden max-w-full">
                  <QueryEditor value={query} onChange={setQuery} />
                </div>
              </div>

              {/* Results Section */}
              {(loading || results) && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-lg font-semibold text-slate-900">Query Results</h2>
                      {results?.success && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {results.rowCount} rows
                        </span>
                      )}
                    </div>
                    {results?.success && results.data && (
                      <button
                        onClick={exportResults}
                        className="inline-flex items-center px-3 py-1.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </button>
                    )}
                  </div>
                  <div className="p-6 overflow-hidden max-w-full">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <LoadingSpinner />
                      </div>
                    ) : results?.success ? (
                      <ResultsTable data={results.data || []} />
                    ) : results?.error ? (
                      <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-red-800">Query Error</h3>
                          <p className="text-sm text-red-700 mt-1">{results.error}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-full overflow-hidden">
              <ApiDocumentation />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

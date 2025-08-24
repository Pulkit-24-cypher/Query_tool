import React from 'react';
import { Code, Database, Server, FileText } from 'lucide-react';

const ApiDocumentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 mb-4">
          <Server className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">API Documentation</h1>
        </div>
        <p className="text-slate-600">
          Use these endpoints to programmatically access your database
        </p>
      </div>

      <div className="grid gap-6">
        {/* Health Check */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                GET
              </span>
              <code className="font-mono text-sm text-slate-900">/api/health</code>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600 mb-4">Check if the API server is running.</p>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Example Response:</h4>
              <pre className="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "status": "OK",
  "message": "API is running"
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Execute Query */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                POST
              </span>
              <code className="font-mono text-sm text-slate-900">/api/query</code>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-slate-600">Execute a SELECT query against the database.</p>
            
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Request Body:</h4>
              <pre className="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "query": "SELECT * FROM Incentive LIMIT 10"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium text-slate-900 mb-2">Example Response:</h4>
              <pre className="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Investment Incentive",
      "amount": 50000
    }
  ],
  "rowCount": 1,
  "query": "SELECT * FROM Incentive LIMIT 10"
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Get Tables */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                GET
              </span>
              <code className="font-mono text-sm text-slate-900">/api/tables</code>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600 mb-4">Get a list of all tables in the database.</p>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Example Response:</h4>
              <pre className="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "tables": ["Incentive", "Companies", "Regions"]
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Get Table Schema */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                GET
              </span>
              <code className="font-mono text-sm text-slate-900">/api/tables/:tableName/schema</code>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600 mb-4">Get the schema information for a specific table.</p>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Example Response:</h4>
              <pre className="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "table": "Incentive",
  "schema": [
    {
      "cid": 0,
      "name": "id",
      "type": "INTEGER",
      "notnull": 1,
      "dflt_value": null,
      "pk": 1
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Get Sample Data */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                GET
              </span>
              <code className="font-mono text-sm text-slate-900">/api/tables/:tableName/sample</code>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600 mb-4">Get sample data from a specific table (default: 10 rows).</p>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Query Parameters:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li><code className="bg-slate-100 px-2 py-0.5 rounded">limit</code> - Number of rows to return (optional)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <span>Usage Examples</span>
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-slate-900 mb-2">JavaScript/Node.js</h3>
            <pre className="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`// Execute a query
const response = await fetch('http://localhost:3001/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'SELECT * FROM Incentive LIMIT 10'
  })
});

const data = await response.json();
console.log(data);`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 mb-2">cURL</h3>
            <pre className="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST http://localhost:3001/api/query \\
  -H "Content-Type: application/json" \\
  -d '{"query": "SELECT * FROM Incentive LIMIT 10"}'`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-slate-900 mb-2">Python</h3>
            <pre className="bg-slate-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`import requests

response = requests.post('http://localhost:3001/api/query', 
                        json={'query': 'SELECT * FROM Incentive LIMIT 10'})
data = response.json()
print(data)`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
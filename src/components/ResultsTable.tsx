import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResultsTableProps {
  data: any[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>No data returned from the query.</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Table Container - Takes most of the space and scrolls */}
      <div className="flex-1 min-h-0 border border-slate-200 rounded-lg overflow-hidden bg-white">
        <div className="h-full overflow-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap border-r border-slate-200 last:border-r-0 min-w-[120px]"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {currentData.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                  {columns.map((column) => (
                    <td 
                      key={column} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 border-r border-slate-200 last:border-r-0 min-w-[120px] max-w-xs"
                    >
                      {row[column] === null ? (
                        <span className="text-slate-400 italic">NULL</span>
                      ) : (
                        <div className="truncate" title={String(row[column])}>
                          {String(row[column])}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls - Fixed at bottom */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4 flex-shrink-0 bg-white p-4 border border-slate-200 rounded-lg">
          <div className="text-sm text-slate-700">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors duration-150"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors duration-150"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;

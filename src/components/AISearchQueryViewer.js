import { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';


const AISearchQueryViewer = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/ai-search-queries`);
        setQueries(response.data.queries);
      } catch (error) {
        console.error('Error fetching AI search queries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  if (loading) return <p className="p-4 text-sm text-gray-600">Loading AI queries...</p>;
  if (!queries.length) return <p className="p-4 text-sm text-gray-600">No AI search queries yet.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">🧠 AI Search Query Logs</h2>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2">Time</th>
              <th className="p-2">User</th>
              <th className="p-2">Query</th>
              <th className="p-2">Filters</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2">{new Date(q.timestamp).toLocaleString()}</td>
                <td className="p-2">{q.userId || <em className="text-gray-400">Guest</em>}</td>
                <td className="p-2 text-blue-600">{q.rawQuery}</td>
                <td className="p-2 whitespace-pre-wrap font-mono text-xs text-gray-700">
                  {JSON.stringify(q.parsedFilters, null, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AISearchQueryViewer;


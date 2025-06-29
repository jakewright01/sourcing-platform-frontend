'use client';

// We have added 'use' to the import line here
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

function MatchList({ matches }) {
  if (!matches || matches.length === 0) {
    return <p className="text-center text-gray-500">No matches found for your request.</p>;
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div key={match.id || match.item_name} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-900">{match.item_name}</h3>
          <p className="text-gray-700 mt-2">{match.item_description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Price: £{(match.price || 0).toFixed(2)}</span>
            <span className="text-sm text-gray-500">Condition: {match.condition || 'N/A'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RequestResultsPage({ params }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // The error says params is a 'Promise'. We use the 'use()' hook to get the value.
  const resolvedParams = use(params);
  const requestId = resolvedParams.id;
  
  useEffect(() => {
    if (requestId) {
      const fetchMatches = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await fetch(`http://localhost:8000/requests/${requestId}/matches`);
          if (!response.ok) {
            throw new Error('Failed to fetch matches from the server.');
          }
          const data = await response.json();
          setMatches(data);
        } catch (err) {
          setError(err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMatches();
    }
  }, [requestId]);

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-500">Loading matched items...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    return <MatchList matches={matches} />;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24 bg-gray-100">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Sourcing Results</h1>
        <p className="text-sm text-gray-500 mb-8">
          Showing results for Request ID: <span className="font-mono bg-gray-200 p-1 rounded" suppressHydrationWarning={true}>{requestId}</span>
        </p>
        <div>
          {renderContent()}
        </div>
      </div>
    </main>
  );
} 
'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function MatchList({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No matches found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We couldn't find any matches for your request yet. Our AI is continuously searching for new items.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match, index) => (
        <div
          key={match.id || match.item_name || index}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {match.item_name}
              </h3>
              <div className="ml-2 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {match.condition || 'N/A'}
                </span>
              </div>
            </div>
            
            {match.item_description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {match.item_description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                £{(match.price || 0).toFixed(2)}
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Contact Seller
              </button>
            </div>
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
  const resolvedParams = use(params);
  const requestId = resolvedParams.id;

  useEffect(() => {
    if (requestId) {
      const fetchMatches = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/requests/${requestId}/matches`);
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
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Finding your perfect matches...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">Error loading matches</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }
    
    return <MatchList matches={matches} />;
  };

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Sourcing Results
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Request ID: <span className="font-mono bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded text-sm">{requestId}</span>
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl border border-white/20 dark:border-slate-700/50 p-8">
          {renderContent()}
        </div>

        {/* Additional Actions */}
        {!loading && !error && matches.length > 0 && (
          <div className="mt-8 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Need more options?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our AI continues to search for new matches. Check back later or refine your request.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Create New Request
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
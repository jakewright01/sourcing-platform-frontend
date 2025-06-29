'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const getUserAndRequests = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
          const response = await fetch(`${apiUrl}/me/requests`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` },
          });
          if (!response.ok) { throw new Error('Failed to fetch sourcing requests.'); }
          const data = await response.json();
          setRequests(data);
        } catch (fetchError) {
          setError(fetchError.message);
          console.error("Fetch error:", fetchError);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    };
    getUserAndRequests();
  }, [router]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };
  const viewMatches = (requestId) => {
    router.push(`/requests/${requestId}`);
  };
  if (loading) return <main className="flex min-h-screen items-center justify-center bg-zinc-900"><p className="text-white">Loading Dashboard...</p></main>;
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24 bg-zinc-900 text-white"><div className="w-full max-w-4xl"><div className="flex justify-between items-center mb-10"><div><h1 className="text-4xl font-bold tracking-tighter">Dashboard</h1>{user && <p className="text-sm text-zinc-400">Welcome back, {user.email}</p>}</div><button onClick={handleLogout} className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Log Out</button></div><div className="bg-black border border-zinc-800 rounded-2xl p-8"><h2 className="text-2xl font-semibold mb-6 text-white">Your Sourcing Requests</h2><div className="space-y-4">{error && <p className="text-red-500 text-center">{error}</p>}{!error && requests.length > 0 ? (requests.map((request) => (<div key={request.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex justify-between items-center transition-all hover:border-zinc-700"><div><p className="font-medium text-zinc-100">{request.request_description}</p><p className="text-sm text-zinc-400 capitalize">Status: {request.status}</p></div><button onClick={() => viewMatches(request.id)} className="bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-zinc-200 transition-colors">View Matches</button></div>))) : !error && (<div className="text-center py-8 px-4 border-2 border-dashed border-zinc-800 rounded-lg"><p className="text-zinc-400">You have not made any sourcing requests yet.</p><Link href="/" className="mt-4 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Make Your First Request</Link></div>)}</div></div></div></main>
  );
}
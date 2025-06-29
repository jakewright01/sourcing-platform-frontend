'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchAdminListings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.id !== process.env.NEXT_PUBLIC_ADMIN_USER_ID) {
      router.push('/login');
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/listings`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (response.status === 403) throw new Error('You are not authorized to view this page.');
      if (!response.ok) throw new Error('Failed to fetch listings.');
      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdminListings();
  }, []);
  const handleDelete = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/listings/${listingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error('Failed to delete listing.');
      fetchAdminListings();
    } catch (err) {
      setError(err.message);
    }
  };
  if (loading) return <main className="flex min-h-screen items-center justify-center bg-zinc-900"><p className="text-white">Loading Admin Listings...</p></main>;
  if (error) return <main className="flex min-h-screen items-center justify-center bg-zinc-900"><p className="text-red-500">{error}</p></main>;
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24 bg-zinc-900 text-white"><div className="w-full max-w-6xl"><div className="flex justify-between items-center mb-10"><h1 className="text-4xl font-bold tracking-tighter">Admin: All Listings</h1><Link href="/admin/add-listing" className="bg-white hover:bg-zinc-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors">+ Add New Listing</Link></div><div className="bg-black border border-zinc-800 rounded-2xl shadow-lg overflow-hidden"><table className="min-w-full"><thead className="bg-zinc-900"><tr><th scope="col" className="py-3 px-6 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Item Name</th><th scope="col" className="py-3 px-6 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Price</th><th scope="col" className="py-3 px-6 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Condition</th><th scope="col" className="relative py-3 px-6"><span className="sr-only">Actions</span></th></tr></thead><tbody className="bg-black divide-y divide-zinc-800">{listings.map((listing) => (<tr key={listing.id} className="hover:bg-zinc-900"><td className="py-4 px-6 whitespace-nowrap font-medium text-white">{listing.item_name}</td><td className="py-4 px-6 whitespace-nowrap text-zinc-300">£{(listing.price || 0).toFixed(2)}</td><td className="py-4 px-6 whitespace-nowrap text-zinc-300">{listing.condition}</td><td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium space-x-3"><Link href={`/admin/listings/${listing.id}/edit`} className="text-blue-400 hover:text-blue-300">Edit</Link><button onClick={() => handleDelete(listing.id)} className="text-red-500 hover:text-red-400">Delete</button></td></tr>))}</tbody></table></div></div></main>
  );
}
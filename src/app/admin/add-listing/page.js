'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddListingPage() {
  const [formData, setFormData] = useState({ item_name: '', item_description: '', price: 0, condition: 'New' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id !== process.env.NEXT_PUBLIC_ADMIN_USER_ID) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({...prevData, [name]: name === 'price' ? parseFloat(value) || 0 : value, }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);
    if (!formData.item_name || formData.price <= 0) {
      setMessage('Please fill in at least the item name and a valid price.');
      setIsError(true);
      setIsSubmitting(false);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ ...formData, source: 'internal' }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add listing');
      }
      const newListing = await response.json();
      setMessage(`Successfully added: ${newListing.item_name}. Add another?`);
      setFormData({ item_name: '', item_description: '', price: 0, condition: 'New' });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-zinc-900"><p className="text-white">Authorizing...</p></main>;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 bg-zinc-900 text-white"><div className="w-full max-w-2xl"><div className="flex justify-between items-center mb-10"><h1 className="text-4xl font-bold tracking-tighter">Add New Listing</h1><Link href="/admin/listings" className="text-sm text-zinc-400 hover:text-white">← Back to All Listings</Link></div><form onSubmit={handleSubmit} className="bg-black border border-zinc-800 rounded-2xl p-8 space-y-6"><div><label htmlFor="item_name" className="block text-sm font-medium mb-2 text-zinc-300">Item Name*</label><input type="text" id="item_name" name="item_name" value={formData.item_name} onChange={handleChange} className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" required /></div><div><label htmlFor="item_description" className="block text-sm font-medium mb-2 text-zinc-300">Description</label><textarea id="item_description" name="item_description" value={formData.item_description} onChange={handleChange} rows={4} className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" /></div><div><label htmlFor="price" className="block text-sm font-medium mb-2 text-zinc-300">Price* (£)</label><input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" required /></div><div><label htmlFor="condition" className="block text-sm font-medium mb-2 text-zinc-300">Condition</label><select id="condition" name="condition" value={formData.condition} onChange={handleChange} className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-white transition-all"><option>New</option><option>Used - Like New</option><option>Used - Good</option><option>Used - Fair</option></select></div><div><button type="submit" disabled={isSubmitting} className="w-full font-semibold py-3 px-4 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-300 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed cursor-pointer">{isSubmitting ? 'Submitting...' : 'Add Listing'}</button></div></form>{message && (<p className={`mt-6 text-center text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>)}</div></main>
  );
}
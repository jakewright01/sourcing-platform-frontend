'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient'; // Adjusted path for deeper folder
import Link from 'next/link';

export default function EditListingPage({ params }) {
  const router = useRouter();
  const listingId = params.id;
  
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    price: 0,
    condition: 'New',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (listingId) {
      const checkAdminAndFetchListing = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || session.user.id !== process.env.NEXT_PUBLIC_ADMIN_USER_ID) {
          router.push('/login');
          return;
        }

        try {
          const response = await fetch(`http://localhost:8000/listings/${listingId}`);
          if (!response.ok) throw new Error('Failed to fetch listing data.');
          const data = await response.json();
          setFormData({
            item_name: data.item_name || '',
            item_description: data.item_description || '',
            price: data.price || 0,
            condition: data.condition || 'New',
          });
        } catch (err) {
          setMessage(err.message);
          setIsError(true);
        } finally {
          setLoading(false);
        }
      };
      checkAdminAndFetchListing();
    }
  }, [listingId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Saving changes...');
    setIsError(false);

    const { data: { session } } = await supabase.auth.getSession();

    try {
      const response = await fetch(`http://localhost:8000/admin/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
            item_name: formData.item_name,
            item_description: formData.item_description,
            price: formData.price,
            condition: formData.condition,
            source: 'internal' // ensure source is included
        }),
      });

      if (!response.ok) throw new Error('Failed to save changes.');
      
      setMessage('Changes saved successfully! Redirecting...');
      setTimeout(() => router.push('/admin/listings'), 1500);

    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-zinc-900"><p className="text-white">Loading Listing...</p></main>;
  if (isError) return <main className="flex min-h-screen items-center justify-center bg-zinc-900"><p className="text-red-500">{message}</p></main>;

  return (
    // Applying the new dark theme
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 bg-zinc-900 text-white">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold tracking-tighter">Edit Listing</h1>
            <Link href="/admin/listings" className="text-sm text-zinc-400 hover:text-white">
                ← Back to All Listings
            </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-black border border-zinc-800 rounded-2xl p-8 space-y-6">
          <div>
            <label htmlFor="item_name" className="block text-sm font-medium mb-2 text-zinc-300">Item Name*</label>
            <input type="text" id="item_name" name="item_name" value={formData.item_name} onChange={handleChange} className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" required />
          </div>
          <div>
            <label htmlFor="item_description" className="block text-sm font-medium mb-2 text-zinc-300">Description</label>
            <textarea id="item_description" name="item_description" value={formData.item_description} onChange={handleChange} rows={4} className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2 text-zinc-300">Price* (£)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" required />
          </div>
          <div>
            <label htmlFor="condition" className="block text-sm font-medium mb-2 text-zinc-300">Condition</label>
            <select id="condition" name="condition" value={formData.condition} onChange={handleChange} className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-white transition-all">
              <option>New</option>
              <option>Used - Like New</option>
              <option>Used - Good</option>
              <option>Used - Fair</option>
            </select>
          </div>
          <div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-semibold py-3 px-4 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-300 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
        {message && (<p className={`mt-6 text-center text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>)}
      </div>
    </main>
  );
}
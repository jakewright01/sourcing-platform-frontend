'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';
import Link from 'next/link';

export default function EditListingPage({ params }) {
  const router = useRouter();
  const [listingId, setListingId] = useState(null);
  const [formData, setFormData] = useState({ 
    item_name: '', 
    item_description: '', 
    price: 0, 
    condition: 'New' 
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Handle params in useEffect to avoid the workStore error
  useEffect(() => {
    if (params?.id) {
      setListingId(params.id);
    }
  }, [params]);

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
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
          const response = await fetch(`${apiUrl}/listings/${listingId}`);
          if (!response.ok) throw new Error('Failed to fetch listing data.');
          const data = await response.json();
          setFormData({ 
            item_name: data.item_name || '', 
            item_description: data.item_description || '', 
            price: data.price || 0, 
            condition: data.condition || 'New' 
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
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Saving changes...');
    setIsError(false);
    
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/admin/listings/${listingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ ...formData, source: 'internal' }),
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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading listing...</p>
        </div>
      </main>
    );
  }

  if (isError && !formData.item_name) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-2xl text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">Error loading listing</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/admin/listings"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Listings
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Listing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update the listing information
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-white/20 dark:border-slate-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="item_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                id="item_name"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter item name"
                required
              />
            </div>

            <div>
              <label htmlFor="item_description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="item_description"
                name="item_description"
                value={formData.item_description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe the item in detail..."
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Price * (£)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">£</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option>New</option>
                <option>Used - Like New</option>
                <option>Used - Good</option>
                <option>Used - Fair</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-2xl text-center font-medium ${
              isError 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
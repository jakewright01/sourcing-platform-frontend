'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function HomePage() {
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    getSession();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('Submitting your request...');

    const requestData = {
      buyer_id: user ? user.id : 'anonymous_request',
      request_description: description,
      budget: Number(budget) || 0,
    };

    try {
      // IMPORTANT: This must be your CORRECT deployed backend URL
      const response = await fetch('https://sourcing-platform-api-jake.onrender.com/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setStatusMessage('Success! Your request has been submitted.');
        setDescription('');
        setBudget('');
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.detail || 'Something went wrong.'}`);
      }
    } catch (error) {
      setStatusMessage('Network error. Is the backend server running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // New, more subtle dark background for a premium feel
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-zinc-900">
      <div className="w-full max-w-md">

        {/* The form container now has more refined styling */}
        <div className="bg-black border border-zinc-800 rounded-2xl p-8 sm:p-10 space-y-8">

          {/* Section for the title and description */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tighter">
              Source Any Item.
            </h1>
            {/* CORRECTED LINE 68 */}
            <p className="mt-3 text-zinc-400">
              Describe what you&apos;re looking for. We&apos;ll handle the rest.
            </p>
          </div>

          {/* Form with more generous spacing */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2 text-zinc-400">
                Item Description
              </label>
              <textarea
                id="description"
                placeholder="e.g., A vintage Barbour jacket, size medium..."
                className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium mb-2 text-zinc-400">
                Your Budget (£)
              </label>
              <input
                type="number"
                id="budget"
                placeholder="150"
                className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div>
              {/* Premium, solid button style */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-semibold py-3 px-4 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-300 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Sourcing Request'}
              </button>
            </div>

            {statusMessage && <p className="text-center text-zinc-400 pt-2">{statusMessage}</p>}
          </form>
        </div>

      </div>
    </main>
  );
}
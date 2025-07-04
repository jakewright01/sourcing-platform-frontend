'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

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
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/requests`, {
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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/5 via-stone-900/5 to-amber-900/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-50 to-stone-50 dark:from-amber-900/20 dark:to-stone-900/20 text-amber-800 dark:text-amber-200 text-sm font-light tracking-wide mb-8 border border-amber-200/50 dark:border-amber-700/30">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></span>
              Luxury Sourcing Concierge
            </div>
            
            <h1 className="text-5xl md:text-7xl luxury-heading mb-8">
              <span className="text-luxury-gold">
                Curated
              </span>
              <br />
              <span className="text-neutral-900 dark:text-white font-light">Sourcing</span>
            </h1>
            
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-light">
              Your personal concierge for discovering rare fashion, exclusive collectibles, and luxury items. 
              We source what others cannot find.
            </p>
          </div>

          {/* Request Form */}
          <div className="max-w-2xl mx-auto">
            <div className="luxury-glass dark:luxury-glass-dark rounded-3xl shadow-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="description" className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-4 tracking-wide">
                    What are you looking for?
                  </label>
                  <textarea
                    id="description"
                    placeholder="e.g., A vintage Hermès Kelly bag in black box leather, or a 1960s Rolex Submariner..."
                    className="w-full p-5 luxury-input dark:luxury-input-dark rounded-2xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none font-light"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-4 tracking-wide">
                    Your Budget (£)
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-neutral-400 font-light">£</span>
                    <input
                      type="number"
                      id="budget"
                      placeholder="5,000"
                      className="w-full pl-10 pr-5 py-5 luxury-input dark:luxury-input-dark rounded-2xl text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all font-light"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-luxury bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-black hover:to-neutral-900 text-white font-light py-5 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-amber-400 rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                {statusMessage && (
                  <div className={`p-4 rounded-2xl text-center font-medium ${
                    statusMessage.includes('Success') 
                      ? 'status-luxury dark:status-luxury-dark' 
                      : statusMessage.includes('Error')
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                      : 'status-luxury dark:status-luxury-dark'
                  }`}>
                    {statusMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-stone-50/50 to-neutral-50/50 dark:from-neutral-900/50 dark:to-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl luxury-heading text-neutral-900 dark:text-white mb-6">
              The SourceMe Experience
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto font-light">
              Sophisticated sourcing for discerning collectors and fashion enthusiasts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-luxury-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-neutral-900 dark:text-white mb-3 tracking-wide">Articulate Your Desire</h3>
              <p className="text-neutral-600 dark:text-neutral-300 font-light">Share your vision with our expert curators who understand luxury and rarity</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-neutral-900 dark:text-white mb-3 tracking-wide">Expert Curation</h3>
              <p className="text-neutral-600 dark:text-neutral-300 font-light">Our network of specialists and AI technology locate exceptional pieces worldwide</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-stone-600 to-stone-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-neutral-900 dark:text-white mb-3 tracking-wide">Exclusive Access</h3>
              <p className="text-neutral-600 dark:text-neutral-300 font-light">Receive personally vetted selections from trusted dealers and private collections</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-luxury rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-stone-500/10"></div>
              <div className="relative">
                <h2 className="text-3xl md:text-4xl luxury-heading mb-6">
                  Begin Your Search
                </h2>
                <p className="text-xl mb-8 text-neutral-200 font-light">
                  Join our exclusive community of collectors and connoisseurs
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="bg-white text-neutral-900 font-light py-4 px-8 rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl tracking-wide"
                  >
                    Join SourceMe
                  </Link>
                  <Link
                    href="/login"
                    className="border-2 border-white text-white font-light py-4 px-8 rounded-2xl hover:bg-white hover:text-neutral-900 transition-all transform hover:-translate-y-1 tracking-wide"
                  >
                    Member Access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of users who trust SourceMe for their sourcing needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-2xl hover:bg-gray-100 transition-colours"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-white text-white font-semibold py-3 px-8 rounded-2xl hover:bg-white hover:text-blue-600 transition-colours"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
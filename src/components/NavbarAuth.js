'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavbarAuth() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
  };

  const isAdmin = user && user.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID;

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAdmin && (
            <Link 
              href="/admin/listings" 
              className="px-4 py-2 text-sm font-light text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors tracking-wide"
            >
              Admin
            </Link>
          )}
          <Link 
            href="/dashboard" 
            className="px-4 py-2 text-sm font-light text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors tracking-wide"
          >
            Dashboard
          </Link>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 text-sm font-light text-white bg-neutral-800 hover:bg-black rounded-lg transition-colors tracking-wide"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 luxury-glass dark:luxury-glass-dark rounded-lg shadow-lg py-2 z-50">
              {isAdmin && (
                <Link 
                  href="/admin/listings" 
                  className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-light tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link 
                href="/dashboard" 
                className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-light tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-4 py-2 text-sm text-neutral-800 dark:text-neutral-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 font-light tracking-wide"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Link 
        href="/login" 
        className="px-4 py-2 text-sm font-light text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors tracking-wide"
      >
        Sign In
      </Link>
      <Link 
        href="/signup" 
        className="px-5 py-2 text-sm font-light text-white bg-gradient-luxury-gold hover:bg-gradient-to-r hover:from-amber-600 hover:to-yellow-600 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl tracking-wide"
      >
        Join
      </Link>
    </div>
  );
}
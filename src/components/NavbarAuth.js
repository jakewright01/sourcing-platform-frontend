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
              className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Admin
            </Link>
          )}
          <Link 
            href="/seller/dashboard" 
            className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Sell
          </Link>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Dashboard
          </Link>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              {isAdmin && (
                <Link 
                  href="/admin/listings" 
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link 
                href="/seller/dashboard" 
                className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell
              </Link>
              <Link 
                href="/dashboard" 
                className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        Sign In
      </Link>
      <Link 
        href="/signup" 
        className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors"
      >
        Get Started
      </Link>
    </div>
  );
}
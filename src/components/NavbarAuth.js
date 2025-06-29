'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavbarAuth() {
  const [user, setUser] = useState(null);
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
    router.push('/login');
    router.refresh(); 
  };

  // --- NEW LOGIC ---
  // We check if the logged-in user's ID matches the admin ID from our environment file.
  const isAdmin = user && user.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID;

  // If a user is logged in, show their options
  if (user) {
    return (
      <div className="flex items-center space-x-3">
        {/* This link will ONLY show if the logged in user is the admin */}
        {isAdmin && (
          <Link href="/admin/listings" className="py-2 px-3 font-medium text-gray-500 rounded hover:bg-gray-100 transition duration-300">
            Admin
          </Link>
        )}
        <Link href="/dashboard" className="py-2 px-3 font-medium text-gray-500 rounded hover:bg-gray-100 transition duration-300">
          Dashboard
        </Link>
        <button onClick={handleLogout} className="py-2 px-3 font-medium text-white bg-red-500 rounded hover:bg-red-600 transition duration-300">
          Log Out
        </button>
      </div>
    );
  }

  // If no user is logged in, show the public options
  return (
    <div className="flex items-center space-x-3">
      <Link href="/login" className="py-2 px-3 font-medium text-gray-500 rounded hover:bg-gray-100 transition duration-300">Log In</Link>
      <Link href="/signup" className="py-2 px-3 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300">Sign Up</Link>
    </div>
  );
}
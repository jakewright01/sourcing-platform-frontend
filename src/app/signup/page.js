'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) {
          throw error;
        }

        setMessage('Success! Please check your email to confirm your signup.');
        setEmail('');
        setPassword('');

    } catch (error) {
        setMessage(error.message);
        setIsError(true);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    // Matching the new dark theme
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-zinc-900">
      <div className="w-full max-w-md">

        <div className="bg-black border border-zinc-800 rounded-2xl p-8 sm:p-10 space-y-8">
          
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tighter">
              Create Your Account
            </h1>
            <p className="mt-3 text-zinc-400">
              Get started with your personal sourcing concierge.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-zinc-400">Email Address</label>
              <input
                type="email" id="email" name="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" 
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-zinc-400">Password</label>
              <input
                type="password" id="password" name="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-all" 
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-semibold py-3 px-4 bg-white text-black rounded-lg hover:bg-zinc-200 transition-all duration-300 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
          
          {message && (<p className={`text-center pt-4 text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>)}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-white hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}
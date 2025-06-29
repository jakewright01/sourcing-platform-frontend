'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      // IMPORTANT: This must be your CORRECT deployed backend URL
      const response = await fetch('https://sourcing-platform-api-jake.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const sessionData = await response.json();

      if (!response.ok) {
        throw new Error(sessionData.detail || 'Login failed.');
      }

      const { error: sessionError } = await supabase.auth.setSession(sessionData);
      if (sessionError) {
        throw sessionError;
      }

      setMessage('Login successful! Redirecting...');
      router.push('/dashboard');

    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-zinc-900">
      <div className="w-full max-w-md">

        <div className="bg-black border border-zinc-800 rounded-2xl p-8 sm:p-10 space-y-8">

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tighter">
              Welcome Back
            </h1>
            <p className="mt-3 text-zinc-400">
              Sign in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          {message && (<p className={`text-center pt-4 text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>)}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Don&apos;t have an account?{' '} {/* CORRECTED LINE 101 */}
          <Link href="/signup" className="font-semibold text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.warn('Supabase environment variables are not properly configured. Please update your .env.local file with actual Supabase credentials.');
  // Create a dummy client to prevent build errors
  export const supabase = {
    auth: {
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured. Please update your environment variables.')),
      signUp: () => Promise.reject(new Error('Supabase not configured. Please update your environment variables.')),
      signOut: () => Promise.reject(new Error('Supabase not configured. Please update your environment variables.')),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => Promise.reject(new Error('Supabase not configured. Please update your environment variables.')),
      insert: () => Promise.reject(new Error('Supabase not configured. Please update your environment variables.')),
      update: () => Promise.reject(new Error('Supabase not configured. Please update your environment variables.')),
      delete: () => Promise.reject(new Error('Supabase not configured. Please update your environment variables.'))
    })
  };
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}
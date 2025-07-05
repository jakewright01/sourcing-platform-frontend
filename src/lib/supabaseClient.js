import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isValidConfig = supabaseUrl && 
                     supabaseAnonKey && 
                     !supabaseUrl.includes('placeholder') && 
                     !supabaseAnonKey.includes('placeholder') &&
                     supabaseUrl !== 'your-supabase-url' &&
                     supabaseAnonKey !== 'your-supabase-anon-key';

let supabase;

if (!isValidConfig) {
  console.warn('Supabase environment variables are not properly configured. Using demo mode.');
  
  // Create a safe demo client that won't cause build errors
  supabase = {
    auth: {
      signInWithPassword: async () => {
        throw new Error('Demo mode: Please configure Supabase credentials');
      },
      signUp: async () => {
        throw new Error('Demo mode: Please configure Supabase credentials');
      },
      signOut: async () => {
        return { error: null };
      },
      getSession: async () => {
        return { data: { session: null }, error: null };
      },
      onAuthStateChange: () => {
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            } 
          } 
        };
      }
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
      eq: function() { return this; },
      order: function() { return this; },
      single: function() { return this; }
    })
  };
} else {
  // Create real Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
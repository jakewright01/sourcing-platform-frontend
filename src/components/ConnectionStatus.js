'use client';

import { useState, useEffect } from 'react';

export default function ConnectionStatus() {
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const isDemoMode = !supabaseUrl || 
                      !supabaseAnonKey || 
                      supabaseUrl.includes('placeholder') || 
                      supabaseAnonKey.includes('placeholder') ||
                      supabaseUrl === 'your-supabase-url' ||
                      supabaseAnonKey === 'your-supabase-anon-key';
    
    setShowStatus(isDemoMode);
  }, []);

  if (!showStatus) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <div className="bg-blue-500 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Demo Mode - Showcasing platform features with sample data</span>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    const checkApiStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${apiUrl}/health`, { 
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        setApiStatus('offline');
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      checkApiStatus();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setApiStatus('offline');
    };

    // Set initial status
    setIsOnline(navigator.onLine);
    checkApiStatus();

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check API status periodically
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds

    // Show status after initial check
    setTimeout(() => setShowStatus(true), 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Don't show anything if everything is working or we haven't checked yet
  if (!showStatus || (isOnline && apiStatus === 'online')) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <div className="bg-blue-500 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {!isOnline 
              ? 'You\'re offline - using demo data' 
              : 'Server temporarily unavailable - using demo data'
            }
          </span>
        </div>
      </div>
    </div>
  );
}
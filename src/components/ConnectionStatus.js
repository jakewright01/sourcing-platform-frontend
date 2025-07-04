'use client';

import { useState, useEffect } from 'react';

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    const checkApiStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/health`, { 
          method: 'GET',
          timeout: 5000 
        });
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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Don't show anything if everything is working
  if (isOnline && apiStatus === 'online') return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>
            {!isOnline 
              ? 'You\'re offline - some features may not work' 
              : 'Server temporarily unavailable - using demo data'
            }
          </span>
        </div>
      </div>
    </div>
  );
}
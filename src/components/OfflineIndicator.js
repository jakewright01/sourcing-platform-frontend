'use client';

import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending requests
    const checkPendingRequests = () => {
      try {
        const pending = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
        setPendingRequests(pending.length);
      } catch (error) {
        console.error('Error checking pending requests:', error);
      }
    };

    checkPendingRequests();
    const interval = setInterval(checkPendingRequests, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && pendingRequests === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">You're offline</span>
          </div>
        </div>
      )}
      
      {pendingRequests > 0 && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {pendingRequests} request{pendingRequests > 1 ? 's' : ''} pending sync
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
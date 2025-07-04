'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      // Try to sync pending requests when back online
      setTimeout(() => {
        apiClient.syncPendingRequests();
      }, 1000);
    };
    const handleOffline = () => setIsOnline(false);

    // Set initial online status
    setIsOnline(navigator.onLine);

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
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg mb-2 animate-pulse">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
            </svg>
            <span className="text-sm font-medium">You're offline</span>
          </div>
          <p className="text-xs mt-1 opacity-90">Requests will be saved locally</p>
        </div>
      )}
      
      {pendingRequests > 0 && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">
              {pendingRequests} request{pendingRequests > 1 ? 's' : ''} pending sync
            </span>
          </div>
          <p className="text-xs mt-1 opacity-90">Will sync when server is available</p>
        </div>
      )}
    </div>
  );
}
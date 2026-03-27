import { useEffect, useRef } from 'react';

interface UseInactivityTimeoutOptions {
  timeoutMinutes: number;
  onTimeout: () => void;
  isActive: boolean;
}

export function useInactivityTimeout({ timeoutMinutes, onTimeout, isActive }: UseInactivityTimeoutOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onTimeout();
      }, timeoutMinutes * 60 * 1000);
    };

    // Events to track user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    const handleActivity = () => {
      resetTimeout();
    };

    // Set initial timeout
    resetTimeout();

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [timeoutMinutes, onTimeout, isActive]);
}

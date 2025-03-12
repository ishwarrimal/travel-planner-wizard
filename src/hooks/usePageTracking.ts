import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent, getAnalytics } from 'firebase/analytics';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const analytics = getAnalytics();
    logEvent(analytics, 'page_view', {
      page_path: location.pathname,
      page_title: document.title,
    });
  }, [location]);
}; 
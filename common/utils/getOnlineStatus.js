import React from 'react';

/**
 * Get the online status from the
 * NavigatorOnLine web API
 * @return {boolean}
 */
export const getOnlineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;

/**
 * Returns online state
 * @return {boolean}
 */
export const useNavigatorOnline = () => {
  const [status, setStatus] = React.useState(getOnlineStatus());

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  // add listeners for appropriate events,
  // updating state, and cleanup those
  // listeners when unmounting
  React.useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return status;
};

import { useState, useEffect } from 'react';
import Router from 'next/router';
import features from '../../../config/features';

export interface SessionResult {
  userId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

// eslint-disable-next-line
export default function useSession(firebase): SessionResult {
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onAuthUpdate = (user) => {
    if (user) {
      setIsAuthenticated(true);
      if (user.uid) setUserId(user.uid);
    }

    setIsLoading(false);
  };

  // Terminate session
  // and redirect to login
  const signOut = () => {
    if (features.supportBetaLogin) {
      Router.push('/login');
    } else {
      window.location.href = '/login';
    }

    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUserId('');
        setIsAuthenticated(false);
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(onAuthUpdate);
    return () => unsubscribe();
  }, [firebase]);

  return {
    userId,
    isAuthenticated,
    isLoading,
    signOut
  };
}

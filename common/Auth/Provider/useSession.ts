import { useState, useEffect } from 'react';
import Router from 'next/router';
import getConfig from 'next/config';
import features from '../../../config/features';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

export interface SessionResult {
  userId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (...string) => Promise<void>; // eslint-disable-line
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

  // Create new user session from password
  // and to to initial page: /properties
  const signInWithEmail = (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        onAuthUpdate(response.user);
        // Forcing a page reload page allows
        // us to use reactFire auth utilites
        window.location.href = `${basePath}/properties`;
      });
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
    signInWithEmail,
    signOut
  };
}

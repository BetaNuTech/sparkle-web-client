import { useState, useEffect } from 'react';
import Router from 'next/router';
import { firebase } from '../../common/utils/connectFirebase';

const formatUser = async (user) => {
  const token = await user.getIdToken();

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    token
  };
};

export function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const formattedUser = await formatUser(rawUser);
      setUser(formattedUser);
      setLoadingStatus(false);
      return formattedUser;
    }

    setUser(false);
    setLoadingStatus(false);

    return false;
  };

  const signInWithEmail = async ({ email, password }) => {
    setLoadingStatus(true);

    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        handleUser(response.user);
        Router.push('/properties');
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  const signOut = () => {
    Router.push('/jobs/login');

    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false))
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(error);
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser);
    return () => unsubscribe();
  }, []);

  return {
    isAuthenticated: !!user,
    user,
    loadingStatus,
    signInWithEmail,
    signOut
  };
}

import { useState, useEffect } from "react";
import cookie from 'js-cookie';
import Router from 'next/router';
import { firebase } from '../../utils/connectFirebase';
import { AuthApi } from '../../api/AuthApi';

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
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;

      AuthApi.createUser(user.uid, userWithoutToken);
      setUser(user);

      cookie.set('firebase-auth', true, {
        expires: 1
      });

      setLoadingStatus(false);
      return user;
    }

    setUser(false);
    cookie.remove('firebase-auth');
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
        console.log(user);
        Router.push('/profile');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signOut = () => {
    Router.push('/jobs/login');

    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };

  useEffect(async () => {
    const unsubscribe = firebase.auth().onIdTokenChanged(handleUser);

    return () => unsubscribe();
  }, []);

  return ({
    isAuthenticated: !!user,
    user,
    loadingStatus,
    signInWithEmail,
    signOut
  });
}

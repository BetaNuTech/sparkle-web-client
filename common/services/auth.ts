import ErrorBadRequest from '../models/errors/badRequest';
import firebase from '../utils/initFirebase';

const PREFIX = 'services: auth';

const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<firebase.auth.UserCredential> => {
  try {
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    if (err.code === 'auth/wrong-password') {
      return Promise.reject(
        new ErrorBadRequest(
          `${PREFIX} signInWithEmailAndPassword: auth/wrong-password`
        )
      );
    }
    return Promise.reject(
      new Error(`${PREFIX} signInWithEmailAndPassword: ${err.code}`)
    );
  }
};

export default {
  signInWithEmailAndPassword
};

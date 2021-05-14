import { firestore } from '../utils/connectFirebase';

export const AuthApi = {
  createUser(uid, data) {
    return firestore
      .collection('users')
      .doc(uid)
      .set({ uid, ...data }, { merge: true });
  },
};

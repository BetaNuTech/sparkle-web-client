import firebase from 'firebase/app';
import UserModel from '../models/user';
import userApi, { UserDocumentResult } from '../services/firestore/users';

// User lookup Firestore document by their ID
export default function useFirestoreUser(
  firestore: firebase.firestore.Firestore,
  userId?: string
): UserDocumentResult {
  if (userId === 'new') {
    return { status: 'success', error: null, data: { id: 'new' } as UserModel };
  }
  if (!userId) {
    return { status: 'loading', error: null, data: null };
  }

  return userApi.findRecord(firestore, userId);
}

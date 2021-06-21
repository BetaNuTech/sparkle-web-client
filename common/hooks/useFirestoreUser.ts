import userApi, { userDocumentResult } from '../services/firestore/users';

// User lookup Firestore document by their ID
export default function useFirestoreUser(userId?: string): userDocumentResult {
  if (!userId) {
    return { status: 'loading', error: null, data: null };
  }

  return userApi.findRecord(userId);
}

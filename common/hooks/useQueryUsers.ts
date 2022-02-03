import firebase from 'firebase/app';
import userApi, { userCollectionResult } from '../services/firestore/users';

// Query users  by their IDs
export default function useQueryUsers(
  firestore: firebase.firestore.Firestore,
  ids?: string[]
): userCollectionResult {
  return userApi.query(firestore, ids);
}

import firebase from 'firebase/app';
import userApi, { UserCollectionResult } from '../services/firestore/users';

// Query users  by their IDs
export default function useQueryUsers(
  firestore: firebase.firestore.Firestore,
  ids?: string[]
): UserCollectionResult {
  return userApi.query(firestore, ids);
}

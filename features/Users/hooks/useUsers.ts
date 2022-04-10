import firebase from 'firebase/app';
import userApi, {
  UserCollectionResult
} from '../../../common/services/firestore/users';

export default function useUsers(
  firestore: firebase.firestore.Firestore
): UserCollectionResult {
  return userApi.findAll(firestore);
}

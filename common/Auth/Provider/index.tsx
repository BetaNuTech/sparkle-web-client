import { useContext, createContext } from 'react';
import useSession, { SessionResult } from './useSession';
import firebase from '../../utils/initFirebase';

const AuthContext = createContext({});

/* eslint-disable */
const Provider = ({ children }) => {
  const auth = useSession(firebase);
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
/* eslint-enable */

export default Provider;

// Export auth/session context hook
export const useAuth = (): SessionResult =>
  useContext(AuthContext) as SessionResult;

import ErrorBadRequest from '../models/errors/badRequest';
import ErrorForbidden from '../models/errors/forbidden';
import firebase from '../utils/initFirebase';
import fbCollections from '../../config/collections';

const PREFIX = 'services: auth';

// Codes Firebase raises when the user simply dismissed the Google popup, or
// opened a second one. Not failures: the person changed their mind, and a
// toast telling them so is noise.
const CANCELLED_POPUP_CODES = [
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled'
];

// Firebase reports a blocking function's HttpsError as a generic
// "auth/internal-error" and buries the message we actually threw in a JSON
// payload inside err.message, shaped roughly like:
//
//   BLOCKING_FUNCTION_ERROR_RESPONSE : HTTP Cloud Function returned an error:
//   {"error":{"message":"That Google account is not set up...","status":"..."}}
//
// Without digging it back out the user sees "an internal error has occurred"
// instead of the refusal the auth gate wrote for them.
const BLOCKING_FUNCTION_MARKER = 'BLOCKING_FUNCTION_ERROR_RESPONSE';

// Shown when Firebase refuses to create an account for the Google identity.
// Sparkle is invite-only, so this is the expected outcome for anyone an
// administrator has not already added.
export const REFUSAL_NOT_SET_UP =
  'That Google account is not set up in Sparkle. Please ask an administrator to add you.';

interface MaybeAuthError {
  code?: string;
  message?: string;
}

export const readBlockingFunctionMessage = (
  err?: MaybeAuthError | null
): string => {
  const raw = `${(err && err.message) || ''}`;
  const markerAt = raw.indexOf(BLOCKING_FUNCTION_MARKER);
  if (markerAt === -1) return '';

  // Identity Platform nests the function's response inside the outer error as
  // escaped JSON, so the key arrives as \"message\" rather than "message".
  // Unescape first so one pattern matches both the nested and flat shapes.
  const tail = raw.slice(markerAt).replace(/\\"/g, '"');

  // The first "message" past the marker is the one the auth gate threw
  const match = tail.match(/"message"\s*:\s*"([^"]*)"/);
  if (!match) return '';

  return match[1].trim();
};

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

/**
 * Sign in with Google.
 * Resolves null when the user dismissed the popup without choosing an account.
 * Rejects with ErrorForbidden carrying the auth gate's refusal copy when the
 * account is not set up in Sparkle.
 */
const signInWithGoogle =
  async (): Promise<firebase.auth.UserCredential | null> => {
    const provider = new firebase.auth.GoogleAuthProvider();
    // Always let the user pick, rather than silently reusing whichever Google
    // account the browser happens to be signed into
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      return await firebase.auth().signInWithPopup(provider);
    } catch (err) {
      if (CANCELLED_POPUP_CODES.includes(err.code)) {
        return null;
      }

      // Firebase refuses any origin missing from Authentication → Settings →
      // Authorized domains. This is a configuration problem, not a user error,
      // but the user can act on it: authDomain is the canonical host, so send
      // them there. Reading it from config keeps the message from going stale.
      if (err.code === 'auth/unauthorized-domain') {
        // Firebase 8 types app().options as a bare Object, so the field has
        // to be narrowed before it can be read.
        const { authDomain } = firebase.app().options as {
          authDomain?: string;
        };
        const canonical = authDomain || '';
        return Promise.reject(
          new ErrorForbidden(
            canonical
              ? 'Google sign in is not available at this web address. ' +
                `Please go to https://${canonical} and sign in there.`
              : 'Google sign in is not available at this web address. Please contact an administrator.'
          )
        );
      }

      // Raised when "Enable create (sign-up)" is off in Firebase's user
      // action settings, which is how Sparkle stays invite-only: Firebase
      // refuses to create an account for a Google identity that does not
      // already have one. The Admin SDK, which POST /v0/users uses, is exempt.
      if (err.code === 'auth/admin-restricted-operation') {
        return Promise.reject(new ErrorForbidden(REFUSAL_NOT_SET_UP));
      }

      // Same refusal by a different route, if an auth gate blocking function
      // is ever deployed alongside the setting above
      const refusal = readBlockingFunctionMessage(err);
      if (refusal) {
        return Promise.reject(new ErrorForbidden(refusal));
      }

      if (err.code === 'auth/popup-blocked') {
        return Promise.reject(
          new ErrorBadRequest(`${PREFIX} signInWithGoogle: auth/popup-blocked`)
        );
      }

      // Anything unmapped reaches the user as a generic "please try again",
      // which tells whoever has to debug it nothing at all. Put the real code
      // somewhere it can be read.
      // eslint-disable-next-line no-console
      console.error(`${PREFIX} signInWithGoogle:`, err.code, err.message);

      return Promise.reject(
        new Error(`${PREFIX} signInWithGoogle: ${err.code}`)
      );
    }
  };

/**
 * Does this authenticated user have a Sparkle user record?
 *
 * The auth gate blocking function is the real defense, and the Firestore rules
 * are the second. This is a third check that exists only to turn a broken
 * session into a clear message: an auth account can exist without a user
 * record if one was created by hand in the Firebase console, or left behind by
 * a partial failure predating the ordering fix in POST /v0/users.
 */
const hasUserRecord = async (userId: string): Promise<boolean> => {
  // Loaded on demand. Firestore is a large chunk and the login page is the one
  // page in the app that otherwise never needs it.
  await import('firebase/firestore');

  try {
    const doc = await firebase
      .firestore()
      .collection(fbCollections.users)
      .doc(userId)
      .get();
    return doc.exists;
  } catch (err) {
    // Rules deny reads to anyone without a user record, so this is the same
    // answer as a missing document
    if (err.code === 'permission-denied') return false;

    // Anything else -- offline, transient -- is not evidence of anything. Fail
    // open rather than signing out a legitimate user over a network blip; the
    // two server side gates still hold.
    return true;
  }
};

/**
 * Terminate the current session.
 * Used to back out of a sign in that authenticated to Google successfully but
 * turned out not to belong to a Sparkle user.
 */
const signOut = async (): Promise<void> => {
  try {
    return await firebase.auth().signOut();
  } catch (err) {
    return Promise.reject(new Error(`${PREFIX} signOut: ${err.code}`));
  }
};

const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    return await firebase.auth().sendPasswordResetEmail(email);
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      return Promise.reject(
        new ErrorBadRequest(
          `${PREFIX} sendPasswordResetEmail: auth/user-not-found`
        )
      );
    }
    return Promise.reject(
      new Error(`${PREFIX} sendPasswordResetEmail: ${err.code}`)
    );
  }
};

export default {
  signInWithEmailAndPassword,
  signInWithGoogle,
  hasUserRecord,
  signOut,
  sendPasswordResetEmail
};

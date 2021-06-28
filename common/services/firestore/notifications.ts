import firebase from 'firebase/app';
import errorReports from '../api/errorReports';
import currentUser from '../../utils/currentUser';
import { userAgent } from '../../utils/browserSniffer';
import notificationModel from '../../models/notification';

const PREFIX = 'services: api: globalNotifications:';
const COLLECTION_NAME = 'notifications';
const IS_STAGING: boolean = process.env.NEXT_PUBLIC_STAGING === 'true';

// Is incognito model enabled
// True: prevent all notifications
// False: default behavior
let isIncognitoMode = false;
// eslint-disable-next-line
export const setIncognitoMode = (update): boolean =>
  (isIncognitoMode = Boolean(update));

// Write a global notification
export const send = async (
  firestore: firebase.firestore.Firestore | any, // any for testing purposes
  query: notificationModel,
  isStaging = IS_STAGING // for testing purposes
): Promise<notificationModel> => {
  const notification = JSON.parse(JSON.stringify(query)); // Clone

  // Set notification's creator from args or fb auth
  const creator = query.creator || currentUser.getId() || ''; // eslint-disable-line
  if (!creator) {
    throw Error(`${PREFIX} send: invoked without user session`);
  }
  notification.creator = creator;

  // Abandon when in incognito mode
  if (isIncognitoMode) {
    return Promise.resolve(notification);
  }

  // Prepend staging title prefix
  if (isStaging) {
    notification.title = `[STAGING] ${notification.title || ''}`;
  }

  // Add Optional User Agent
  try {
    notification.userAgent = userAgent;
  } catch (err) {} // eslint-disable-line no-empty

  // Write notification to Firestore
  return firestore
    .collection(COLLECTION_NAME)
    .add(notification)
    .then(() => notification)
    .catch((err) => {
      const wrappedErr = Error(
        `${PREFIX} send: failed to add firestore notification "${notification.title}": ${err}`
      );

      /* eslint-disable */
      console.error(wrappedErr);
      errorReports.send(wrappedErr);
      /* eslint-enable */

      return Promise.reject(wrappedErr);
    });
};

export default { send, setIncognitoMode };

import assert from 'assert';
import platform from 'platform';
import getConfig from 'next/config';
import { firebase } from '../../common/utils/connectFirebase';

const PREFIX = 'services: api: errorReports:';
const { publicRuntimeConfig } = getConfig();
const APP_VERSION = publicRuntimeConfig.appVersion;

/**
 * POST an Error Report request
 * @param  {String} authToken
 * @param  {Error} err
 * @return {Promise}
 */
const postRequest = (authToken, err) => {
  assert(authToken && typeof authToken === 'string', 'has auth token');
  assert(err instanceof Error, 'has error instance');

  const os = platform.os.family;
  const browser = platform.name;

  return fetch(
    `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN}/api/v0/clients/errors`,
    {
      method: 'POST',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `${err}`,
        userAgent: `Web Client${os && ' · '}${os}${
          browser && ' · '
        }${browser} (Sparkle v${APP_VERSION})`
      })
    }
  );
};

/**
 * Send error report using
 * active users' auth token
 * @param  {Error} err
 * @return {Promise}
 */
export default async function sendErrorReport(err) {
  assert(err instanceof Error, 'has error instance');
  const auth = firebase.auth();

  let authToken = '';
  try {
    authToken = await auth.currentUser.getIdToken();
  } catch (tokenErr) {
    /* eslint-disable no-console */
    console.error(
      Error(
        `${PREFIX} sesendErrorReport: auth token requested before user session started: ${tokenErr}`
      )
    ); /* eslint-enable */
    return Promise.resolve(); // avoid rejection
  }

  return postRequest(authToken, err).catch(() => {}); // ignore api errors
}

import currentUser from '../../utils/currentUser';
import { userAgent } from '../../utils/browserSniffer';

const PREFIX = 'services: api: errorReports:';

// POST an Error Report request
const postRequest = (authToken: string, err: Error): Promise<any> =>
  fetch(
    `${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN}/api/v0/clients/errors`,
    {
      method: 'POST',
      headers: {
        Authorization: `FB-JWT ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `${err}`,
        userAgent
      })
    }
  );

// Send error report using
// active users' auth token
export const send = async (err: Error): Promise<any> => {
  let authToken = '';

  try {
    authToken = await currentUser.getIdToken();
  } catch (tokenErr) {
    /* eslint-disable no-console */
    console.error(
      Error(
        `${PREFIX} send: auth token requested before user session started: ${tokenErr}`
      )
    ); /* eslint-enable */
    return Promise.resolve(); // avoid rejection
  }

  return postRequest(authToken, err).catch(() => true); // ignore api errors
};

export default { send };

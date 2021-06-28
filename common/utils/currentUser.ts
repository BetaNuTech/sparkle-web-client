import firebase from 'firebase/app';

// const PREFIX = 'common: utils: currentUser:';

const currentUser = {
  // Get current users's
  // authentication token to
  // provide credentials to API
  getIdToken(): Promise<string> {
    const auth = firebase.auth();
    return auth.currentUser.getIdToken();
  },

  // Get current user's ID
  // eslint-disable-next-line
  getId() {
    const auth = firebase.auth();
    return (auth.currentUser && auth.currentUser.uid) || '';
  }
};

export default currentUser;

/* eslint-disable import/no-extraneous-dependencies */
import firebase from 'firebase/app';
import 'firebase/auth';
import config from '../../config/firebase';
/* eslint-enable */

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;

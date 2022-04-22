import { FunctionComponent } from 'react';
import firebaseConfig from '../../../config/firebase';
import AppleLogo from '../../../public/icons/sparkle/apple-logo.svg';
import styles from './styles.module.scss';

const { storageBucket, projectId } = firebaseConfig;

const IOSLink: FunctionComponent = () => {
  const iOSPlistFileURL = encodeURIComponent(
    `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/ios%2F${projectId}.plist?alt=media`
  );

  const iosLink = `itms-services://?action=download-manifest&url=${iOSPlistFileURL}`;
  return (
    <a href={iosLink} className={styles.iosLink} data-testid="ios-link">
      <AppleLogo /> Install iOS App
    </a>
  );
};

export default IOSLink;

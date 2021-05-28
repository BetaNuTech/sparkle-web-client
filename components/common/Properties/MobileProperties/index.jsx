/* eslint-disable max-len */
import styles from './MobileProperties.module.scss';
import { TeamItem } from './TeamItem';
import { PropertyItem } from './PropertyItem';

export const MobileProperties = () => (
  <ul className={styles.mobileProperties}>
    <li className={styles.mobileProperties__item}>
      <header>teams</header>
      <TeamItem name="Team one" />
      <TeamItem name="Team two" />
    </li>

    <li className={styles.mobileProperties__item}>
      <header>properties</header>
      <PropertyItem
        name="Walnut Ridge"
        addr1="1900 Walnut Street"
        mailingAddr2="Bastrop, TX 78602"
      />
      <PropertyItem
        backgroundImage="https://firebasestorage.googleapis.com/v0/b/sparkle-jwc.appspot.com/o/propertyImages%2FdvSsHLv8cxAvIMKv9Gk0.jpeg?alt=media&token=f226942e-bc2e-476f-89dd-d2eee28cd2e4"
        name="1400 Chestnut"
        addr1="1400 Chestnut Street"
        mailingAddr2="Chattanooga, TN 37402"
        lastInspectionEntries="1 Entry [ Last: 100%, May 13 ]"
      />
    </li>
  </ul>
);

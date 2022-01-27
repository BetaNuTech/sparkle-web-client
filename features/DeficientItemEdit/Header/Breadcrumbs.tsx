import { FunctionComponent } from 'react';
import Link from 'next/link';
import PropertyModel from '../../../common/models/property';

import styles from './styles.module.scss';

interface Props {
  property: PropertyModel;
  itemTitle: string;
}

const Breadcrumbs: FunctionComponent<Props> = ({ property, itemTitle }) => (
  <div className={styles.header}>
    <div className={styles.header__breadcrumb}>
      <Link href={`/properties/${property.id}`}>
        <a className={styles.header__link}>{`${property.name}`}</a>
      </Link>
      <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
      <Link href={`/properties/${property.id}/deficient-items`}>
        <a className={styles.header__link}>Deficient Items</a>
      </Link>

      <span className={styles.header__breadcrumb}>
        &nbsp;&nbsp;/&nbsp;&nbsp;{itemTitle}
      </span>
    </div>
    <div className={styles.header__title}>{itemTitle}</div>
  </div>
);

export default Breadcrumbs;

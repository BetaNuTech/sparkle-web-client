import { FunctionComponent } from 'react';
import Link from 'next/link';
import PropertyModel from '../../../../common/models/property';

import styles from './styles.module.scss';

interface Props {
  property: PropertyModel;
}

const Breadcrumbs: FunctionComponent<Props> = ({ property }) => (
  <div className={styles.breadcrumbs}>
    <div className={styles.breadcrumbs__item}>
      <Link href={`/properties/${property.id}`}>
        <a className={styles.breadcrumbs__link}>{`${property.name}`}</a>
      </Link>
    </div>
    <div className={styles.breadcrumbs__title}>Deficient Items</div>
  </div>
);

export default Breadcrumbs;

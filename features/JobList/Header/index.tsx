import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import propertyModel from '../../../common/models/property';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';

interface JobsHeaderModel {
  property: propertyModel;
}

const Header: FunctionComponent<JobsHeaderModel> = ({ property }) => {
  const router = useRouter();
  return (
    <header className={styles.header}>
      {/* Title And Create Button */}
      <aside className={styles.header__main}>
        <button
          type="button"
          className={styles.header__backButton}
          onClick={() => router.back()}
          data-testid="property-jobs-back"
        ></button>
        <h1 className={styles.header__title}>
          <span
            className={styles.header__propertyName}
          >{`${property.name}`}</span>
          <span>&nbsp;/ Jobs</span>
        </h1>
      </aside>

      <aside className={styles.header__controls}>
        <div className={styles.header__item}>
          <Link href={`/properties/${property.id}/jobs/edit/new`}>
            <a
              className={clsx(styles.header__item__createButton)}
              data-testid="property-jobs-create"
            >
              Create New Job
              <span className="iconAddButton">
                <AddIcon />
              </span>
            </a>
          </Link>
        </div>
      </aside>
    </header>
  );
};

Header.defaultProps = {};

export default Header;

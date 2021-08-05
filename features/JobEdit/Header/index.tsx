import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import propertyModel from '../../../common/models/property';
import { JobApiResult } from '../hooks/useJobForm';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface JobsHeaderModel {
  property: propertyModel;
  apiState: JobApiResult;
}

const Header: FunctionComponent<JobsHeaderModel> = ({ property, apiState }) => {
  const router = useRouter();
  const config = getConfig() || {};
  const publicRuntimeConfig = config.publicRuntimeConfig || {};
  const basePath = publicRuntimeConfig.basePath || '';

  const jobLink = `${basePath}/properties/${property.id}/jobs`;
  return (
    <header className={styles.header} data-testid="jobedit-header">
      {/* Title And Create Button */}
      <aside className={styles.header__left}>
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
            <span>&nbsp;/ Create New</span>
          </h1>
        </aside>
      </aside>

      <aside className={styles.header__controls}>
        <div className={parentStyles.button__group}>
          <Link href={jobLink}>
            <a
              className={clsx(parentStyles.button__cancel)}
              data-testid="jobedit-header-cancel"
            >
              Cancel
            </a>
          </Link>
        </div>
        <div className={parentStyles.button__group}>
          <button
            type="button"
            className={clsx(parentStyles.button__submit)}
            disabled={apiState.isLoading}
            data-testid="jobedit-header-submit"
          >
            Submit
          </button>
        </div>
      </aside>
    </header>
  );
};

Header.defaultProps = {};

export default Header;

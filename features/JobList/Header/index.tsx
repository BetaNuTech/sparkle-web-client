import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';

interface JobsHeaderModel {
  property: propertyModel;
  jobs: Array<jobModel>;
  jobStatus: string;
}

const MetaData: FunctionComponent<{
  jobs?: Array<jobModel>;
  jobStatus: string;
}> = ({ jobs, jobStatus }) => {
  const totalJobs = jobs.length;
  const openJobs = jobs.filter((j) => j.state === 'open').length;
  const approvedJobs = jobs.filter((j) => j.state === 'approved').length;
  const authorizedJobs = jobs.filter((j) => j.state === 'authorized').length;
  return (
    <ul className={clsx(styles.header__overview__metadata, '-p-none')}>
      <li data-testid="job-total-text">
        <span
          className={clsx(styles.header__overview__label, '-bgc-quaternary')}
          data-testid="job-total"
        >
          {totalJobs}
        </span>
        <div>
          {`Total Job${totalJobs > 1 ? 's' : ''}`}
          {jobStatus === 'loading' && (
            <small
              className={styles.header__overview__labelSub}
              data-testid="job-total-loading"
            >
              loading...
            </small>
          )}
        </div>
      </li>
      <li data-testid="job-open-text">
        <span
          className={clsx(styles.header__overview__label, '-bgc-gray-light')}
          data-testid="job-open"
        >
          {openJobs}
        </span>
        <div>
          Open
          {jobStatus === 'loading' && (
            <small
              className={styles.header__overview__labelSub}
              data-testid="job-open-loading"
            >
              loading...
            </small>
          )}
        </div>
      </li>
      <li data-testid="job-actions-text">
        <span
          className={clsx(styles.header__overview__label, '-bgc-primary')}
          data-testid="job-actions"
        >
          {approvedJobs}
        </span>
        <div>
          Approved
          {jobStatus === 'loading' && (
            <small
              className={styles.header__overview__labelSub}
              data-testid="job-actions-loading"
            >
              loading...
            </small>
          )}
        </div>
      </li>
      <li data-testid="job-progress-text">
        <span
          className={clsx(styles.header__overview__label, '-bgc-sea-green')}
          data-testid="job-progress"
        >
          {authorizedJobs}
        </span>
        <div>
          Authorized
          {jobStatus === 'loading' && (
            <small
              className={styles.header__overview__labelSub}
              data-testid="job-progress-loading"
            >
              loading...
            </small>
          )}
        </div>
      </li>
    </ul>
  );
};

const Header: FunctionComponent<JobsHeaderModel> = ({
  property,
  jobs,
  jobStatus
}) => {
  const router = useRouter();
  return (
    <header className={styles.header} data-testid="joblist-header">
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
          </h1>
        </aside>
        <MetaData jobs={jobs} jobStatus={jobStatus} />
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

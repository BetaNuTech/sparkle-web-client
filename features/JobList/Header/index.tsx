import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import DesktopHeader from '../../../common/DesktopHeader';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import configJobs from '../../../config/jobs';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';

interface JobsHeaderModel {
  property: propertyModel;
  jobs: Array<jobModel>;
  jobStatus: string;
  colors: Record<string, string>;
  filterState?: string;
  isOnline: boolean;
  changeJobFilterState?(state: string): void;
}

const MetaData: FunctionComponent<{
  jobs?: Array<jobModel>;
  jobStatus: string;
  colors: Record<string, string>;
  filterState?: string;
  changeJobFilterState?(state: string): void;
}> = ({ jobs, jobStatus, colors, filterState, changeJobFilterState }) => {
  const openJobs = jobs.filter((j) => j.state === 'open').length;
  const approvedJobs = jobs.filter((j) => j.state === 'approved').length;
  const authorizedJobs = jobs.filter((j) => j.state === 'authorized').length;
  return (
    <ul className={clsx(styles.header__overview__metadata, '-p-none')}>
      <li
        data-testid="job-open-text"
        className={clsx(
          filterState && filterState !== 'open' && styles['-inactive']
        )}
      >
        <button
          className={clsx(styles.header__filterButton)}
          onClick={() => changeJobFilterState('open')}
        >
          <span
            className={clsx(
              styles.header__overview__label,
              colors[configJobs.stateColors.open]
            )}
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
        </button>
      </li>
      <li
        data-testid="job-actions-text"
        className={clsx(
          filterState && filterState !== 'approved' && styles['-inactive']
        )}
      >
        <button
          className={clsx(styles.header__filterButton)}
          onClick={() => changeJobFilterState('approved')}
        >
          <span
            className={clsx(
              styles.header__overview__label,
              colors[configJobs.stateColors.approved]
            )}
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
        </button>
      </li>
      <li
        data-testid="job-progress-text"
        className={clsx(
          filterState && filterState !== 'authorized' && styles['-inactive']
        )}
      >
        <button
          className={clsx(styles.header__filterButton)}
          onClick={() => changeJobFilterState('authorized')}
        >
          <span
            className={clsx(
              styles.header__overview__label,
              colors[configJobs.stateColors.authorized]
            )}
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
        </button>
      </li>
    </ul>
  );
};

const Header: FunctionComponent<JobsHeaderModel> = ({
  property,
  jobs,
  jobStatus,
  colors,
  filterState,
  isOnline,
  changeJobFilterState
}) => {
  const backLink = `/properties/${property.id}/`;
  const RightSide = () => (
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
  );
  return (
    <DesktopHeader
      backLink={backLink}
      headerTestId="joblist-header"
      title={
        <>
          <span
            className={styles.header__propertyName}
          >{`${property.name}`}</span>
          <span>&nbsp;/ Jobs</span>
        </>
      }
      titleInfo={
        <MetaData
          jobs={jobs}
          jobStatus={jobStatus}
          filterState={filterState}
          colors={colors}
          changeJobFilterState={changeJobFilterState}
        />
      }
      isOnline={isOnline}
      right={<RightSide />}
    />
  );
};

Header.defaultProps = {};

export default Header;

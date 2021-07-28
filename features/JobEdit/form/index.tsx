import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import clsx from 'clsx';
import Link from 'next/link';
import getConfig from 'next/config';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import MobileHeader from '../../../common/MobileHeader';
import breakpoints from '../../../config/breakpoints';
import jobsConfig from '../../../config/jobs';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import DropdownHeader from '../DropdownHeader';
import Header from '../Header';
import styles from '../styles.module.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  property: propertyModel;
  job: jobModel;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const Layout: FunctionComponent<{
  isMobile: boolean;
  jobLink: string;
  job: jobModel;
}> = ({ isMobile, job, jobLink }) => (
  <div
    className={clsx(styles.form__grid, !isMobile && styles.form__grid__desktop)}
  >
    <form>
      <div className={styles.jobNew__formGroup}>
        <label htmlFor="jobTitle">
          Title <span>*</span>
        </label>
        <input
          id="jobTitle"
          type="text"
          name="title"
          className={styles.jobNew__input}
          defaultValue={job.title}
          required
          data-testid="job-form-title"
        />
      </div>
      <div className={styles.jobNew__formGroup}>
        <label htmlFor="jobDescription">
          Required <span>*</span>
        </label>
        <textarea
          id="jobDescription"
          className="form-control"
          rows={4}
          defaultValue={job.need}
          required
          data-testid="job-form-description"
        ></textarea>
      </div>
      <div className={styles.jobNew__formGroup}>
        <label htmlFor="jobType">Job Type</label>
        <select
          name=""
          id="jobType"
          data-testid="job-form-type"
          defaultValue={job.type}
        >
          {Object.keys(jobsConfig.types).map((t) => (
            <option key={t} value={t}>
              {jobsConfig.types[t]}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.jobNew__formGroup}>
        <label htmlFor="jobScope">
          Scope of work <span>*</span>
        </label>
        <textarea
          id="jobScope"
          className="form-control"
          rows={6}
          defaultValue={job.scopeOfWork}
          required
          data-testid="job-form-scope"
        ></textarea>
      </div>
      <div className={clsx(styles.button__group, '-mt-lg')}>
        <button
          type="submit"
          data-testid="form-submit"
          className={clsx(
            styles.button__submit,
            isMobile && styles.button__fullwidth
          )}
        >
          Submit
        </button>
      </div>
      {isMobile && (
        <div
          className={clsx(styles.button__group, styles.button__group__margin)}
        >
          <Link href={jobLink}>
            <a
              className={clsx(
                styles.button__cancel,
                styles.button__fullwidth,
                '-ta-center'
              )}
              data-testid="mobile-form-cancel"
            >
              Cancel
            </a>
          </Link>
        </div>
      )}
    </form>
  </div>
);

const JobForm: FunctionComponent<Props> = ({
  property,
  job,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const config = getConfig() || {};
  const publicRuntimeConfig = config.publicRuntimeConfig || {};
  const basePath = publicRuntimeConfig.basePath || '';

  const jobLink = `${basePath}/properties/${property.id}/jobs`;

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <div
        className={clsx(
          headStyle.header__button,
          headStyle['header__button--dropdown'],
          styles.jobNew__header__icon
        )}
      >
        <ActionsIcon />
        <DropdownHeader jobLink={jobLink} />
      </div>
    </>
  );

  return (
    <>
      {isMobileorTablet && (
        <>
          <MobileHeader
            title="Create New Job"
            toggleNavOpen={toggleNavOpen}
            isOnline={isOnline}
            isStaging={isStaging}
            actions={mobileHeaderActions}
            className={styles.jobNew__header}
          />
          <Layout
            isMobile={isMobileorTablet}
            job={job || ({} as jobModel)}
            jobLink={jobLink}
          />
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div data-testid="desktop-form">
          <Header property={property} />
          <Layout
            isMobile={isMobileorTablet}
            job={job || ({} as jobModel)}
            jobLink={jobLink}
          />
        </div>
      )}
    </>
  );
};

export default JobForm;

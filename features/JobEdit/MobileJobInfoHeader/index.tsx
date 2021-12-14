import { FunctionComponent } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import jobModel from '../../../common/models/job';
import propertyModel from '../../../common/models/property';
import styles from '../styles.module.scss';

interface Props {
  propertyLink: string;
  jobLink: string;
  property: propertyModel;
  isNewJob: boolean;
  bidsRequired: number;
  job: jobModel;
}

const MobileJobInfoHeader: FunctionComponent<Props> = ({
  propertyLink,
  jobLink,
  property,
  isNewJob,
  bidsRequired,
  job
}: Props) => (
  <div
    className={styles.job__info__header__main}
    data-testid="job-form-title-mobile"
  >
    <div className={styles.job__info__header__separated}>
      <div className={styles.job__info__header__breadcrumb}>
        <Link href={propertyLink}>
          <a
            className={styles.job__info__header__breadcrumb__text}
          >{`${property.name}`}</a>
        </Link>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        <Link href={jobLink}>
          <a className={styles.job__info__header__breadcrumb__text}>Jobs</a>
        </Link>
        {!isNewJob && (
          <span className={styles.job__info__header__breadcrumb}>
            &nbsp;&nbsp;/&nbsp;&nbsp;Edit
          </span>
        )}
      </div>
      <div>
        {bidsRequired > 0 ? (
          <span
            className={styles.job__info__bidsRequired}
            data-testid="bids-required"
          >
            {`+${bidsRequired} bid${bidsRequired > 1 ? 's' : ''} required`}
          </span>
        ) : (
          <span
            className={clsx(
              styles.job__info__bidsRequired,
              styles['job__info__bidsRequired--met']
            )}
            data-testid="bids-requirement-met"
          >
            Bid requirements met
          </span>
        )}
      </div>
    </div>
    <h1 className={styles.job__info__header__title}>
      {isNewJob ? 'New Job' : job.title}
      {!isNewJob && job.authorizedRules === 'expedite' && (
        <div>
          <span className={styles.job__info__expedited}>Expedited</span>
        </div>
      )}
    </h1>
  </div>
);

MobileJobInfoHeader.displayName = 'MobileJobInfoHeader';

export default MobileJobInfoHeader;

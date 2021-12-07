import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import utilString from '../../../../../common/utils/string';
import { textColors } from '../../../../JobList';
import jobsConfig from '../../../../../config/jobs';
import styles from '../../../styles.module.scss';

interface Props {
  jobState: string;
  otherBidsText: string;
  jobEditLink: string;
}

const JobInfo: FunctionComponent<Props> = ({
  jobState,
  otherBidsText,
  jobEditLink
}: Props) => (
  <>
    <div className={clsx(styles.form__group)}>
      <label>Job Info</label>
    </div>
    <div className={clsx(styles.form__card__pill)}>
      <span
        className={clsx(
          styles.form__parentStatusLabel,
          textColors[jobsConfig.stateColors[jobState]]
        )}
        data-testid="bid-form-edit-job-info"
      >
        {utilString.titleize(jobState)}
      </span>
      <span
        className={styles.form__parentDetail}
        data-testid="bid-form-edit-job-otherBidText"
      >
        {otherBidsText}
      </span>
      <Link href={jobEditLink}>
        <a
          className={styles.form__parentLink}
          data-testid="bid-form-edit-job-link"
        >
          Edit Job
        </a>
      </Link>
    </div>
  </>
);

JobInfo.displayName = 'JobInfo';

export default JobInfo;

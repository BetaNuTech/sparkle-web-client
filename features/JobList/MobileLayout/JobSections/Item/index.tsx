import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import jobModel from '../../../../../common/models/job';
import utilString from '../../../../../common/utils/string';
import utilDate from '../../../../../common/utils/date';
import styles from '../styles.module.scss';

interface ItemProps {
  job: jobModel;
  propertyId: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>>;
}

const Item: FunctionComponent<ItemProps> = ({
  job,
  propertyId,
  colors,
  configJobs
}) => (
  <li className={styles.jobList__record} data-testid="job-item-record">
    <Link href={`/properties/${propertyId}/jobs/${job.id}/bids`}>
      <a className={styles.jobList__record__link}>
        <div>
          <h3 className={styles.jobList__record__title} data-testid="mobile-row-job-title">{job.title}</h3>
          <div className={styles.jobList__record__row}>
            <strong className="-c-black">Created:</strong>{' '}
            <span className="-c-gray-light" data-testid="mobile-row-job-created">
              {utilDate.toUserDateTimeDisplay(job.createdAt)}
            </span>
          </div>
          <div
            className={styles.jobList__record__row}
            data-testid="job-updated-time"
          >
            <strong className="-c-black">Updated:</strong>{' '}
            <span className="-c-gray-light" data-testid="mobile-row-job-updated">
              {utilDate.toUserDateTimeDisplay(job.updatedAt)}
            </span>
          </div>
        </div>
        <div>
          <span
            className={clsx(
              styles.jobList__record__type,
              colors[configJobs.typeColors[job.type]]
            )}
            data-testid="mobile-row-job-type"
          >
            {utilString.titleize(job.type)}
          </span>
        </div>
      </a>
    </Link>
  </li>
);

export default Item;

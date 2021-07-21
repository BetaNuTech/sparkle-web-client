import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import utilDate from '../../../../common/utils/date';
import utilString from '../../../../common/utils/string';
import jobModel from '../../../../common/models/job';
import parentStyles from '../styles.module.scss';

interface ListItemProps {
  propertyId: string;
  job: jobModel;
}

const ListItem: FunctionComponent<ListItemProps> = ({ propertyId, job }) => (
  <li
    className={clsx(parentStyles.propertyJobs__gridRow)}
    data-testid="job-item-record"
  >
    <Link href={`/properties/${propertyId}/jobs/${job.id}/bids`}>
      <a className={parentStyles.propertyJobs__gridRow__link}>
        <div className={parentStyles.propertyJobs__gridRow__column}>
          {job.title}
        </div>
        <div
          className={parentStyles.propertyJobs__gridRow__column}
          data-testid="job-created-text"
        >
          {utilDate.toUserDateTimeDisplay(job.createdAt)}
        </div>
        <div
          className={parentStyles.propertyJobs__gridRow__column}
          data-testid="job-updated-text"
        >
          {utilDate.toUserDateTimeDisplay(job.updatedAt)}
        </div>
        <div
          className={parentStyles.propertyJobs__gridRow__column}
          data-testid="job-type-text"
        >
          {utilString.titleize(job.type)}
        </div>
      </a>
    </Link>
  </li>
);

export default ListItem;

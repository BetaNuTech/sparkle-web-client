import { FunctionComponent, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import utilDate from '../../../../common/utils/date';
import utilString from '../../../../common/utils/string';
import jobModel from '../../../../common/models/job';
import useVisibility from '../../../../common/hooks/useVisibility';
import parentStyles from '../styles.module.scss';

interface ListItemProps {
  propertyId: string;
  job: jobModel;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>>;
  forceVisible?: boolean;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  propertyId,
  job,
  colors,
  configJobs,
  forceVisible
}) => {
  const ref = useRef(null);

  const { isVisible } = useVisibility(ref, {}, forceVisible);
  const jobType = utilString.titleize(job.type);
  const viewBidLink = `/properties/${propertyId}/jobs/${job.id}/bids`;
  return (
    <li
      className={clsx(parentStyles.propertyJobs__gridRow)}
      data-testid="job-item-record"
      ref={ref}
    >
      {isVisible ? (
        <Link href={`/properties/${propertyId}/jobs/edit/${job.id}`}>
          <a className={parentStyles.propertyJobs__gridRow__link}>
            <div
              className={parentStyles.propertyJobs__gridRow__column}
              data-testid="grid-row-job-title"
            >
              {job.title}
            </div>
            <div
              className={parentStyles.propertyJobs__gridRow__column}
              data-testid="grid-row-job-created"
            >
              {utilDate.toUserDateTimeDisplay(job.createdAt)}
            </div>
            <div
              className={parentStyles.propertyJobs__gridRow__column}
              data-testid="grid-row-job-updated"
            >
              {utilDate.toUserDateTimeDisplay(job.updatedAt)}
            </div>
            <div
              className={parentStyles.propertyJobs__gridRow__column}
              data-testid="grid-row-job-type"
            >
              <span
                className={clsx(
                  parentStyles.propertyJobs__gridRow__type,
                  colors[configJobs.typeColors[job.type]]
                )}
                data-testid="grid-row-job-type-label"
                title={jobType}
              >
                {jobType}
              </span>
            </div>
            <div className={parentStyles.propertyJobs__gridRow__column}>
              <Link href={viewBidLink}>
                <span>View Bids</span>
              </Link>
            </div>
          </a>
        </Link>
      ) : null}
    </li>
  );
};

ListItem.defaultProps = {
  forceVisible: false
};

export default ListItem;

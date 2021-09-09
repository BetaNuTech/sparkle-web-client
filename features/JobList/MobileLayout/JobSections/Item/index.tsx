import { useState, useRef, FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import jobModel from '../../../../../common/models/job';
import utilString from '../../../../../common/utils/string';
import utilDate from '../../../../../common/utils/date';
import useVisibility from '../../../../../common/hooks/useVisibility';
import useSwipeReveal from '../../../../../common/hooks/useSwipeReveal';
import styles from '../styles.module.scss';

interface ItemProps {
  job: jobModel;
  propertyId: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>>;
  forceVisible?: boolean;
}

const Item: FunctionComponent<ItemProps> = ({
  job,
  propertyId,
  colors,
  configJobs,
  forceVisible
}) => {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  useSwipeReveal(ref, setIsSwipeOpen);
  const viewBidLink = `/properties/${propertyId}/jobs/${job.id}/bids`;

  const { isVisible } = useVisibility(ref, {}, forceVisible);
  return (
    <li
      ref={ref}
      className={styles.jobList__record}
      data-testid="job-item-record"
    >
      {isVisible ? (
        <>
          <div
            className={
              isSwipeOpen
                ? clsx(
                    styles.itemResult__content,
                    styles['itemResult--swipeOpen']
                  )
                : styles.itemResult__content
            }
          >
            <div className={styles.jobList__record__edit}>
              <Link href={`/properties/${propertyId}/jobs/edit/${job.id}`}>
                <a>
                  <h3
                    className={styles.jobList__record__title}
                    data-testid="mobile-row-job-title"
                  >
                    {job.title}
                  </h3>
                  <div className={styles.jobList__record__row}>
                    <strong className="-c-black">Created:</strong>{' '}
                    <span
                      className="-c-gray-light"
                      data-testid="mobile-row-job-created"
                    >
                      {utilDate.toUserDateTimeDisplay(job.createdAt)}
                    </span>
                  </div>
                  <div
                    className={styles.jobList__record__row}
                    data-testid="job-updated-time"
                  >
                    <strong className="-c-black">Updated:</strong>{' '}
                    <span
                      className="-c-gray-light"
                      data-testid="mobile-row-job-updated"
                    >
                      {utilDate.toUserDateTimeDisplay(job.updatedAt)}
                    </span>
                  </div>
                </a>
              </Link>
            </div>
            <div className={styles.jobList__record__bid}>
              <Link href={viewBidLink}>
                <a>
                  <span
                    className={clsx(
                      styles.jobList__record__type,
                      colors[configJobs.typeColors[job.type]]
                    )}
                    data-testid="mobile-row-job-type"
                  >
                    {utilString.titleize(job.type)}
                  </span>
                  <span className={styles.jobList__record__bidLink}>View Bids</span>
                </a>
              </Link>
            </div>
          </div>

          {/* Swipe Reveal Actions */}
          <div
            className={clsx(
              styles.swipeReveal,
              isSwipeOpen && styles.swipeReveal__reveal
            )}
          >
            <Link href={`/properties/${propertyId}/jobs/edit/${job.id}`}>
              <a className={styles.swipeReveal__editButton}>Edit</a>
            </Link>
          </div>
        </>
      ) : null}
    </li>
  );
};

Item.defaultProps = {
  forceVisible: false
};

export default Item;

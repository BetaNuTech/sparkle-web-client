import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import jobModel from '../../../../../common/models/job';
import bidModel from '../../../../../common/models/bid';
import utilDate from '../../../../../common/utils/date';
import useBidsCost from '../../../hooks/useBidsCost';
import styles from '../styles.module.scss';

interface ItemProps {
  job: jobModel;
  bid: bidModel;
  propertyId: string;
}

const Item: FunctionComponent<ItemProps> = ({ job, bid, propertyId }) => {
  const bidRange = useBidsCost(bid);

  return (
    <li className={styles.bidList__record} data-testid="bid-item-record">
      <Link
        href={`/properties/${propertyId}/jobs/${job.id}/bids/${bid.id}`}
      >
        <a className={styles.bidList__record__link}>
          <div>
            <h3
              className={styles.bidList__record__title}
              data-testid="mobile-row-bid-title"
            >
              {bid.vendor}
            </h3>
            {bid.startAt > 0 && (
              <div>
                <strong className="-c-black">Started:</strong>{' '}
                <span
                  className="-c-gray-light"
                  data-testid="mobile-row-bid-starat"
                >
                  {utilDate.toUserDateTimeDisplay(bid.startAt)}
                </span>
              </div>
            )}
            {bid.completeAt > 0 && (
              <div data-testid="bid-completed-time">
                <strong className="-c-black">Completed:</strong>{' '}
                <span
                  className="-c-gray-light"
                  data-testid="mobile-row-bid-completeat"
                >
                  {utilDate.toUserDateTimeDisplay(bid.completeAt)}
                </span>
              </div>
            )}
          </div>
          <div>
            <span
              className={clsx(styles.bidList__record__range)}
              data-testid="mobile-row-bid-range"
            >
              {`$ ${bidRange}`}
            </span>
          </div>
        </a>
      </Link>
    </li>
  );
};

export default Item;

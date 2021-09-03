import { FunctionComponent, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import utilDate from '../../../../common/utils/date';
import jobModel from '../../../../common/models/job';
import bidModel from '../../../../common/models/bid';
import useVisibility from '../../../../common/hooks/useVisibility';
import useBidsCost from '../../hooks/useBidsCost';
import parentStyles from '../styles.module.scss';

interface ListItemProps {
  propertyId: string;
  job: jobModel;
  bid: bidModel;
  forceVisible?: boolean;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  propertyId,
  job,
  bid,
  forceVisible
}) => {
  const bidRange = useBidsCost(bid);
  const ref = useRef(null);

  const { isVisible } = useVisibility(ref, {}, forceVisible);
  return (
    <li
      className={clsx(parentStyles.propertyJobBids__gridRow)}
      data-testid="bid-item-record"
      ref={ref}
    >
      {isVisible ? (
        <Link href={`/properties/${propertyId}/jobs/${job.id}/bids/${bid.id}`}>
          <a className={parentStyles.propertyJobBids__gridRow__link}>
            <div
              className={parentStyles.propertyJobBids__gridRow__column}
              data-testid="grid-row-bid-title"
            >
              {bid.vendor}
            </div>
            <div
              className={parentStyles.propertyJobBids__gridRow__column}
              data-testid="grid-row-bid-starat"
            >
              {bid.startAt ? utilDate.toUserDateTimeDisplay(bid.startAt) : '-'}
            </div>
            <div
              className={parentStyles.propertyJobBids__gridRow__column}
              data-testid="grid-row-bid-completeat"
            >
              {bid.completeAt
                ? utilDate.toUserDateTimeDisplay(bid.completeAt)
                : '-'}
            </div>
            <div
              className={parentStyles.propertyJobBids__gridRow__column}
              data-testid="grid-row-bid-range-cell"
            >
              <span
                className={clsx(parentStyles.propertyJobBids__gridRow__type)}
                data-testid="grid-row-bid-range"
              >
                {`$ ${bidRange}`}
              </span>
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

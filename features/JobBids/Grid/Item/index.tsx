import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import getConfig from 'next/config';
import utilDate from '../../../../common/utils/date';
import jobModel from '../../../../common/models/job';
import bidModel from '../../../../common/models/bid';
import useBidsCost from '../../hooks/useBidsCost';
import parentStyles from '../styles.module.scss';

interface ListItemProps {
  propertyId: string;
  job: jobModel;
  bid: bidModel;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  propertyId,
  job,
  bid
}) => {
  const bidRange = useBidsCost(bid);

  const config = getConfig() || {};
  const publicRuntimeConfig = config.publicRuntimeConfig || {};
  const basePath = publicRuntimeConfig.basePath || '';
  return (
    <li
      className={clsx(parentStyles.propertyJobBids__gridRow)}
      data-testid="bid-item-record"
    >
      <Link
        href={`${basePath}/properties/${propertyId}/jobs/${job.id}/bids/${bid.id}`}
      >
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
    </li>
  );
};

export default ListItem;

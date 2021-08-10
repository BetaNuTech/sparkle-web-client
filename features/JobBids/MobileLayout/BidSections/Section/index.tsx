import clsx from 'clsx';
import { FunctionComponent } from 'react';
import jobModel from '../../../../../common/models/job';
import bidModel from '../../../../../common/models/bid';
import Item from '../Item';
import styles from '../styles.module.scss';

interface Props {
  job: jobModel;
  bids: Array<bidModel>;
  propertyId: string;
  colors: Record<string, string>;
  configBids: Record<string, Record<string, string>>;
  title?: string;
  state?: string;
}

const Section: FunctionComponent<Props> = ({
  job,
  title,
  state,
  colors,
  configBids,
  bids,
  propertyId
}) => (
  <li className={styles.bidList__box__listItem} data-testid="bid-section-main">
    <header
      className={clsx(
        styles.bidList__box__header,
        colors[configBids.stateColors[state]]
      )}
      data-testid="bid-section-title"
    >
      {title}
    </header>
    {bids.length > 0 ? (
      <ul className={styles.bidList__category} data-testid="bid-section-items">
        {bids.map((bid) => (
          <Item key={`${bid.id}`} job={job} bid={bid} propertyId={propertyId} />
        ))}
      </ul>
    ) : (
      <h3
        className={clsx('-c-gray-light', '-pt-sm', '-pl-sm', '-pb-sm')}
        data-testid="bid-section-no-bids"
      >
        {`No ${state} bids`}
      </h3>
    )}
  </li>
);

export default Section;

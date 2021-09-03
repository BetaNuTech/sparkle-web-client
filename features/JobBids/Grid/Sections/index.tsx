import { FunctionComponent } from 'react';
import clsx from 'clsx';
import bidModel from '../../../../common/models/bid';
import jobModel from '../../../../common/models/job';
import Item from '../Item';
import styles from '../styles.module.scss';

interface Props {
  title?: string;
  propertyId: string;
  job: jobModel;
  bids: Array<bidModel>;
  colors: Record<string, string>;
  configBids: Record<string, Record<string, string>>;
  bidState?: string;
  forceVisible?: boolean;
}

const Section: FunctionComponent<Props> = ({
  title,
  propertyId,
  bids,
  job,
  colors,
  configBids,
  bidState,
  forceVisible
}) => (
  <li
    className={styles.propertyJobBids__gridTitle}
    data-testid="bid-section-main"
  >
    <header
      className={styles.propertyJobBids__gridTitle__head}
      data-testid="bid-section-title"
    >
      {title}
      <span
        className={clsx(
          styles.propertyJobBids__gridTitle__border,
          colors[configBids.stateColors[bidState]]
        )}
        data-testid="bid-section-title-border"
      ></span>
    </header>
    {bids.length > 0 ? (
      <ul data-testid="bid-section-items">
        {bids.map((bid) => (
          <Item
            key={`${bid.id}`}
            job={job}
            bid={bid}
            propertyId={propertyId}
            forceVisible={forceVisible}
          />
        ))}
      </ul>
    ) : (
      <h3
        className={styles.propertyJobBids__gridRow__noRecord}
        data-testid="bid-section-no-bids"
      >
        {`No ${bidState} bids`}
      </h3>
    )}
  </li>
);

Section.defaultProps = {
  forceVisible: false
};

export default Section;

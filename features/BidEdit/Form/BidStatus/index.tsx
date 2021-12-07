import { FunctionComponent } from 'react';

import utilString from '../../../../common/utils/string';
import styles from '../../styles.module.scss';

interface Props {
  isNewBid: boolean;
  isMobile: boolean;
  bidState: string;
  nextState: string;
}

const BidStatus: FunctionComponent<Props> = ({
  isNewBid,
  isMobile,
  bidState,
  nextState
}: Props) => {
  if (isNewBid) {
    return null;
  }
  return (
    <div className={styles.form__grid__info}>
      <div className={styles.bid__info}>
        <div className={styles.bid__info__box}>
          <p>Bid Status{!isMobile && <> :&nbsp;</>}</p>
          <h3 data-testid="bid-form-edit-state">
            {utilString.titleize(bidState)}
          </h3>
        </div>
        {nextState && (
          <div className={styles.bid__info__box}>
            <p>Requires{!isMobile && <> :&nbsp;</>}</p>
            <h3 data-testid="bid-form-edit-nextstatus">{nextState}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

BidStatus.displayName = 'BidStatus';

export default BidStatus;

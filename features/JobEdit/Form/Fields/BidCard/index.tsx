import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import AddIcon from '../../../../../public/icons/ios/add.svg';
import { JobState } from '../../../../../common/models/job';
import bidModel from '../../../../../common/models/bid';
import utilString from '../../../../../common/utils/string';
import { textColors } from '../../../../JobBids';
import bidsConfig from '../../../../../config/bids';
import styles from '../../../styles.module.scss';

interface Props {
  bidsRequired: number;
  propertyId: string;
  jobId: string;
  jobState: JobState;
  isNewJob: boolean;
  isMobile: boolean;
  bids: bidModel[];
}

const JobBidCard: FunctionComponent<Props> = ({
  bidsRequired,
  propertyId,
  jobId,
  jobState,
  isNewJob,
  isMobile,
  bids
}) => {
  const bidsLink = `/properties/${propertyId}/jobs/${jobId}/bids/`;
  if (isNewJob) {
    return null;
  }
  return (
    <div className={clsx(styles.jobNew__card, '-mt')}>
      <div className={styles.jobNew__card__pill__action}>
        <h4 className={styles.jobNew__card__title}>
          Bids
          {bidsRequired > 0 ? (
            <span
              className={styles.job__info__bidsRequired}
              data-testid="bids-required"
            >
              ({`+${bidsRequired} bid${bidsRequired > 1 ? 's' : ''} required`})
            </span>
          ) : (
            <span
              className={clsx(
                styles.job__info__bidsRequired,
                styles['job__info__bidsRequired--met']
              )}
              data-testid="bids-requirement-met"
            >
              (Bid requirements met)
            </span>
          )}
        </h4>
        {jobState !== 'open' && (
          <Link href={bidsLink}>
            <a className={styles.jobNew__card__titleLink}>View All</a>
          </Link>
        )}
      </div>
      {bids.length > 0 ? (
        bids.map((b) => (
          <Link
            href={`/properties/${propertyId}/jobs/${jobId}/bids/${b.id}`}
            key={b.id}
          >
            <a>
              <div
                className={clsx(
                  styles.jobNew__card__pill,
                  styles.jobNew__bid,
                  '-mt'
                )}
                data-testid="bid-edit-card-pill"
              >
                <div className={styles.jobNew__bid__title}>
                  <h5 className={styles.jobNew__card__pill__title}>
                    {b.vendor}
                  </h5>
                  <span
                    className={clsx(
                      styles.jobNew__bid__status,
                      textColors[bidsConfig.stateColors[b.state]]
                    )}
                  >
                    {utilString.titleize(b.state)}
                  </span>
                </div>
                <span className={styles.jobNew__bid__link}>View Bid</span>
              </div>
            </a>
          </Link>
        ))
      ) : (
        <div className={clsx(styles.button__group, '-mt', '-mr-none')}>
          {jobState === 'open' ? (
            <>
              <button
                className={clsx(
                  styles.button__submit,
                  isMobile && styles.button__fullwidth
                )}
                type="button"
                disabled
                data-testid="add-bid-card-btn-disabled"
              >
                Add First Bid{' '}
                <span>
                  <AddIcon />
                </span>
              </button>
              <br />
              <p className="-mb-none -c-gray-light">
                Job must be approved before creating bids
              </p>
            </>
          ) : (
            <Link href={`/properties/${propertyId}/jobs/${jobId}/bids/new`}>
              <a
                className={clsx(
                  styles.button__submit,
                  isMobile && styles.button__fullwidth
                )}
                data-testid="add-bid-card-btn"
              >
                Add First Bid{' '}
                <span>
                  <AddIcon />
                </span>
              </a>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

JobBidCard.displayName = 'JobBidCard';

export default JobBidCard;

import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import AddIcon from '../../../public/icons/ios/add.svg';
import styles from './styles.module.scss';

interface BidsHeaderModel {
  job: jobModel;
  property: propertyModel;
  bids: Array<bidModel>;
  bidStatus: string;
}

const MetaData: FunctionComponent<{
  bids?: Array<bidModel>;
  bidStatus: string;
}> = ({ bids, bidStatus }) => {
  const totalBids = bids.length;
  const approvedBids = bids.filter((j) => j.state === 'approved').length;
  return (
    <ul className={clsx(styles.header__overview__metadata, '-p-none')}>
      <li data-testid="bid-total-text">
        <span
          className={clsx(styles.header__overview__label)}
          data-testid="bid-total"
        >
          {totalBids}
        </span>
        <div>
          {`Total Bid${totalBids > 1 ? 's' : ''}`}
          {bidStatus === 'loading' && (
            <small
              className={styles.header__overview__labelSub}
              data-testid="bid-total-loading"
            >
              loading...
            </small>
          )}
        </div>
      </li>
      <li data-testid="bid-approved-text">
        <span
          className={clsx(
            styles.header__overview__label,
            '-bgc-alert-secondary'
          )}
          data-testid="bid-approved"
        >
          {approvedBids}
        </span>
        <div>
          Approved
          {bidStatus === 'loading' && (
            <small
              className={styles.header__overview__labelSub}
              data-testid="bid-approved-loading"
            >
              loading...
            </small>
          )}
        </div>
      </li>
    </ul>
  );
};

const Header: FunctionComponent<BidsHeaderModel> = ({
  job,
  property,
  bids,
  bidStatus
}) => {
  const router = useRouter();
  return (
    <>
      <header className={styles.header} data-testid="bidlist-header">
        {/* Title And Create Button */}
        <aside className={styles.header__left}>
          <aside className={styles.header__main}>
            <button
              type="button"
              className={styles.header__backButton}
              onClick={() => router.back()}
              data-testid="property-jobs-back"
            ></button>
            <h1 className={styles.header__title}>
              <span
                className={styles.header__propertyName}
              >{`${property.name}`}</span>
              <span>&nbsp;/ Jobs</span>
              <span className={styles.header__jobTitle}>
                &nbsp;/{` ${job.title}`}
              </span>
              <span>&nbsp;/ Bids</span>
            </h1>
          </aside>
        </aside>
      </header>
      <div className={clsx(styles.header, styles.header__bottom)}>
        <MetaData bids={bids} bidStatus={bidStatus} />

        <aside className={styles.header__controls}>
          <div className={styles.header__item}>
            <Link href={`/properties/${property.id}/jobs/${job.id}/bids/new`}>
              <a
                className={clsx(styles.header__item__createButton)}
                data-testid="job-bid-create"
              >
                Create New Bid
                <span className="iconAddButton">
                  <AddIcon />
                </span>
              </a>
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
};

Header.defaultProps = {};

export default Header;

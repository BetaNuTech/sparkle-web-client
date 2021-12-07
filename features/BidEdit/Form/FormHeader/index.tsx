import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { textColors } from '../../../JobList';
import jobsConfig from '../../../../config/jobs';
import utilString from '../../../../common/utils/string';
import propertyModel from '../../../../common/models/property';
import jobModel from '../../../../common/models/job';
import styles from '../../styles.module.scss';

interface Props {
  isNewBid: boolean;
  isMobile: boolean;
  propertyLink: string;
  property: propertyModel;
  jobLink: string;
  bidLink: string;
  job: jobModel;
  otherBidsText: string;
  jobEditLink: string;
}

const FormHeader: FunctionComponent<Props> = ({
  isNewBid,
  isMobile,
  propertyLink,
  property,
  jobLink,
  bidLink,
  job,
  otherBidsText,
  jobEditLink
}: Props) => {
  if (isNewBid || !isMobile) {
    return null;
  }
  return (
    <div className={styles.bid__info__header__main}>
      <div className={styles.bid__info__header__breadcrumb}>
        <Link href={propertyLink}>
          <a
            className={styles.bid__info__header__breadcrumb__text}
          >{`${property.name}`}</a>
        </Link>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        <Link href={jobLink}>
          <a className={styles.bid__info__header__breadcrumb__text}>Jobs</a>
        </Link>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        <Link href={bidLink}>
          <a className={styles.bid__info__header__breadcrumb__text}>Bids</a>
        </Link>
        {!isNewBid && (
          <span className={styles.bid__info__header__breadcrumb}>
            &nbsp;&nbsp;/&nbsp;&nbsp;Edit
          </span>
        )}
      </div>
      <h1 className={styles.bid__info__header__title}>
        {isNewBid ? 'New Bid' : job.title}
      </h1>
      <aside className={styles.form__extHeader__aside}>
        <span
          className={clsx(
            styles.form__parentStatusLabel,
            textColors[jobsConfig.stateColors[job.state]]
          )}
        >
          {utilString.titleize(job.state)}
        </span>
        <span className={styles.form__parentDetail}>{otherBidsText}</span>
        <Link href={jobEditLink}>
          <a className={styles.form__parentLink}>Edit Job</a>
        </Link>
      </aside>
    </div>
  );
};

FormHeader.displayName = 'FormHeader';

export default FormHeader;

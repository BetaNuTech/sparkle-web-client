import clsx from 'clsx';
import { FunctionComponent } from 'react';
import jobModel from '../../../../../common/models/job';
import Item from '../Item';
import styles from '../styles.module.scss';

interface Props {
  jobs: Array<jobModel>;
  propertyId: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>>;
  title?: string;
  state?: string;
  searchParam?: string;
}

const Section: FunctionComponent<Props> = ({
  title,
  state,
  colors,
  configJobs,
  jobs,
  propertyId,
  searchParam
}) => (
  <li className={styles.jobList__box__listItem} data-testid="job-section-main">
    <header
      className={clsx(
        styles.jobList__box__header,
        colors[configJobs.stateColors[state]]
      )}
      data-testid="job-section-title"
    >
      {title}
    </header>
    {jobs.length > 0 ? (
      <ul className={styles.jobList__category} data-testid="job-section-items">
        {jobs.map((job) => (
          <Item
            key={`${job.id}`}
            job={job}
            propertyId={propertyId}
            colors={colors}
            configJobs={configJobs}
          />
        ))}
      </ul>
    ) : (
      <h3
        className={clsx('-c-gray-light', '-pt-sm', '-pl-sm', '-pb-sm')}
        data-testid="job-section-no-jobs"
      >
        {searchParam ? 'No jobs match query' : 'No jobs present'}
      </h3>
    )}
  </li>
);

export default Section;

import { FunctionComponent } from 'react';
import clsx from 'clsx';
import jobModel from '../../../../common/models/job';
import Item from '../Item';
import styles from '../styles.module.scss';

interface Props {
  title?: string;
  propertyId: string;
  jobs: Array<jobModel>;
  searchParam?: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>>;
  jobState?: string;
}

const Section: FunctionComponent<Props> = ({
  title,
  propertyId,
  jobs,
  searchParam,
  colors,
  configJobs,
  jobState
}) => (
  <li className={styles.propertyJobs__gridTitle} data-testid="job-section-main">
    <header
      className={styles.propertyJobs__gridTitle__head}
      data-testid="job-section-title"
    >
      {title}
      <span
        className={clsx(
          styles.propertyJobs__gridTitle__border,
          colors[configJobs.stateColors[jobState]]
        )}
        data-testid="job-section-title-border"
      ></span>
    </header>
    {jobs.length > 0 ? (
      <ul data-testid="job-section-items">
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
        className={styles.propertyJobs__gridRow__noRecord}
        data-testid="job-section-no-jobs"
      >
        {searchParam ? 'No jobs match query' : 'No jobs present'}
      </h3>
    )}
  </li>
);

export default Section;

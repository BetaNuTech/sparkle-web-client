import { FunctionComponent } from 'react';
import jobModel from '../../../../common/models/job';
import Item from '../Item';
import styles from '../styles.module.scss';

interface Props {
  title?: string;
  propertyId: string;
  jobs: Array<jobModel>;
}

const Section: FunctionComponent<Props> = ({ title, propertyId, jobs }) => (
  <li className={styles.propertyJobs__gridTitle} data-testid="job-section-main">
    <header
      className={styles.propertyJobs__gridTitle__head}
      data-testid="job-section-title"
    >
      {title}
    </header>
    {jobs.length > 0 ? (
      <ul data-testid="job-section-items">
        {jobs.map((job) => (
          <Item key={`${job.id}`} job={job} propertyId={propertyId} />
        ))}
      </ul>
    ) : (
      <h3
        className={styles.propertyJobs__gridRow__noRecord}
        data-testid="job-section-no-jobs"
      >
        No jobs present
      </h3>
    )}
  </li>
);

export default Section;

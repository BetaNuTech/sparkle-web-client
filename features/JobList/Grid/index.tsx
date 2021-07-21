import { FunctionComponent } from 'react';
import jobModel from '../../../common/models/job';
import useJobSections from '../hooks/useJobSections';
import GridHeader from './GridHeader';
import Sections from './Sections';
import styles from './styles.module.scss';

interface Props {
  jobs: Array<jobModel>;
  propertyId: string;
}

const Grid: FunctionComponent<Props> = ({ jobs, propertyId }) => {
  const { sections } = useJobSections(jobs);
  const hasNoJobs = sections.filter((s) => s.jobs.length > 0).length === 0;
  return (
    <div className={styles.propertyJobs__grid} data-testid="joblist-grid-main">
      {hasNoJobs ? (
        <h3 className="-c-gray-light" data-testid="job-sections-no-jobs">Property has no open jobs</h3>
      ) : (
        <>
          {' '}
          <GridHeader />
          <div className={styles.jobList__box} data-testid="job-sections-main">
            <ul className={styles.jobList__box__list}>
              {sections.map((s) => (
                <Sections
                  key={s.title}
                  title={s.title}
                  jobs={s.jobs}
                  propertyId={propertyId}
                />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Grid;

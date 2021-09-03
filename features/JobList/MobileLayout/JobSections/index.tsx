import { FunctionComponent } from 'react';
import jobModel from '../../../../common/models/job';
import Section from './Section';
import useJobSections from '../../hooks/useJobSections';
import styles from './styles.module.scss';

interface Props {
  jobs: Array<jobModel>;
  propertyId: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>>;
  searchParam?: string;
  forceVisible?: boolean;
}

const JobSections: FunctionComponent<Props> = ({
  jobs,
  propertyId,
  colors,
  configJobs,
  searchParam,
  forceVisible
}) => {
  const { sections } = useJobSections(jobs, '');

  return (
    <div className={styles.jobList__box} data-testid="job-sections-main-mobile">
      <ul className={styles.jobList__box__list}>
        {sections.map((s) => (
          <Section
            key={s.title}
            title={s.title}
            state={s.state}
            jobs={s.jobs}
            propertyId={propertyId}
            colors={colors}
            configJobs={configJobs}
            searchParam={searchParam}
            forceVisible={forceVisible}
          />
        ))}
      </ul>
    </div>
  );
};

JobSections.defaultProps = {
  forceVisible: false
};

export default JobSections;

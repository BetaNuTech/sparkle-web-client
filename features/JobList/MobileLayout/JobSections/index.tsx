import { FunctionComponent, RefObject } from 'react';
import jobModel from '../../../../common/models/job';
import Section from './Section';
import useJobSections from '../../hooks/useJobSections';
import styles from './styles.module.scss';
import { ClearSearchAction } from '../../../../common/SearchBar';

interface Props {
  jobs: Array<jobModel>;
  propertyId: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>>;
  searchParam?: string;
  forceVisible?: boolean;
  scrollElementRef: RefObject<HTMLDivElement>;
  onClearSearch(): void;
}

const JobSections: FunctionComponent<Props> = ({
  jobs,
  propertyId,
  colors,
  configJobs,
  searchParam,
  forceVisible,
  scrollElementRef,
  onClearSearch
}) => {
  const { sections } = useJobSections(jobs, '');

  return (
    <div
      className={styles.jobList__box}
      data-testid="job-sections-main-mobile"
      ref={scrollElementRef}
    >
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
      <ClearSearchAction
        searchQuery={searchParam}
        onClearSearch={onClearSearch}
      />
    </div>
  );
};

JobSections.defaultProps = {
  forceVisible: false
};

export default JobSections;

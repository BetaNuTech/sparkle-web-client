import { FunctionComponent } from 'react';
import jobModel from '../../../common/models/job';
import useJobSections from '../hooks/useJobSections';
import GridHeader from './GridHeader';
import Sections from './Sections';
import styles from './styles.module.scss';

interface Props {
  jobs: Array<jobModel>;
  propertyId: string;
  colors: Record<string, string>;
  configJobs: Record<string, Record<string, string>| any>;
  onSortChange?(sortKey: string): void;
  onSearchKeyDown?(ev: React.KeyboardEvent<HTMLInputElement>): void;
  sortBy?: string;
  sortDir?: string;
  searchParam?: string;
  filterState?: string;
  forceVisible?: boolean;
}

const Grid: FunctionComponent<Props> = ({
  jobs,
  propertyId,
  onSortChange,
  sortBy,
  sortDir,
  searchParam,
  onSearchKeyDown,
  colors,
  configJobs,
  filterState,
  forceVisible
}) => {
  const { sections } = useJobSections(jobs, filterState);
  const hasNoJobs = sections.filter((s) => s.jobs.length > 0).length === 0;

  return (
    <div className={styles.propertyJobs__grid} data-testid="joblist-grid-main">
      {hasNoJobs && !searchParam ? (
        <h3 className="-c-gray-light" data-testid="job-sections-no-jobs">
          Property has no open jobs
        </h3>
      ) : (
        <>
          {' '}
          <GridHeader
            onSortChange={onSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
            searchParam={searchParam}
            onSearchKeyDown={onSearchKeyDown}
          />
          <div className={styles.jobList__box} data-testid="job-sections-main">
            <ul className={styles.jobList__box__list}>
              {sections.map((s) => (
                <Sections
                  key={s.title}
                  title={s.title}
                  jobs={s.jobs}
                  propertyId={propertyId}
                  searchParam={searchParam}
                  colors={colors}
                  configJobs={configJobs}
                  jobState={s.state}
                  forceVisible={forceVisible}
                />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

Grid.defaultProps = {
  forceVisible: false
};

export default Grid;

import { FunctionComponent } from 'react';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import useBidSections from '../hooks/useBidSections';
import GridHeader from './GridHeader';
import Sections from './Sections';
import styles from './styles.module.scss';

interface Props {
  job: jobModel;
  bids: Array<bidModel>;
  onSortChange?(sortKey: string): void;
  sortBy?: string;
  sortDir?: string;
  propertyId: string;
  colors: Record<string, string>;
  configBids: Record<string, Record<string, string>>;
  filterState?: string;
  forceVisible?: boolean;
}

const Grid: FunctionComponent<Props> = ({
  job,
  bids,
  onSortChange,
  sortBy,
  sortDir,
  propertyId,
  colors,
  configBids,
  filterState,
  forceVisible
}) => {
  const { sections } = useBidSections(bids, filterState);
  const hasNoBids = sections.filter((s) => s.bids.length > 0).length === 0;

  return (
    <div
      className={styles.propertyJobBids__grid}
      data-testid="bidlist-grid-main"
    >
      {hasNoBids ? (
        <h3 className="-c-gray-light" data-testid="bid-sections-no-bids">
          Job has no bids
        </h3>
      ) : (
        <>
          {' '}
          <GridHeader
            onSortChange={onSortChange}
            sortBy={sortBy}
            sortDir={sortDir}
          />
          <div data-testid="bid-sections-main">
            <ul>
              {sections.map((s) => (
                <Sections
                  key={s.title}
                  title={s.title}
                  bids={s.bids}
                  job={job}
                  propertyId={propertyId}
                  colors={colors}
                  configBids={configBids}
                  bidState={s.state}
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

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
  propertyId: string;
  colors: Record<string, string>;
  configBids: Record<string, Record<string, string>>;
}

const Grid: FunctionComponent<Props> = ({
  job,
  bids,
  propertyId,
  colors,
  configBids
}) => {
  const { sections } = useBidSections(bids);
  const hasNoBids = sections.filter((s) => s.bids.length > 0).length === 0;

  return (
    <div className={styles.propertyJobBids__grid} data-testid="bidlist-grid-main">
      {hasNoBids ? (
        <h3 className="-c-gray-light" data-testid="bid-sections-no-bids">
          Job has no bids
        </h3>
      ) : (
        <>
          {' '}
          <GridHeader />
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

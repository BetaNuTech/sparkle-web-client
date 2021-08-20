import { FunctionComponent } from 'react';
import jobModel from '../../../../common/models/job';
import bidModel from '../../../../common/models/bid';
import useBidSections from '../../hooks/useBidSections';
import Section from './Section';
import styles from './styles.module.scss';

interface Props {
  job: jobModel;
  bids: Array<bidModel>;
  propertyId: string;
  colors: Record<string, string>;
  configBids: Record<string, Record<string, string>>;
  searchParam?: string;
}

const BidSections: FunctionComponent<Props> = ({
  job,
  bids,
  propertyId,
  colors,
  configBids
}) => {
  const { sections } = useBidSections(bids, '');
  return (
    <div className={styles.bidList__box} data-testid="bid-sections-main-mobile">
      <ul className={styles.bidList__box__list}>
        {sections.map((s) => (
          <Section
            key={s.title}
            title={s.title}
            state={s.state}
            job={job}
            bids={s.bids}
            propertyId={propertyId}
            colors={colors}
            configBids={configBids}
          />
        ))}
      </ul>
    </div>
  );
};

export default BidSections;

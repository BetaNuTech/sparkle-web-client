import { FunctionComponent, RefObject } from 'react';
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
  forceVisible?: boolean;
  scrollElementRef: RefObject<HTMLDivElement>;
}

const BidSections: FunctionComponent<Props> = ({
  job,
  bids,
  propertyId,
  colors,
  configBids,
  forceVisible,
  scrollElementRef
}) => {
  const { sections } = useBidSections(bids, '');
  return (
    <div
      className={styles.bidList__box}
      data-testid="bid-sections-main-mobile"
      ref={scrollElementRef}
    >
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
            forceVisible={forceVisible}
          />
        ))}
      </ul>
    </div>
  );
};

BidSections.defaultProps = {
  forceVisible: false
};

export default BidSections;

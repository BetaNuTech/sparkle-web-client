import { render, screen } from '@testing-library/react';
import { openImprovementJob } from '../../../__mocks__/jobs';
import bids, { approvedBid, openBid } from '../../../__mocks__/bids';
import deepClone from '../../../__tests__/helpers/deepClone';
import stubIntersectionObserver from '../../../__tests__/helpers/stubIntersectionObserver';
import configBids from '../../../config/bids';
import { colors } from '../index';
import BidSections from './index';

describe('Unit | Features | Job Bid List | Grid', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should have title for each section', () => {
    const props = {
      job: openImprovementJob,
      bids,
      propertyId: 'property-1',
      colors,
      configBids
    };
    render(<BidSections {...props} />);

    const bidSection = screen.queryAllByTestId('bid-section-title');

    expect(bidSection.length).toEqual(3);
  });

  it('should add bids with different states in different sections', () => {
    const props = {
      job: openImprovementJob,
      bids,
      propertyId: 'property-1',
      colors,
      configBids
    };
    render(<BidSections {...props} />);

    const bidRecord = screen.queryAllByTestId('bid-item-record');

    expect(bidRecord.length).toEqual(3);
  });

  it('should have no bids message present for states that contains no bids', () => {
    const props = {
      job: openImprovementJob,
      bids: [openBid, approvedBid],
      propertyId: 'property-1',
      colors,
      configBids
    };
    render(<BidSections {...props} />);

    const bidNoTitle = screen.queryAllByTestId('bid-section-no-bids');

    expect(bidNoTitle.length).toEqual(2);
  });

  it('should show no bids message for job if no bids exist for job', () => {
    const props = {
      job: openImprovementJob,
      bids: [],
      propertyId: 'property-1',
      colors,
      configBids
    };
    render(<BidSections {...props} />);

    const noBidTitle = screen.queryByTestId('bid-sections-no-bids');
    const bidSectionMain = screen.queryByTestId('bid-sections-main');

    expect(noBidTitle).toBeTruthy();
    expect(bidSectionMain).toBeNull();
  });

  it('should add configured section header color', () => {
    const props = {
      job: openImprovementJob,
      bids,
      propertyId: 'property-1',
      colors,
      configBids: deepClone({
        ...configBids,
        ...{
          stateColors: {
            open: 'secondary',
            approved: 'gray',
            rejected: 'alert',
            incomplete: 'primary',
            complete: 'orange'
          }
        }
      })
    };

    render(<BidSections {...props} />);

    const bidSectionTitle = screen.queryAllByTestId('bid-section-title');
    const titleClasses = bidSectionTitle.map((title) => ({
      [title.textContent]: title.firstElementChild.classList
    }));

    expect(titleClasses[0].Open).toContain(colors.secondary);
    expect(titleClasses[1].Rejected).toContain(colors.alert);
    expect(titleClasses[2].Incomplete).toContain(colors.primary);
  });
});

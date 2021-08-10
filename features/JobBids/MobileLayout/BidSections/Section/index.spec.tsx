import { render, screen } from '@testing-library/react';
import { openBid, approvedBid } from '../../../../../__mocks__/bids';
import { openImprovementJob } from '../../../../../__mocks__/jobs';
import configBids from '../../../../../config/bids';
import { colors } from '../../../index';
import Section from './index';

describe('Unit | Features | Job Bid List | Mobile Layout | Bid Sections | Section', () => {
  it('should match title of the section', () => {
    const props = {
      title: 'my section',
      propertyId: 'property-1',
      job: openImprovementJob,
      bids: [openBid, approvedBid],
      colors,
      configBids
    };
    render(<Section {...props} />);

    const jobTitle = screen.queryByTestId('bid-section-title');

    expect(jobTitle.textContent).toEqual('my section');
  });

  it('should render all the items in the bid section', () => {
    const props = {
      title: 'my section',
      propertyId: 'property-1',
      job: openImprovementJob,
      bids: [openBid, approvedBid],
      colors,
      configBids
    };
    render(<Section {...props} />);

    const sectionRecords = screen.queryAllByTestId('bid-item-record');

    expect(sectionRecords.length).toEqual(2);
  });

  it('should render no bid state text if no bids present', () => {
    const props = {
      title: 'my section',
      propertyId: 'property-1',
      job: openImprovementJob,
      bids: [],
      colors,
      configBids
    };
    render(<Section {...props} />);

    const sectionItem = screen.queryByTestId('bid-section-items');
    const sectionNoBids = screen.queryByTestId('bid-section-no-bids');

    expect(sectionItem).toBeNull();
    // Should show no bid
    expect(sectionNoBids).toBeTruthy();
  });
});

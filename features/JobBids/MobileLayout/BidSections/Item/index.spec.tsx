import { render, screen } from '@testing-library/react';
import { openImprovementJob } from '../../../../../__mocks__/jobs';
import { openBid } from '../../../../../__mocks__/bids';
import deepClone from '../../../../../__tests__/helpers/deepClone';
import utilString from '../../../../../common/utils/string';
import Item from './index';

describe('Unit | Features | Job Bid List | Mobile Layout | Bid Sections | Item', () => {
  it('should show bid value with fixed cost', () => {
    const props = {
      job: deepClone(openImprovementJob),
      bid: deepClone(openBid),
      propertyId: 'property-1'
    };
    props.bid.costMax = 3500;

    const expected = `$ ${utilString.getFormattedCurrency(props.bid.costMin)}`;

    render(<Item {...props} />);

    const jobTypeText = screen.queryByTestId('mobile-row-bid-range');

    expect(jobTypeText.textContent).toEqual(expected);
  });

  it('should show bid value with range cost', () => {
    const props = {
      job: deepClone(openImprovementJob),
      bid: deepClone(openBid),
      propertyId: 'property-1'
    };

    const expected = `$ ${utilString.getFormattedCurrency(
      props.bid.costMin
    )} - ${utilString.getFormattedCurrency(props.bid.costMax)}`;

    render(<Item {...props} />);

    const jobTypeText = screen.queryByTestId('mobile-row-bid-range');

    expect(jobTypeText.textContent).toEqual(expected);
  });
});

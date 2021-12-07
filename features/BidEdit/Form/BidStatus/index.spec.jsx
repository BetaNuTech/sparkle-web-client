import { render, screen } from '@testing-library/react';
import utilString from '../../../../common/utils/string';
import BidStatus from './index';

describe('Unit | Features | Bid Edit | Form | Bid Status', () => {
  it('should show bid status if its not new bid with correct state', async () => {
    const expected = 'open';
    const props = {
      isNewBid: false,
      isMobile: false,
      bidState: expected,
      nextState: ''
    };

    render(<BidStatus {...props} />);

    const bidStatus = screen.queryByTestId('bid-form-edit-state');

    expect(bidStatus).toBeTruthy();
    expect(bidStatus).toHaveTextContent(utilString.titleize(expected));
  });

  it('should show required status and render correct next state if its not new bid have next status', async () => {
    const expected = 'Approval';
    const props = {
      isNewBid: false,
      isMobile: false,
      bidState: 'open',
      nextState: expected
    };

    render(<BidStatus {...props} />);

    const bidNextStatus = screen.queryByTestId('bid-form-edit-nextstatus');

    expect(bidNextStatus).toBeTruthy();
    expect(bidNextStatus).toHaveTextContent(expected);
  });

  it('should not show bid status and reqiured status if its new bid', async () => {
    const props = {
      isNewBid: true,
      isMobile: false,
      bidState: '',
      nextState: ''
    };

    render(<BidStatus {...props} />);

    const bidFormStatus = screen.queryByTestId('bid-form-edit-state');
    const bidNextStatus = screen.queryByTestId('bid-form-edit-nextstatus');

    expect(bidFormStatus).toBeNull();
    expect(bidNextStatus).toBeNull();
  });
});

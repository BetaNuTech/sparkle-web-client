import { render, screen } from '@testing-library/react';
import utilString from '../../../../../common/utils/string';
import JobInfo from './index';

describe('Unit | Features | Bid Edit | Form | Job Info', () => {
  it('should show correct status', async () => {
    const expected = 'approved';
    const props = {
      jobEditLink: '',
      otherBidsText: '',
      jobState: expected
    };

    render(<JobInfo {...props} />);

    const jobInfoStatus = screen.queryByTestId('bid-form-edit-job-info');

    expect(jobInfoStatus).toBeTruthy();
    expect(jobInfoStatus).toHaveTextContent(utilString.titleize(expected));
  });

  it('should show correct other bid text and have correct link', async () => {
    const otherBidsText = '15 other bids';
    const jobEditLink = 'http://google.com';
    const props = {
      jobState: '',
      jobEditLink,
      otherBidsText
    };

    render(<JobInfo {...props} />);

    const jobInfoOtherBidText = screen.queryByTestId(
      'bid-form-edit-job-otherBidText'
    );
    const jobInfoEditJobLink = screen.queryByTestId('bid-form-edit-job-link');

    expect(jobInfoOtherBidText).toHaveTextContent(otherBidsText);
    expect(jobInfoEditJobLink).toHaveAttribute('href', jobEditLink);
  });
});

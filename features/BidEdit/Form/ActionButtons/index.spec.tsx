import sinon from 'sinon';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { approvedBid, } from '../../../../__mocks__/bids';
import ActionButtons from './index';

describe('Unit | Features | Bid Edit | Form | Action Buttons', () => {
  it('should not show complete button for bid if job not in authorized state or not in approved state', async () => {
    const props = {
      isNewBid: false,
      approvedCompletedBid: approvedBid,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSubmit: () => {},
      approvedBidLink: '',
      canMarkComplete: false,
      canMarkIncomplete: false,
      canReject: false,
      canReopen: false,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const btnComplete = screen.queryByTestId('bid-form-complete-bid');

    expect(btnComplete).toBeNull();
  });

  it('should show complete button for bid if job  in authorized state or in approved state', async () => {
    const props = {
      isNewBid: false,
      approvedCompletedBid: approvedBid,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSubmit: () => {},
      approvedBidLink: '',
      canMarkComplete: true,
      canMarkIncomplete: false,
      canReject: false,
      canReopen: false,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const btnComplete = screen.queryByTestId('bid-form-complete-bid');

    expect(btnComplete).toBeTruthy();
  });

  it('should not show approved bid message and should enable approve button', async () => {
    const props = {
      isNewBid: false,
      approvedCompletedBid: null,
      isApprovedOrComplete: false,
      canApprove: true,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: true,
      isMobile: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSubmit: () => {},
      approvedBidLink: '',
      canMarkComplete: true,
      canMarkIncomplete: false,
      canReject: false,
      canReopen: false,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const spanApprovedMsg = screen.queryByTestId('bid-approved-msg');
    const btnApprove = screen.queryByTestId('bid-form-approve');

    expect(btnApprove).not.toHaveAttribute('disabled');
    expect(spanApprovedMsg).toBeNull();
  });

  it('should show approved bid message and should hide approve button', async () => {
    const props = {
      isNewBid: false,
      approvedCompletedBid: approvedBid,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSubmit: () => {},
      approvedBidLink: '',
      canMarkComplete: false,
      canMarkIncomplete: false,
      canReject: false,
      canReopen: false,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const spanApprovedMsg = screen.queryByTestId('bid-approved-msg');
    const btnApprove = screen.queryByTestId('bid-form-approve');

    expect(btnApprove).toBeNull();
    expect(spanApprovedMsg).toBeTruthy();
  });

  it('should request to transition bid to complete when complete button selected', async () => {
    const submitReq = sinon.spy();
    const expected = 'complete';
    const props = {
      isNewBid: false,
      approvedCompletedBid: approvedBid,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: false,
      onSubmit: submitReq,
      approvedBidLink: '',
      canMarkComplete: true,
      canMarkIncomplete: false,
      canReject: false,
      canReopen: false,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    await act(async () => {
      const btnComplete = screen.queryByTestId('bid-form-complete-bid');
      await userEvent.click(btnComplete);
    });

    // Send update request
    const result = submitReq.called ? submitReq.getCall(0).args[0] : {};
    expect(result).toEqual(expected);
  });

  it('should show reopen button when bid is in rejected state', async () => {
    const submitReq = sinon.spy();
    const props = {
      isNewBid: false,
      approvedCompletedBid: null,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: false,
      onSubmit: submitReq,
      approvedBidLink: '',
      canMarkComplete: false,
      canMarkIncomplete: false,
      canReject: false,
      canReopen: true,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const btnReopen = screen.queryByTestId('bid-form-reopen-bid');

    // Check if the elements are present
    expect(btnReopen).toBeTruthy();
  });

  it('should show incomplete, reject button when bid is in approved state', async () => {
    const submitReq = sinon.spy();
    const props = {
      isNewBid: false,
      approvedCompletedBid: null,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: false,
      onSubmit: submitReq,
      approvedBidLink: '',
      canMarkComplete: false,
      canMarkIncomplete: true,
      canReject: true,
      canReopen: false,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const btnIncomplete = screen.queryByTestId('bid-form-incomplete-bid');
    const btnReject = screen.queryByTestId('bid-form-reject-bid');

    // Check if the elements are present
    expect(btnIncomplete).toBeTruthy();
    expect(btnReject).toBeTruthy();
  });

  it('should show permission message and disable disable approve button ', async () => {
    const submitReq = sinon.spy();
    const props = {
      isNewBid: false,
      approvedCompletedBid: null,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: false,
      onSubmit: submitReq,
      approvedBidLink: '',
      canMarkComplete: false,
      canMarkIncomplete: true,
      canReject: true,
      canReopen: false,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const bidApprovePermissionMsg = screen.queryByTestId(
      'bid-approve-permisson'
    );
    const btnApprove = screen.queryByTestId('bid-form-approve');

    // Check if the elements are present
    expect(bidApprovePermissionMsg).toBeTruthy();
    expect(btnApprove).toBeDisabled();
  });

  it('should show save button if its new bid ', async () => {
    const submitReq = sinon.spy();
    const props = {
      isNewBid: true,
      approvedCompletedBid: null,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: false,
      onSubmit: submitReq,
      approvedBidLink: '',
      canMarkComplete: false,
      canMarkIncomplete: true,
      canReject: true,
      canReopen: false,
      showSaveButton: true,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const btnSave = screen.queryByTestId(
      'bid-form-submit'
    );

    // Check if the elements are present
    expect(btnSave).toBeTruthy();
  });

  it('should show cancel button on mobile ', async () => {
    const submitReq = sinon.spy();
    const props = {
      isNewBid: false,
      approvedCompletedBid: null,
      isApprovedOrComplete: false,
      canApprove: false,
      isLoading: false,
      isOnline: true,
      canApproveEnabled: false,
      isMobile: true,
      onSubmit: submitReq,
      approvedBidLink: '',
      canMarkComplete: false,
      canMarkIncomplete: true,
      canReject: true,
      canReopen: false,
      showSaveButton: false,
      bidLink: ''
    };

    render(<ActionButtons {...props} />);

    const btnCancel = screen.queryByTestId(
      'mobile-form-cancel'
    );

    // Check if the elements are present
    expect(btnCancel).toBeTruthy();
  });
});

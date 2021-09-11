import sinon from 'sinon';
import {
  render as rtlRender,
  screen,
  fireEvent,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import { authorizedImprovementJob, openImprovementJob } from '../../../__mocks__/jobs';
import { fullProperty } from '../../../__mocks__/properties';
import { approvedBid, openBid, rejectedBid } from '../../../__mocks__/bids';
import { admin as user } from '../../../__mocks__/users';
import breakpoints from '../../../config/breakpoints';
import BidEditForm from './index';

function render(ui: any, options: any = {}) {
  sinon.restore();

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: contextWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

const apiState = {
  isLoading: false,
  statusCode: 0,
  response: {}
};

describe('Unit | Features | Bid Edit | Form', () => {
  it('should show error message when approved bid has empty vendor and other required details', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: approvedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const formVendor = screen.queryByTestId('bid-form-vendor');
      const formCostMin = screen.queryByTestId('bid-form-cost-min');
      const formStartAt = screen.queryByTestId('bid-form-start-at');
      const formCompleteAt = screen.queryByTestId('bid-form-complete-at');
      // Set empty value
      await fireEvent.change(formVendor, { target: { value: '' } });
      await fireEvent.change(formCostMin, { target: { value: '' } });
      await fireEvent.change(formStartAt, { target: { value: '' } });
      await fireEvent.change(formCompleteAt, { target: { value: '' } });
    });

    const errorTitle = screen.queryByTestId('error-label-vendor');
    const errorCostMin = screen.queryByTestId('error-label-costMin');
    const errorStartAt = screen.queryByTestId('error-label-startAt');
    const errorCompleteAt = screen.queryByTestId('error-label-completeAt');

    // It should be true because error message will come as they are required
    expect(errorTitle).toBeTruthy();
    expect(errorCostMin).toBeTruthy();
    expect(errorStartAt).toBeTruthy();
    expect(errorCompleteAt).toBeTruthy();
  });

  it('should show error message when cost min is more than cost max ', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: approvedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    const { container } = render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const formCostMin = screen.queryByTestId('bid-form-cost-min');
      const formCostMax = screen.queryByTestId('bid-form-cost-max');
      const btnRange = container.querySelector('[id=btnRange]');
      // Set range cost
      await userEvent.click(btnRange);
      // Set empty value
      await fireEvent.change(formCostMin, { target: { value: '3000' } });
      await fireEvent.change(formCostMax, { target: { value: '2000' } });
    });

    const errorCostMin = screen.queryByTestId('error-label-costMin');

    // It should be true because error message will come as they are required
    expect(errorCostMin).toBeTruthy();
  });

  it('should show error message when cost max is less than cost min ', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: approvedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    const { container } = render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const formCostMin = screen.queryByTestId('bid-form-cost-min');
      const formCostMax = screen.queryByTestId('bid-form-cost-max');
      const btnRange = container.querySelector('[id=btnRange]');
      // Set range cost
      await userEvent.click(btnRange);
      // Set empty value
      await fireEvent.change(formCostMin, { target: { value: '3000' } });
      await fireEvent.change(formCostMax, { target: { value: '2000' } });
    });

    const errorCostMax = screen.queryByTestId('error-label-costMax');

    // It should be true because error message will come as they are required
    expect(errorCostMax).toBeTruthy();
  });

  it('should show error message when start date is more than complete date ', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: approvedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const formStartAt = screen.queryByTestId('bid-form-start-at');
      const formCompleteAt = screen.queryByTestId('bid-form-complete-at');
      // Set empty value
      await fireEvent.change(formCompleteAt, {
        target: { value: '2021-07-16' }
      });
      await fireEvent.change(formStartAt, { target: { value: '2021-07-19' } });
    });

    const errorStartAt = screen.queryByTestId('error-label-startAt');

    // It should be true because error message will come as they are required
    expect(errorStartAt).toBeTruthy();
  });

  it('should show error message when complete date is less than start date ', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: approvedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const formStartAt = screen.queryByTestId('bid-form-start-at');
      const formCompleteAt = screen.queryByTestId('bid-form-complete-at');
      // Set empty value
      await fireEvent.change(formStartAt, { target: { value: '2021-07-19' } });
      await fireEvent.change(formCompleteAt, {
        target: { value: '2021-07-16' }
      });
    });

    const errorCompleteAt = screen.queryByTestId('error-label-completeAt');

    // It should be true because error message will come as they are required
    expect(errorCompleteAt).toBeTruthy();
  });

  it('should show approve button when bid is in open state', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: openBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const btnApprove = screen.queryByTestId('bid-form-approve');

    // Check if the elements are present
    expect(btnApprove).toBeTruthy();
  });

  it('should show incomplete, reject button when bid is in approved state', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: approvedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const btnIncomplete = screen.queryByTestId('bid-form-incomplete-bid');
    const btnReject = screen.queryByTestId('bid-form-reject-bid');

    // Check if the elements are present
    expect(btnIncomplete).toBeTruthy();
    expect(btnReject).toBeTruthy();
  });

  it('should show reopen button when bid is in rejected state', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: rejectedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const btnReopen = screen.queryByTestId('bid-form-reopen-bid');

    // Check if the elements are present
    expect(btnReopen).toBeTruthy();
  });

  it('should request to transition bid to complete when complete button selected', async () => {
    const putReq = sinon.spy();
    const expected = 'complete';
    const props = {
      job: authorizedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: approvedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: putReq,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onFileChange: () => {},
      storageState: {
        isLoading: false,
        error: false,
        uploaded: false,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileType: null
      },
      attachmentState: { isLoading: false, error: false },
      otherBids: []
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const btnComplete = screen.queryByTestId('bid-form-complete-bid');
      await userEvent.click(btnComplete);
    });

    // Send update request
    const result = putReq.called ? putReq.getCall(0).args[3] : {};
    const actual = result.state || '';
    expect(actual).toEqual(expected);
  });

  it('should not show complete button for bid if job not in authorized state', async () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewBid: false,
      user,
      bid: approvedBid,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postBidCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putBidUpdate: () => {},
      otherBids: []
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const btnComplete = screen.queryByTestId('bid-form-complete-bid');

    expect(btnComplete).toBeNull();
  });
});

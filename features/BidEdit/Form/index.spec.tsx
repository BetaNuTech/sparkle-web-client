import sinon from 'sinon';
import {
  render as rtlRender,
  screen,
  fireEvent,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import { openImprovementJob } from '../../../__mocks__/jobs';
import { fullProperty } from '../../../__mocks__/properties';
import { approvedBid } from '../../../__mocks__/bids';
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
      putBidUpdate: () => {}
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const formVendor = screen.queryByTestId('bid-form-vendor');
      const formCostMin = screen.queryByTestId('bid-form-cost-min');
      const formCostMax = screen.queryByTestId('bid-form-cost-max');
      const formStartAt = screen.queryByTestId('bid-form-start-at');
      const formCompleteAt = screen.queryByTestId('bid-form-complete-at');
      // Set empty value
      await fireEvent.change(formVendor, { target: { value: '' } });
      await fireEvent.change(formCostMin, { target: { value: '' } });
      await fireEvent.change(formCostMax, { target: { value: '' } });
      await fireEvent.change(formStartAt, { target: { value: '' } });
      await fireEvent.change(formCompleteAt, { target: { value: '' } });
    });

    const errorTitle = screen.queryByTestId('error-label-vendor');
    const errorCostMin = screen.queryByTestId('error-label-costMin');
    const errorCostMax = screen.queryByTestId('error-label-costMax');
    const errorStartAt = screen.queryByTestId('error-label-startAt');
    const errorCompleteAt = screen.queryByTestId('error-label-completeAt');

    // It should be true because error message will come as they are required
    expect(errorTitle).toBeTruthy();
    expect(errorCostMin).toBeTruthy();
    expect(errorCostMax).toBeTruthy();
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
      putBidUpdate: () => {}
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
      putBidUpdate: () => {}
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
      putBidUpdate: () => {}
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const formStartAt = screen.queryByTestId('bid-form-start-at');
      const formCompleteAt = screen.queryByTestId('bid-form-complete-at');
      // Set empty value
      await fireEvent.change(formCompleteAt, { target: { value: '2021-07-16' } });
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
      putBidUpdate: () => {}
    };

    render(<BidEditForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      const formStartAt = screen.queryByTestId('bid-form-start-at');
      const formCompleteAt = screen.queryByTestId('bid-form-complete-at');
      // Set empty value
      await fireEvent.change(formStartAt, { target: { value: '2021-07-19' } });
      await fireEvent.change(formCompleteAt, { target: { value: '2021-07-16' } });
    });

    const errorCompleteAt = screen.queryByTestId('error-label-completeAt');

    // It should be true because error message will come as they are required
    expect(errorCompleteAt).toBeTruthy();
  });
});

import sinon from 'sinon';
import {
  render as rtlRender,
  act,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import mockBids from '../../../../__mocks__/bids';
import { openImprovementJob } from '../../../../__mocks__/jobs';
import BidEdit from '../../../../features/BidEdit';
import BidErrors from '../../../../features/BidEdit/Form/errors';
import propertiesApi, {
  propertyResult
} from '../../../../common/services/firestore/properties';
import jobsStore, {
  jobResult
} from '../../../../common/services/firestore/jobs';
import bidsApi, {
  bidsCollectionResult
} from '../../../../common/services/firestore/bids';
import bidServiceApi from '../../../../common/services/api/bids';
import storageApi from '../../../../common/services/storage';
import errorReports from '../../../../common/services/api/errorReports';
import uploadAttachmentService from '../../../../features/BidEdit/services/uploadAttachment';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';

function render(ui: any, options: any = {}) {
  sinon.restore();
  // Stub all properties requests
  const propertyPayload: propertyResult = {
    status: options.propertyStatus || 'success',
    error: options.propertyError || null,
    data: options.property || (!options.propertyStatus && fullProperty)
  };
  sinon.stub(propertiesApi, 'findRecord').returns(propertyPayload);

  // Stub job details
  const jobPayload: jobResult = {
    status: options.jobStatus || 'success',
    error: options.jobError || null,
    data: options.job || (!options.jobStatus && openImprovementJob)
  };
  sinon.stub(jobsStore, 'findRecord').returns(jobPayload);

  // Stub bid
  const bidsPayload: bidsCollectionResult = {
    status: options.bidStatus || 'success',
    error: options.bidError || null,
    data: options.bids || (!options.bidStatus && mockBids)
  };
  sinon.stub(bidsApi, 'queryByJob').returns(bidsPayload);

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ResponsiveContext.Provider value={{ width: contextWidth }}>
        {ui}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </ResponsiveContext.Provider>
    </FirebaseAppProvider>,
    options
  );
}

describe('Integration | Features | Bid Edit', () => {
  it('shows loading text until the property is loaded', () => {
    const expected = 'Loading Bid';

    render(
      <BidEdit
        user={user}
        bidId="bid-1"
        propertyId="property-1"
        jobId="job-1"
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth,
        propertyStatus: 'loading'
      }
    );
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeTruthy();
    expect(loaderText.textContent).toEqual(expected);
  });

  it('shows loading text until the bid is loaded', () => {
    const expected = 'Loading Bid';

    render(
      <BidEdit
        user={user}
        bidId="bid-1"
        propertyId="property-1"
        jobId="job-1"
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth,
        bids: [],
        bidStatus: 'loading'
      }
    );
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeTruthy();
    expect(loaderText.textContent).toEqual(expected);
  });

  it('should not show loading text after property and bid have loaded', () => {
    render(
      <BidEdit
        user={user}
        bidId="bid-1"
        propertyId="property-1"
        jobId="job-1"
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeNull();
  });

  it('checks that empty vendor name validation error shows when form submits', async () => {
    render(
      <BidEdit
        user={user}
        bidId="new"
        propertyId="property-1"
        jobId="job-1"
        isOnline
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    await act(async () => {
      // Form submit button
      const [submit] = await screen.findAllByTestId('bid-form-submit');
      await userEvent.click(submit);
    });

    const formErrorVendor = screen.queryByTestId(
      'error-label-vendor'
    ) as HTMLElement;

    // Vendor error message
    expect(formErrorVendor).toBeTruthy();

    const expectedTitle = BidErrors.vendorRequired;
    const actualTitle = formErrorVendor.textContent;

    // Check the error message matches
    expect(actualTitle).toEqual(expectedTitle);
  });

  it('Publishes a new bid when it does not exist yet', async () => {
    const expected = true;
    render(
      <BidEdit
        user={user}
        bidId="new"
        propertyId="property-1"
        jobId="job-1"
        isOnline
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    const postReq = sinon.stub(bidServiceApi, 'createNewBid').resolves({});

    await act(async () => {
      const [submit] = await screen.findAllByTestId('bid-form-submit');
      const vendorInput = await screen.findByTestId('bid-form-vendor');
      await fireEvent.change(vendorInput, {
        target: { value: 'Matt Co. Works' }
      });
      await userEvent.click(submit);
    });

    const actual = postReq.called;
    expect(actual).toEqual(expected);
  });

  it('Updates a bid when it already exists', async () => {
    const expected = true;
    render(
      <BidEdit
        user={user}
        bidId="bid-1"
        propertyId="property-1"
        jobId="job-1"
        isOnline
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    const putReq = sinon.stub(bidServiceApi, 'updateBid').resolves({});

    await act(async () => {
      const [submit] = await screen.findAllByTestId('bid-form-submit');
      const vendorInput = await screen.findByTestId('bid-form-vendor');
      await fireEvent.change(vendorInput, {
        target: { value: 'Matt Co. Works' }
      });
      await userEvent.click(submit);
    });

    const actual = putReq.called;
    expect(actual).toEqual(expected);
  });

  it('Send error report when an attachment fails to upload', async () => {
    const expected = true;
    render(
      <BidEdit
        user={user}
        bidId="bid-1"
        propertyId="property-1"
        jobId="job-1"
        isOnline
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    sinon.stub(storageApi, 'createUploadTask').throws(Error('fail'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    act(() => {
      const attachementInput = screen.getByTestId('input-file-attachment');
      fireEvent.change(attachementInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
        }
      });
    });

    await waitFor(() => sendReport.called);

    const actual = sendReport.called;
    expect(actual).toEqual(expected);
  });

  it('Send error report when an attachment fails to be saved to bid', async () => {
    const expected = true;
    render(
      <BidEdit
        user={user}
        bidId="bid-1"
        propertyId="property-1"
        jobId="job-1"
        isOnline
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    sinon.stub(storageApi, 'createUploadTask').returns({
      snapshot: { ref: 'test' },
      on(evt, onStart, onError, onComplete) {
        onComplete();
      }
    });
    sinon.stub(storageApi, 'getFileUrl').resolves('/test.png');
    sinon
      .stub(uploadAttachmentService, 'updateBidAttachment')
      .rejects(Error('oops'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    act(() => {
      const attachementInput = screen.getByTestId('input-file-attachment');
      fireEvent.change(attachementInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
        }
      });
    });

    await waitFor(() => sendReport.called);

    const actual = sendReport.called;
    expect(actual).toEqual(expected);
  });

  it('Send error report when an attachment fails to delete from storage', async () => {
    const expected = true;
    render(
      <BidEdit
        user={user}
        bidId="bid-1"
        propertyId="property-1"
        jobId="job-1"
        isOnline
      />,
      {
        contextWidth: breakpoints.desktop.minWidth
      }
    );

    sinon.stub(storageApi, 'deleteFile').throws(Error('fail'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    await act(async () => {
      const [btnDelete] = screen.getAllByTestId('button-delete-attachment');
      await userEvent.click(btnDelete);
      const btnConfirm = screen.getByTestId('btn-confirm-delete-attachment');
      await userEvent.click(btnConfirm);
    });

    await waitFor(() => sendReport.called);

    const actual = sendReport.called;
    expect(actual).toEqual(expected);
  });

  it('Send error report when removing an attachment fails to be updated to bid', async () => {
    const expected = true;
    render(
      <BidEdit
        user={user}
        bidId="bid-1"
        propertyId="property-1"
        jobId="job-1"
        isOnline
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    sinon.stub(storageApi, 'deleteFile').resolves(true);
    sinon
      .stub(bidsApi, 'removeBidAttachment')
      .rejects(Error('oops'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    await act(async () => {
      const [btnDelete] = screen.getAllByTestId('button-delete-attachment');
      await userEvent.click(btnDelete);
      const btnConfirm = screen.getByTestId('btn-confirm-delete-attachment');
      await userEvent.click(btnConfirm);
    });

    await waitFor(() => sendReport.called);

    const actual = sendReport.called;
    expect(actual).toEqual(expected);
  });
});

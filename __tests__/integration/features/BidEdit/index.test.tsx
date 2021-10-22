import sinon from 'sinon';
import Router from 'next/router';
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
import { fullProperty } from '../../../../__mocks__/properties';
import mockBids from '../../../../__mocks__/bids';
import bidModel from '../../../../common/models/bid';
import { openImprovementJob } from '../../../../__mocks__/jobs';
import BidEdit from '../../../../features/BidEdit';
import BidErrors from '../../../../features/BidEdit/Form/errors';
import bidsApi from '../../../../common/services/firestore/bids';
import bidServiceApi from '../../../../common/services/api/bids';
import storageApi from '../../../../common/services/storage';
import errorReports from '../../../../common/services/api/errorReports';
import uploadAttachmentService from '../../../../features/BidEdit/services/uploadAttachment';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';
import { admin } from '../../../../__mocks__/users';

const IS_ONLINE = true;

function render(ui: any, options: any = {}) {
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
  afterEach(() => sinon.restore());

  it('checks that empty vendor name validation error shows when form submits', async () => {
    const isNewBid = true;
    const newBid = { id: 'new' } as bidModel;

    render(
      <BidEdit
        isNewBid={isNewBid}
        property={fullProperty}
        user={admin}
        job={openImprovementJob}
        bid={newBid}
        otherBids={mockBids}
        isOnline={IS_ONLINE}
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    // Submit form
    await act(async () => {
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

  it('Publishes a new bid when non-existent and redirects user to update form', async () => {
    const expected = true;
    const isNewBid = true;
    const expectedUrl = `/properties/${fullProperty.id}/jobs/${openImprovementJob.id}/bids/test/`;
    const newBid = { id: 'new' } as bidModel;

    render(
      <BidEdit
        isNewBid={isNewBid}
        bid={newBid}
        property={fullProperty}
        user={admin}
        job={openImprovementJob}
        otherBids={mockBids}
        isOnline={IS_ONLINE}
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    const postReq = sinon.stub(bidServiceApi, 'createNewBid').resolves({
      status: 201,
      json: () =>
        Promise.resolve({
          data: { id: 'test' }
        })
    });
    const redirected = sinon.stub(Router, 'push').returns();

    // Enter vendor name & submit
    await act(async () => {
      const [submit] = await screen.findAllByTestId('bid-form-submit');
      const vendorInput = await screen.findByTestId('bid-form-vendor');
      await fireEvent.change(vendorInput, {
        target: { value: 'Matt Co. Works' }
      });
      await userEvent.click(submit);
    });

    const actual = postReq.called;
    const actualUrl = redirected.firstCall.firstArg;
    expect(actual).toEqual(expected);
    expect(actualUrl).toEqual(expectedUrl);
  });

  it('Updates a bid when it already exists', async () => {
    const expected = true;
    const isNewBid = false;

    render(
      <BidEdit
        isNewBid={isNewBid}
        property={fullProperty}
        user={admin}
        job={openImprovementJob}
        bid={mockBids[0]}
        otherBids={mockBids.splice(1)}
        isOnline={IS_ONLINE}
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
    const isNewBid = false;

    render(
      <BidEdit
        isNewBid={isNewBid}
        property={fullProperty}
        user={admin}
        job={openImprovementJob}
        bid={mockBids[0]}
        otherBids={mockBids.splice(1)}
        isOnline={IS_ONLINE}
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
    const isNewBid = false;

    render(
      <BidEdit
        isNewBid={isNewBid}
        property={fullProperty}
        user={admin}
        job={openImprovementJob}
        bid={mockBids[0]}
        otherBids={mockBids.splice(1)}
        isOnline={IS_ONLINE}
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
    const isNewBid = false;

    render(
      <BidEdit
        isNewBid={isNewBid}
        property={fullProperty}
        user={admin}
        job={openImprovementJob}
        bid={mockBids[0]}
        otherBids={mockBids.splice(1)}
        isOnline={IS_ONLINE}
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
    const isNewBid = false;

    render(
      <BidEdit
        isNewBid={isNewBid}
        property={fullProperty}
        user={admin}
        job={openImprovementJob}
        bid={mockBids[0]}
        otherBids={mockBids.splice(1)}
        isOnline={IS_ONLINE}
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    sinon.stub(storageApi, 'deleteFile').resolves(true);
    sinon.stub(bidsApi, 'removeBidAttachment').rejects(Error('oops'));
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

  it('Show error message for vendor W9 and vendor insurance if tried to approve bid', async () => {
    const expected = true;
    const isNewBid = false;

    render(
      <BidEdit
        isNewBid={isNewBid}
        property={fullProperty}
        user={admin}
        job={openImprovementJob}
        bid={mockBids[0]}
        otherBids={mockBids.splice(1)}
        isOnline={IS_ONLINE}
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    const btnApprove = screen.queryByTestId('bid-form-approve');

    const postReq = sinon.stub(bidServiceApi, 'updateBid').resolves({
      status: 400,
      json: () =>
        Promise.resolve({
          errors: [
            {
              title: 'bid requires approval of vendor W9',
              detail: 'Requires Vendor W to approve bid',
              source: { pointer: 'vendorW9' }
            },
            {
              title: 'bid requires approval of vendor insurance',
              detail: 'Requires Vendor Insurance to approve bid',
              source: { pointer: 'vendorInsurance' }
            }
          ]
        })
    });

    act(() => {
      userEvent.click(btnApprove);
    });

    await waitFor(() => postReq.called);

    const errMsgVendorW9 = screen.queryByTestId('error-message-vendorW9');
    const errMsgVendorInsurance = screen.queryByTestId(
      'error-message-vendorInsurance'
    );
    const actual = postReq.called;
    expect(actual).toEqual(expected);
    expect(errMsgVendorW9).toBeTruthy();
    expect(errMsgVendorInsurance).toBeTruthy();
  });
});

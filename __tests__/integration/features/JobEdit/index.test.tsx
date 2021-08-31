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
import bids from '../../../../__mocks__/bids';
import { photoAttachment } from '../../../../__mocks__/attachments';
import {
  openImprovementJob,
  openMaintenanceJob
} from '../../../../__mocks__/jobs';
import JobEdit from '../../../../features/JobEdit';
import JobErrors from '../../../../features/JobEdit/Form/errors';
import propertiesApi, {
  propertyResult
} from '../../../../common/services/firestore/properties';
import attachmentDb, {
  attachmentResult
} from '../../../../common/services/firestore/attachments';
import jobsStore, {
  jobResult
} from '../../../../common/services/firestore/jobs';
import bidsApi, {
  bidsCollectionResult
} from '../../../../common/services/firestore/bids';
import jobsApi from '../../../../common/services/api/jobs';
import storageApi from '../../../../common/services/storage';
import errorReports from '../../../../common/services/api/errorReports';
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

  const attachmentPayload: attachmentResult = {
    status: options.attachmentStatus || 'success',
    error: options.attachmentError || null,
    data: options.attachment || photoAttachment
  };
  sinon.stub(attachmentDb, 'findRecord').returns(attachmentPayload);

  // Stub job details
  const jobPayload: jobResult = {
    status: options.jobStatus || 'success',
    error: options.jobError || null,
    data: options.job || (!options.jobStatus && openImprovementJob)
  };
  sinon.stub(jobsStore, 'findRecord').returns(jobPayload);

  // Stub job bids
  const bidsPayload: bidsCollectionResult = {
    status: options.bidsStatus || 'success',
    error: options.bidsError || null,
    data: options.bids || bids
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

describe('Integration | Features | Job Edit', () => {
  it('shows loading text until the property is loaded', () => {
    const expected = 'Loading Job';

    render(<JobEdit user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth,
      propertyStatus: 'loading'
    });
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeTruthy();
    expect(loaderText.textContent).toEqual(expected);
  });

  it('shows loading text until the job is loaded', () => {
    const expected = 'Loading Job';

    render(<JobEdit user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth,
      jobStatus: 'loading'
    });
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeTruthy();
    expect(loaderText.textContent).toEqual(expected);
  });

  it('should not show loading text after property and job have loaded', () => {
    render(<JobEdit user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeNull();
  });

  it('renders and fill the form with required values', () => {
    const mockJob = { ...openMaintenanceJob };
    render(<JobEdit user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth,
      job: mockJob
    });
    const formTitle = screen.queryByTestId(
      'job-form-title'
    ) as HTMLInputElement;
    const formDescription = screen.queryByTestId(
      'job-form-description'
    ) as HTMLTextAreaElement;
    const formType = screen.queryByTestId('job-form-type') as HTMLSelectElement;
    const formScope = screen.queryByTestId(
      'job-form-scope'
    ) as HTMLTextAreaElement;

    const actualTitle = formTitle.value;
    const actualDescription = formDescription.value;
    const actualType = formType.value;
    const actualScope = formScope.value;

    const expectedTitle = 'Swimming pool cleaning';
    const expectedDescription = 'pool has gone dirty';
    const expectedType = 'maintenance';
    const expectedScope = 'clean pool, add chemicals';

    // Title should match
    expect(actualTitle).toEqual(expectedTitle);

    // Description should match
    expect(actualDescription).toEqual(expectedDescription);

    // Type should match
    expect(actualType).toEqual(expectedType);

    // Scope should match
    expect(actualScope).toEqual(expectedScope);
  });

  it('checks that form validation is showing errors', async () => {
    render(<JobEdit user={user} propertyId="property-1" jobId="new" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    await act(async () => {
      // Form submit button
      const [submit] = await screen.findAllByTestId('job-form-submit');
      await userEvent.click(submit);
    });

    const formErrorTitle = screen.queryByTestId(
      'error-label-title'
    ) as HTMLElement;

    // Title error message
    expect(formErrorTitle).toBeTruthy();

    const expectedTitle = JobErrors.titleRequired;
    const actualTitle = formErrorTitle.textContent;

    // Check the error message matches
    expect(actualTitle).toEqual(expectedTitle);
  });

  it('Publishes a new job when it does not exist yet', async () => {
    const expected = true;
    render(<JobEdit user={user} propertyId="property-1" jobId="new" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const postReq = sinon.stub(jobsApi, 'createNewJob').resolves({});

    await act(async () => {
      const [submit] = await screen.findAllByTestId('job-form-submit');
      const titleInput = await screen.findByTestId('job-form-title');
      await fireEvent.change(titleInput, { target: { value: 'New Job' } });
      await userEvent.click(submit);
    });

    const actual = postReq.called;
    expect(actual).toEqual(expected);
  });

  it('Updates a new job when it already exists', async () => {
    const expected = true;
    render(<JobEdit user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const putReq = sinon.stub(jobsApi, 'updateJob').resolves({});

    await act(async () => {
      const [submit] = await screen.findAllByTestId('job-form-submit');
      const titleInput = await screen.findByTestId('job-form-title');
      await fireEvent.change(titleInput, { target: { value: 'New Job' } });
      await userEvent.click(submit);
    });

    const actual = putReq.called;
    expect(actual).toEqual(expected);
  });

  it('Send error report when an attachment fails to upload', async () => {
    const expected = true;
    render(<JobEdit user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth,
      job: openMaintenanceJob
    });

    sinon.stub(storageApi, 'createUploadTask').throws(Error('fail'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    act(() => {
      const attachmentInput = screen.getByTestId('input-file-attachment');
      fireEvent.change(attachmentInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
        }
      });
    });

    await waitFor(() => sendReport.called);

    const actual = sendReport.called;
    expect(actual).toEqual(expected);
  });

  it('Send error report when an attachment fails to be saved to job', async () => {
    const expected = true;
    render(<JobEdit user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth,
      job: openMaintenanceJob
    });

    sinon.stub(storageApi, 'createUploadTask').returns({
      snapshot: { ref: 'test' },
      on(evt, onStart, onError, onComplete) {
        onComplete();
      }
    });
    sinon.stub(storageApi, 'getFileUrl').resolves('/test.png');
    sinon.stub(attachmentDb, 'saveRecord').resolves('attach-1');
    sinon.stub(jobsStore, 'updateAttachmentRef').rejects(Error('oops'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    act(() => {
      const attachmentInput = screen.getByTestId('input-file-attachment');
      fireEvent.change(attachmentInput, {
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
    render(<JobEdit user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

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
});

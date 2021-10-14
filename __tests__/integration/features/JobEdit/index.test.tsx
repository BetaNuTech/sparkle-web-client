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
import {
  openImprovementJob,
  openMaintenanceJob
} from '../../../../__mocks__/jobs';
import JobEdit from '../../../../features/JobEdit';
import JobErrors from '../../../../features/JobEdit/Form/errors';
import jobsApi from '../../../../common/services/api/jobs';
import storageApi from '../../../../common/services/storage';
import errorReports from '../../../../common/services/api/errorReports';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';
import jobModel from '../../../../common/models/job';

function render(ui: any, options: any = {}) {
  sinon.restore();

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

const STUBBED_NOTIFICATIONS = (message: string, options?: any) => [
  message,
  options
];

describe('Integration | Features | Job Edit', () => {
  it('renders and fill the form with required values', () => {
    const mockJob = { ...openMaintenanceJob };
    const { container } = render(
      <JobEdit
        user={user}
        property={fullProperty}
        job={mockJob}
        bids={bids}
        sendNotification={STUBBED_NOTIFICATIONS}
        jobId="job-1"
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );
    const formTitle = screen.queryByTestId(
      'job-form-title'
    ) as HTMLInputElement;
    const formDescription = screen.queryByTestId(
      'job-form-description'
    ) as HTMLTextAreaElement;
    const formType = container.querySelector(
      'input[name="type"]:checked'
    ) as HTMLInputElement;
    const formScope = screen.queryByTestId(
      'job-form-scope'
    ) as HTMLTextAreaElement;

    const actualTitle = formTitle.value;
    const actualDescription = formDescription.value;
    const actualType = formType.value;
    const actualScope = formScope.value;

    const expectedTitle = 'Swimming pool cleaning';
    const expectedDescription = 'pool has gone dirty';
    const expectedType = 'small:pm';
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
    render(
      <JobEdit
        user={user}
        property={fullProperty}
        job={{} as jobModel}
        bids={bids}
        sendNotification={STUBBED_NOTIFICATIONS}
        jobId="new"
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

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
    render(
      <JobEdit
        user={user}
        property={fullProperty}
        job={{} as jobModel}
        bids={bids}
        sendNotification={STUBBED_NOTIFICATIONS}
        jobId="new"
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

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
    render(
      <JobEdit
        user={user}
        property={fullProperty}
        job={openImprovementJob}
        bids={bids}
        sendNotification={STUBBED_NOTIFICATIONS}
        jobId="job-1"
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

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
    render(
      <JobEdit
        user={user}
        property={fullProperty}
        job={openImprovementJob}
        bids={bids}
        sendNotification={STUBBED_NOTIFICATIONS}
        jobId="job-1"
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth,
        job: openMaintenanceJob
      }
    );

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
});

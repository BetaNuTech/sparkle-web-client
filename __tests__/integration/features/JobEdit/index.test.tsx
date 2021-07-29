import sinon from 'sinon';

import { render as rtlRender, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import {
  openImprovementJob,
  openMaintenanceJob
} from '../../../../__mocks__/jobs';
import JobEdit from '../../../../features/JobEdit';
import JobErrors from '../../../../features/JobEdit/Form/errors';
import propertiesApi, {
  propertyResult
} from '../../../../common/services/firestore/properties';
import jobsApi, { jobResult } from '../../../../common/services/firestore/jobs';

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
  sinon.stub(jobsApi, 'findRecord').returns(jobPayload);

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

describe('Integration | Features | Job List', () => {
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
      const { container } = render(
        <JobEdit user={user} propertyId="property-1" jobId="new" />,
        {
          contextWidth: breakpoints.tablet.maxWidth
        }
      );

      // Form submit button
      const jobSubmitBtn = container.querySelector(
        '[data-testid="job-form-submit"]'
      );

      await userEvent.click(jobSubmitBtn);
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
});

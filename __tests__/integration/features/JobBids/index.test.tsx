import sinon from 'sinon';
import { render as rtlRender, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import { openImprovementJob } from '../../../../__mocks__/jobs';
import mockBids from '../../../../__mocks__/bids';
import JobBids from '../../../../features/JobBids';
import propertiesApi, {
  propertyResult
} from '../../../../common/services/firestore/properties';
import jobsApi, { jobResult } from '../../../../common/services/firestore/jobs';
import bidsApi, {
  bidsCollectionResult
} from '../../../../common/services/firestore/bids';

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

  // Stub one job to the view
  const jobPayload: jobResult = {
    status: options.jobStatus || 'success',
    error: options.jobError || null,
    data: options.job || (!options.jobStatus && openImprovementJob)
  };
  sinon.stub(jobsApi, 'findRecord').returns(jobPayload);

  // Stub all job bids
  const bidsPayload: bidsCollectionResult = {
    status: options.bidsStatus || 'success',
    error: options.bidsError || null,
    data: options.bids || mockBids
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

describe('Integration | Features | Job Bids', () => {
  it('shows loading text until the property is loaded', () => {
    const expected = 'Loading Bids';

    render(<JobBids user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth,
      propertyStatus: 'loading'
    });
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeTruthy();
    expect(loaderText.textContent).toEqual(expected);
  });

  it('shows loading text until the job is loaded', () => {
    const expected = 'Loading Bids';

    render(<JobBids user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth,
      jobStatus: 'loading'
    });
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeTruthy();
    expect(loaderText.textContent).toEqual(expected);
  });

  it('should not show loading text after property and job have loaded', () => {
    render(<JobBids user={user} propertyId="property-1" jobId="job-1" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });
    const loaderText = screen.queryByTestId('api-loader-text');

    expect(loaderText).toBeNull();
  });

  test('Filtering bid by state should show only selected state bid', async () => {
    const expected =
      // eslint-disable-next-line max-len
      'Open: Rob Playground';

    const { container } = render(
      <JobBids user={user} propertyId="property-1" jobId="job-1" />,
      {
        contextWidth: breakpoints.desktop.minWidth
      }
    );

    const openLi = container.querySelector('[data-testid="bid-open-text"]');
    const filterButton = openLi.querySelector('button');
    await act(async () => {
      // We are searching for keyword "lat"
      await userEvent.click(filterButton);
    });

    // Get all sections in table
    const sections = screen.queryAllByTestId('bid-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="bid-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-bid-title"]');

      const texts = [];

      // Push first element in test
      titles.forEach((t) => texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });
});

import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastProvider } from 'react-toast-notifications';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import mockJobs from '../../../../__mocks__/jobs';
import JobList from '../../../../features/JobList';
import propertiesApi, {
  propertyResult
} from '../../../../common/services/firestore/properties';
import jobsApi, {
  jobCollectionResult
} from '../../../../common/services/firestore/jobs';

import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';

function render(ui: any, options: any = {}) {
  sinon.restore();
  // Stub all properties requests
  const propertyPayload: propertyResult = {
    status: options.propertyStatus || 'success',
    error: options.propertyError || null,
    data: options.property || fullProperty
  };
  sinon.stub(propertiesApi, 'findRecord').returns(propertyPayload);

  // Stub all property jobs
  const jobsPayload: jobCollectionResult = {
    status: options.jobsStatus || 'success',
    error: options.jobsError || null,
    data: options.jobs || mockJobs
  };
  sinon.stub(jobsApi, 'queryByProperty').returns(jobsPayload);

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ToastProvider>
        <ResponsiveContext.Provider value={{ width: contextWidth }}>
          {ui}
        </ResponsiveContext.Provider>
      </ToastProvider>
    </FirebaseAppProvider>,
    options
  );
}

describe('Integration | Features | Job List', () => {
  it('renders only mobile content for mobile devices', () => {
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });
    const desktopHeader = screen.queryByTestId('joblist-header');
    const desktopGrid = screen.queryByTestId('joblist-grid-main');

    const mobileHeader = screen.queryByTestId('mobile-joblist-header');
    const mobileJobSection = screen.queryByTestId('job-sections-main-mobile');

    expect(desktopHeader).toBeNull();
    expect(desktopGrid).toBeNull();

    expect(mobileHeader).toBeTruthy();
    expect(mobileJobSection).toBeTruthy();
  });

  it('renders only desktop content for desktop devices', () => {
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });
    const desktopHeader = screen.queryByTestId('joblist-header');
    const desktopGrid = screen.queryByTestId('joblist-grid-main');

    const mobileHeader = screen.queryByTestId('mobile-joblist-header');
    const mobileJobSection = screen.queryByTestId('job-sections-main-mobile');

    expect(desktopHeader).toBeTruthy();
    expect(desktopGrid).toBeTruthy();

    // Should be null as it is desktop
    expect(mobileHeader).toBeNull();
    expect(mobileJobSection).toBeNull();
  });
});

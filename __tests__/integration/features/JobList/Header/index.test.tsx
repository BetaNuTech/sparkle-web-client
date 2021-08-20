import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { fullProperty } from '../../../../../__mocks__/properties';
import mockJobs, { openImprovementJob } from '../../../../../__mocks__/jobs';
import { colors } from '../../../../../features/JobList';
import Header from '../../../../../features/JobList/Header';
import breakpoints from '../../../../../config/breakpoints';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

const getPropertyJobs = (propertyId = 'property-1') =>
  mockJobs.filter((j) => j.property === propertyId);

describe('Integration | Features | Job List | Header', () => {
  it('should have loading text visible while job api is fetching data', () => {
    render(
      <Header
        property={fullProperty}
        jobs={getPropertyJobs()}
        jobStatus="loading"
        colors={colors}
      />
    );
    const jobOpen = screen.queryByTestId('job-open-loading');
    const jobActions = screen.queryByTestId('job-actions-loading');
    const jobProgress = screen.queryByTestId('job-progress-loading');

    expect(jobOpen).toBeTruthy();
    expect(jobActions).toBeTruthy();
    expect(jobProgress).toBeTruthy();
  });

  it('plural labels when property has plural job meta data', () => {
    render(
      <Header
        property={fullProperty}
        jobs={getPropertyJobs()}
        jobStatus="success"
        colors={colors}
      />
    );
    const jobOpen = screen.queryByTestId('job-open-text');
    const jobActions = screen.queryByTestId('job-actions-text');
    const jobProgress = screen.queryByTestId('job-progress-text');

    expect(jobOpen.textContent).toEqual('3Open');
    expect(jobActions.textContent).toEqual('1Approved');
    expect(jobProgress.textContent).toEqual('2Authorized');
  });

  it('singular labels when property has plural job meta data', () => {
    render(
      <Header
        property={fullProperty}
        jobs={[openImprovementJob]}
        jobStatus="success"
        colors={colors}
      />
    );
    const jobOpen = screen.queryByTestId('job-open-text');
    const jobActions = screen.queryByTestId('job-actions-text');
    const jobProgress = screen.queryByTestId('job-progress-text');

    expect(jobOpen.textContent).toEqual('1Open');
    expect(jobActions.textContent).toEqual('0Approved');
    expect(jobProgress.textContent).toEqual('0Authorized');
  });
});

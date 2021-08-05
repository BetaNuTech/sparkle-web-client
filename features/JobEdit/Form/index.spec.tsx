import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import {
  openImprovementJob,
  approvedImprovementJob,
  authorizedImprovementJob,
  completeImprovementJob
} from '../../../__mocks__/jobs';
import { fullProperty } from '../../../__mocks__/properties';
import breakpoints from '../../../config/breakpoints';
import jobsConfig from '../../../config/jobs';
import JobForm from './index';

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

describe('Unit | Features | Job Edit | Form', () => {
  it('renders only mobile content for mobile devices', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const desktopHeader = screen.queryByTestId('jobedit-header');
    const desktopForm = screen.queryByTestId('desktop-form');

    // Mobile footer form cancel button
    const mobileFormCancel = screen.queryByTestId('mobile-form-cancel');

    expect(desktopHeader).toBeNull();
    expect(desktopForm).toBeNull();
    expect(mobileFormCancel).toBeTruthy();
  });

  it('renders only desktop content for desktop devices', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const desktopHeader = screen.queryByTestId('jobedit-header');
    const desktopForm = screen.queryByTestId('desktop-form');

    const mobileFormCancel = screen.queryByTestId('mobile-form-cancel');

    expect(mobileFormCancel).toBeNull();

    // Desktop controls
    expect(desktopHeader).toBeTruthy();
    expect(desktopForm).toBeTruthy();
  });

  it('renders submit button in header for desktop', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const headerSubmitButton = screen.queryByTestId('jobedit-header-submit');

    // Check link is correct
    expect(headerSubmitButton).toBeTruthy();
  });

  it('renders cancel button that links to property jobs for desktop', () => {
    const expected = `/properties/${fullProperty.id}/jobs`;
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const result = screen.queryByTestId('jobedit-header-cancel');
    const actual = result && result.getAttribute('href');
    expect(actual).toEqual(expected);
  });

  it('renders cancel button at bottom of form that links to property jobs for mobile', () => {
    const expected = `/properties/${fullProperty.id}/jobs`;
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const result = screen.queryByTestId('mobile-form-cancel');
    const actual = result && result.getAttribute('href');
    expect(actual).toEqual(expected);
  });

  it('renders cancel button in header that links to property jobs for mobile', () => {
    const expected = `/properties/${fullProperty.id}/jobs`;
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const result = screen.queryByTestId('dropdown-header-cancel');
    const resultLink = result && result.querySelector('a');
    const actual = resultLink && resultLink.getAttribute('href');
    expect(actual).toEqual(expected);
  });

  it('renders submit button below form', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const headerSubmitButton = screen.queryByTestId('job-form-submit');

    // Check link is correct
    expect(headerSubmitButton).toBeTruthy();
  });

  it('should allow all job type options to be selected', () => {
    const expected = Object.keys(jobsConfig.types)
      .map((jt) => jobsConfig.types[jt])
      .join(' | ');
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const selectJobType = screen.queryByTestId('job-form-type');
    const jobTypeOptions = selectJobType.querySelectorAll('option');
    const textContentList = [];

    // Push text content of options
    jobTypeOptions.forEach((o) => textContentList.push(o.textContent));

    const actual = textContentList.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should show title on top of form on mobile', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const mobileTitle = screen.queryByTestId('job-form-title-mobile');

    expect(mobileTitle).toBeTruthy();
  });

  it('should not show state and next action on new form', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    expect(formEditState).toBeNull();
    expect(formEditNextStatus).toBeNull();
  });

  it('should show Approval word when job in open state', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    // Check if the elements are present
    expect(formEditState).toBeTruthy();
    expect(formEditNextStatus).toBeTruthy();

    const expectedState = 'Open';
    const expectedNextStatus = 'Approval';

    const actualState = formEditState.textContent;
    const actualNextStatus = formEditNextStatus.textContent;

    // Check the values are shown correctly
    expect(actualState).toEqual(expectedState);
    expect(actualNextStatus).toEqual(expectedNextStatus);
  });

  it('should show Authorization word when job in approved state', () => {
    const props = {
      job: approvedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    // Check if the elements are present
    expect(formEditState).toBeTruthy();
    expect(formEditNextStatus).toBeTruthy();

    const expectedState = 'Approved';
    const expectedNextStatus = 'Authorization';

    const actualState = formEditState.textContent;
    const actualNextStatus = formEditNextStatus.textContent;

    // Check the values are shown correctly
    expect(actualState).toEqual(expectedState);
    expect(actualNextStatus).toEqual(expectedNextStatus);
  });

  it('should show Completed Bid word when job in authorized state', () => {
    const props = {
      job: authorizedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    // Check if the elements are present
    expect(formEditState).toBeTruthy();
    expect(formEditNextStatus).toBeTruthy();

    const expectedState = 'Authorized';
    const expectedNextStatus = 'Completed Bid';

    const actualState = formEditState.textContent;
    const actualNextStatus = formEditNextStatus.textContent;

    // Check the values are shown correctly
    expect(actualState).toEqual(expectedState);
    expect(actualNextStatus).toEqual(expectedNextStatus);
  });

  it('should not show action required box when job in complete state', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    // Check if the elements are present
    expect(formEditState).toBeTruthy();

    // It should be null as we are not showing this
    expect(formEditNextStatus).toBeNull();

    const expectedState = 'Complete';

    const actualState = formEditState.textContent;

    // Check the values are shown correctly
    expect(actualState).toEqual(expectedState);
  });
});

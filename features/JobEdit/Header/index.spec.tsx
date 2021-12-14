import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import {
  completeImprovementJob,
  openImprovementJob
} from '../../../__mocks__/jobs';
import { fullProperty } from '../../../__mocks__/properties';
import breakpoints from '../../../config/breakpoints';
import Header from './index';

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

describe('Unit | Features | Job Edit | Desktop Header', () => {
  it('should show title on edit job', () => {
    const expected = true;
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: false,
      isJobComplete: false
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const desktopHeader = screen.queryByTestId('jobedit-header-name');
    const title = desktopHeader.textContent;

    const actual = title.indexOf(openImprovementJob.title) >= 0;

    expect(actual).toEqual(expected);
  });

  it('should show create new text on new job', () => {
    const expected = true;
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: true,
      isJobComplete: false,
      isOnline: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const desktopHeader = screen.queryByTestId('jobedit-header-name');
    const title = desktopHeader.textContent;

    const actual = title.indexOf('New Job') >= 0;

    expect(actual).toEqual(expected);
  });

  it('should not show submit button if job state is complete', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: false,
      isJobComplete: true,
      isOnline: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const headerSubmitBtn = screen.queryByTestId('jobedit-header-submit');

    expect(headerSubmitBtn).toBeNull();
  });

  it('should show submit button if job state is complete', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: false,
      isJobComplete: false,
      isLoading: false,
      isOnline: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const headerSubmitBtn = screen.queryByTestId('jobedit-header-submit');

    expect(headerSubmitBtn).toBeTruthy();
  });

  it('should show approve button when required conditions are met', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: false,
      isJobComplete: false,
      isLoading: false,
      canApprove: true,
      isOnline: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const headerApproveBtn = screen.queryByTestId('jobedit-header-approve');

    expect(headerApproveBtn).toBeTruthy();
  });

  it('should show authorize button when required conditions are met ', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: false,
      isJobComplete: false,
      isLoading: false,
      canAuthorize: true,
      isOnline: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const headerAuthorizeBtn = screen.queryByTestId('jobedit-header-authorize');

    expect(headerAuthorizeBtn).toBeTruthy();
  });

  it('should show expedite button when job is approved', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: false,
      isJobComplete: false,
      isLoading: false,
      canExpedite: true,
      isOnline: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const headerExpediteeBtn = screen.queryByTestId('jobedit-header-expedite');

    expect(headerExpediteeBtn).toBeTruthy();
  });

  it('should show desktop header and does not show mobile header ', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: false,
      isJobComplete: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const desktopHeader = screen.queryByTestId('jobedit-header');

    const mobileFormCancel = screen.queryByTestId('mobile-form-cancel');

    expect(mobileFormCancel).toBeNull();

    // Desktop controls
    expect(desktopHeader).toBeTruthy();
  });

  it('renders cancel button that links to property jobs for desktop', () => {
    const expected = `/properties/${fullProperty.id}/jobs`;
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isNewJob: false,
      isJobComplete: false,
      jobLink: expected,
      isOnline: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const result = screen.queryByTestId('jobedit-header-cancel');

    const actual = result && result.getAttribute('href');
    expect(actual).toEqual(expected);
  });
});

import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { openImprovementJob } from '../../../__mocks__/jobs';
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

describe('Unit | Features | Job Edit | Form', () => {
  it('renders only mobile content for mobile devices', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty
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
      property: fullProperty
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
      property: fullProperty
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
      property: fullProperty
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
      property: fullProperty
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
      property: fullProperty
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
      property: fullProperty
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
      property: fullProperty
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
});

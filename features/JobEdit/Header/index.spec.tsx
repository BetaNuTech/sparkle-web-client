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
      isJobComplete: false
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
      isJobComplete: true
    };

    render(<Header {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const headerSubmitBtn = screen.queryByTestId('jobedit-header-submit');

    expect(headerSubmitBtn).toBeNull();
  });
});

/* eslint-disable @typescript-eslint/no-empty-function */
import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { openImprovementJob } from '../../../__mocks__/jobs';
import { fullProperty } from '../../../__mocks__/properties';
import breakpoints from '../../../config/breakpoints';
import JobBidsHeader from './index';

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

describe('Unit | Features | Job Bids | Header', () => {
  it('should show message when job is in open state', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      bids: [],
      bidStatus: 'success',
      colors: {
        primary: '-bgc-primary'
      },
      filterState: '',
      isOnline: true,
      changeFilterState: (state: string) => {
        props.isOnline = Boolean(state); // fix for linting
      }
    };

    render(<JobBidsHeader {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const bidCreateMsg = screen.queryByTestId('job-bid-create-msg');
    const bidCreateBtn = screen.queryByTestId('job-bid-create');

    expect(bidCreateBtn).toBeNull();
    expect(bidCreateMsg).toBeTruthy();
  });
});

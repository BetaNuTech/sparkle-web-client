/* eslint-disable @typescript-eslint/no-empty-function */
import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import bidModel from '../../../common/models/bid';
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
      textColors: {
        primary: '-c-primary'
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

  it('show approved bid ui on top', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      bids: [{ state: 'open' } as bidModel, { state: 'approved' } as bidModel],
      bidStatus: 'success',
      colors: {
        primary: '-bgc-primary'
      },
      textColors: {
        primary: '-c-primary'
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

    const bidApprovedEl = screen.queryByTestId('bid-approved-completed');
    const bidApprovedTitle = screen.queryByTestId(
      'bid-approved-completed-title'
    );
    const expected = 'Approved';
    const actual = bidApprovedTitle.textContent;

    expect(bidApprovedEl).toBeTruthy();
    expect(actual).toEqual(expected);
  });

  it('show complete bid ui on top', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      bids: [
        { state: 'open' } as bidModel,
        { state: 'approved' } as bidModel,
        { state: 'complete' } as bidModel
      ],
      bidStatus: 'success',
      colors: {
        primary: '-bgc-primary'
      },
      textColors: {
        primary: '-c-primary'
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

    const bidCompleteEl = screen.queryByTestId('bid-approved-completed');
    const bidCompleteTitle = screen.queryByTestId(
      'bid-approved-completed-title'
    );
    const expected = 'Complete';
    const actual = bidCompleteTitle.textContent;

    expect(bidCompleteEl).toBeTruthy();
    expect(actual).toEqual(expected);
  });

  it('does not show complete bid ui on top', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      bids: [{ state: 'open' } as bidModel],
      bidStatus: 'success',
      colors: {
        primary: '-bgc-primary'
      },
      textColors: {
        primary: '-c-primary'
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

    const bidCompleteEl = screen.queryByTestId('bid-approved-completed');

    expect(bidCompleteEl).toBeNull();
  });

  it('show complaince tags for complete bid ui on top', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      bids: [
        { state: 'open' } as bidModel,
        { state: 'approved' } as bidModel,
        { state: 'complete', vendorW9: true } as bidModel
      ],
      bidStatus: 'success',
      colors: {
        primary: '-bgc-primary'
      },
      textColors: {
        primary: '-c-primary'
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

    const bidCompleteEl = screen.queryByTestId('bid-approved-completed');
    const bidComplainceW9El = screen.queryByTestId('bid-complaince-w9-approved');

    expect(bidCompleteEl).toBeTruthy();
    expect(bidComplainceW9El).toBeTruthy();
  });
});

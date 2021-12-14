/* eslint-disable @typescript-eslint/no-empty-function */

import { render, screen } from '@testing-library/react';

import { approvedImprovementJob } from '../../../__mocks__/jobs';
import { fullProperty } from '../../../__mocks__/properties';
import MobileJobInfoHeader from './index';

describe('Unit | Features | Job Edit | Mobile Job Info Header', () => {
  it('should show title on top of form on mobile', () => {
    const props = {
      propertyLink: '',
      jobLink: '',
      property: fullProperty,
      isNewJob: false,
      bidsRequired: 0,
      job: approvedImprovementJob
    };
    render(<MobileJobInfoHeader {...props} />);
    const mobileTitle = screen.queryByTestId('job-form-title-mobile');
    expect(mobileTitle).toBeTruthy();
  });

  it('should show bid required text if min bids requirement not met on top of form on mobile', () => {
    const expected = '+2 bids required';
    const props = {
      propertyLink: '',
      jobLink: '',
      property: fullProperty,
      isNewJob: false,
      bidsRequired: 2,
      job: approvedImprovementJob
    };
    render(<MobileJobInfoHeader {...props} />);
    const bidsRequired = screen.queryByTestId('bids-required');
    const bidsRequirementMet = screen.queryByTestId('bids-requirement-met');
    expect(bidsRequirementMet).toBeNull();
    expect(bidsRequired).toBeTruthy();
    expect(bidsRequired).toHaveTextContent(expected);
  });

  it('should show bid requirement met text if min bids requirement met on top of form on mobile', () => {
    const expected = 'Bid requirements met';
    const props = {
      propertyLink: '',
      jobLink: '',
      property: fullProperty,
      isNewJob: false,
      bidsRequired: 0,
      job: approvedImprovementJob
    };
    render(<MobileJobInfoHeader {...props} />);
    const bidsRequirementMet = screen.queryByTestId('bids-requirement-met');
    const bidsRequired = screen.queryByTestId('bids-required');
    expect(bidsRequired).toBeNull();
    expect(bidsRequirementMet).toBeTruthy();
    expect(bidsRequirementMet).toHaveTextContent(expected);
  });
});

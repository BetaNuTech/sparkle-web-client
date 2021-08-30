import { render, screen } from '@testing-library/react';
import {
  openImprovementJob,
  approvedImprovementJob,
  authorizedImprovementJob
} from '../../../../__mocks__/jobs';
import configJobs from '../../../../config/jobs';
import deepClone from '../../../../__tests__/helpers/deepClone';
import { colors } from '../../index';
import JobSections from './index';

describe('Unit | Features | Job List | Mobile Layout | Job Sections', () => {
  it('should have title for each section', () => {
    const props = {
      jobs: [openImprovementJob, approvedImprovementJob],
      propertyId: 'property-1',
      colors,
      configJobs
    };
    render(<JobSections {...props} />);

    const jobTitle = screen.queryAllByTestId('job-section-title');

    expect(jobTitle.length).toEqual(4);
  });

  it('should add jobs with different states in different sections', () => {
    const props = {
      jobs: [
        openImprovementJob,
        approvedImprovementJob,
        authorizedImprovementJob
      ],
      propertyId: 'property-1',
      colors,
      configJobs
    };
    render(<JobSections {...props} />);

    const jobTitle = screen.queryAllByTestId('job-item-record');

    expect(jobTitle.length).toEqual(3);
  });

  it('should have background to section header as configured', () => {
    const props = {
      jobs: [
        openImprovementJob,
        approvedImprovementJob,
        authorizedImprovementJob
      ],
      propertyId: 'property-1',
      colors,
      configJobs: deepClone({
        ...configJobs,
        ...{
          stateColors: {
            open: 'secondary',
            approved: 'info',
            authorized: 'alert',
            complete: 'orange'
          }
        }
      })
    };

    render(<JobSections {...props} />);

    const jobSectionTitle = screen.queryAllByTestId('job-section-title');
    const titleClasses = jobSectionTitle.map((title) => ({
      [title.textContent]: title.classList
    }));

    expect(titleClasses[0].Open).toContain(colors.secondary);
    expect(titleClasses[1].Approved).toContain(colors.info);
    expect(titleClasses[2]['Under Contract']).toContain(colors.alert);
    expect(titleClasses[3].Completed).toContain(colors.orange);
  });
});

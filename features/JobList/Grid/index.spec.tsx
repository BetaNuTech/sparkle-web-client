import { render, screen } from '@testing-library/react';
import {
  openImprovementJob,
  approvedImprovementJob,
  authorizedImprovementJob
} from '../../../__mocks__/jobs';
import deepClone from '../../../__tests__/helpers/deepClone';
import configJobs from '../../../config/jobs';
import { colors } from '../index';
import JobSections from './index';

describe('Unit | Features | Job List | Grid', () => {
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

  it('should have no job message present for states that contains no jobs', () => {
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

    const jobTitle = screen.queryAllByTestId('job-section-no-jobs');

    expect(jobTitle.length).toEqual(1);
  });

  it('should show no jobs message for property if no jobs exist for property', () => {
    const props = {
      jobs: [],
      propertyId: 'property-1',
      colors,
      configJobs
    };
    render(<JobSections {...props} />);

    const noJobTitle = screen.queryByTestId('job-sections-no-jobs');
    const jobSectionMain = screen.queryByTestId('job-sections-main');

    expect(noJobTitle).toBeTruthy();
    expect(jobSectionMain).toBeNull();
  });

  it('should add configured section header color', () => {
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
      [title.textContent]: title.firstElementChild.classList
    }));

    expect(titleClasses[0].Open).toContain(colors.secondary);
    expect(titleClasses[1]['Action Required']).toContain(colors.info);
    expect(titleClasses[2]['Authorized to Start']).toContain(colors.alert);
    expect(titleClasses[3].Completed).toContain(colors.orange);
  });
});

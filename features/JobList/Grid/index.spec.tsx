import { render, screen } from '@testing-library/react';
import {
  openImprovementJob,
  approvedImprovementJob,
  authorizedImprovementJob
} from '../../../__mocks__/jobs';
import JobSections from './index';

describe('Unit | Features | Job List | Grid', () => {
  it('should have title for each section', () => {
    const props = {
      jobs: [openImprovementJob, approvedImprovementJob],
      propertyId: 'property-1'
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
      propertyId: 'property-1'
    };
    render(<JobSections {...props} />);

    const jobTitle = screen.queryAllByTestId('job-item-record');

    expect(jobTitle.length).toEqual(3);
  });

  it('should have no job message present in different states in different sections', () => {
    const props = {
      jobs: [
        openImprovementJob,
        approvedImprovementJob,
        authorizedImprovementJob
      ],
      propertyId: 'property-1'
    };
    render(<JobSections {...props} />);

    const jobTitle = screen.queryAllByTestId('job-section-no-jobs');

    expect(jobTitle.length).toEqual(1);
  });

  it('should show no jobs message for property if no jobs is there on property', () => {
    const props = {
      jobs: [],
      propertyId: 'property-1'
    };
    render(<JobSections {...props} />);

    const noJobTitle = screen.queryByTestId('job-sections-no-jobs');
    const jobSectionMain = screen.queryByTestId('job-sections-main');

    expect(noJobTitle).toBeTruthy();
    expect(jobSectionMain).toBeNull();
  });
});

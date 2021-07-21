import { render, screen } from '@testing-library/react';
import {
  openImprovementJob,
  approvedImprovementJob
} from '../../../../../__mocks__/jobs';
import configJobs from '../../../../../config/jobs';
import { colors } from '../../../index';
import Section from './index';

describe('Unit | Features | Job List | Mobile Layout | Job Sections | Section', () => {
  it('should match title of the section', () => {
    const props = {
      title: 'my section',
      propertyId: 'property-1',
      jobs: [openImprovementJob, approvedImprovementJob],
      colors,
      configJobs
    };
    render(<Section {...props} />);

    const jobTitle = screen.queryByTestId('job-section-title');

    expect(jobTitle.textContent).toEqual('my section');
  });

  it('should render all the items in the job section', () => {
    const props = {
      title: 'my section',
      propertyId: 'property-1',
      jobs: [openImprovementJob, approvedImprovementJob],
      colors,
      configJobs
    };
    render(<Section {...props} />);

    const sectionRecords = screen.queryAllByTestId('job-item-record');

    expect(sectionRecords.length).toEqual(2);
  });

  it('should render no job text if no jobs present', () => {
    const props = {
      title: 'my section',
      propertyId: 'property-1',
      jobs: [],
      colors,
      configJobs
    };
    render(<Section {...props} />);

    const sectionItem = screen.queryByTestId('job-section-items');
    const sectionNoJob = screen.queryByTestId('job-section-no-jobs');

    expect(sectionItem).toBeNull();
    // Should show no job
    expect(sectionNoJob).toBeTruthy();
  });
});
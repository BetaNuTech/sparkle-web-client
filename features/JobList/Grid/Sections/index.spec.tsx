import { render, screen } from '@testing-library/react';
import {
  openImprovementJob,
  approvedImprovementJob
} from '../../../../__mocks__/jobs';
import stubIntersectionObserver from '../../../../__tests__/helpers/stubIntersectionObserver';
import configJobs from '../../../../config/jobs';
import { colors } from '../../index';
import Section from './index';

const FORCE_VISIBLE = true;

describe('Unit | Features | Job List | Grid | Sections', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should match title of the section', () => {
    const props = {
      title: 'my section',
      propertyId: 'property-1',
      jobs: [openImprovementJob, approvedImprovementJob],
      colors,
      configJobs,
      jobState: openImprovementJob.state,
      forceVisible: FORCE_VISIBLE
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
      configJobs,
      jobState: openImprovementJob.state,
      forceVisible: FORCE_VISIBLE
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
      configJobs,
      jobState: '',
      forceVisible: FORCE_VISIBLE
    };
    render(<Section {...props} />);

    const sectionItem = screen.queryByTestId('job-section-items');
    const sectionNoJob = screen.queryByTestId('job-section-no-jobs');

    expect(sectionItem).toBeNull();
    // Should show no job
    expect(sectionNoJob).toBeTruthy();
  });
});

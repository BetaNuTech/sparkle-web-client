import { render, screen } from '@testing-library/react';
import moment from 'moment';
import {
  openImprovementJob,
  openMaintenanceJob
} from '../../../../../__mocks__/jobs';
import deepClone from '../../../../../__tests__/helpers/deepClone';
import formats from '../../../../../config/formats';
import configJobs from '../../../../../config/jobs';
import { colors } from '../../../index';
import Item from './index';


describe('Unit | Features | Job List | Mobile Layout | Job Sections | Item', () => {
  it('should show titelize type of job', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1',
      colors,
      configJobs
    };
    props.job.type = 'improvement';
    render(<Item {...props} />);

    const jobTypeText = screen.queryByTestId('mobile-row-job-type');

    expect(jobTypeText.textContent).toEqual('Improvement');
  });

  it('should show created at date in correct format', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1',
      colors,
      configJobs
    };
    props.job.createdAt = 1626736443;

    const expected = moment
      .unix(props.job.createdAt)
      .format(formats.userDateTimeDisplay);

    render(<Item {...props} />);

    const jobCreatedEl = screen.queryByTestId('mobile-row-job-created');

    expect(jobCreatedEl.textContent).toEqual(expected);
  });

  it('should show updated at date in correct format', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1',
      colors,
      configJobs
    };
    props.job.updatedAt = 1626736443;

    const expected = moment
      .unix(props.job.updatedAt)
      .format(formats.userDateTimeDisplay);

    render(<Item {...props} />);

    const jobUpdatedEl = screen.queryByTestId('mobile-row-job-updated');

    expect(jobUpdatedEl.textContent).toEqual(expected);
  });

  it('should have correct inspection color for inspection job type', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1',
      colors,
      configJobs: deepClone({
        ...configJobs,
        ...{
          typeColors: {
            improvement: 'alert',
            maintenance: 'info'
          }
        }
      })
    };

    render(<Item {...props} />);

    const jobTypeTextEl = screen.queryByTestId('mobile-row-job-type');

    expect(jobTypeTextEl.classList.contains(colors.alert)).toEqual(true);
  });

  it('should have correct maintenance color for maintenance job type', () => {
    const props = {
      job: deepClone(openMaintenanceJob),
      propertyId: 'property-1',
      colors,
      configJobs: deepClone({
        ...configJobs,
        ...{
          typeColors: {
            improvement: 'info',
            maintenance: 'orange'
          }
        }
      })
    };

    render(<Item {...props} />);

    const jobTypeTextEl = screen.queryByTestId('mobile-row-job-type');

    expect(jobTypeTextEl.classList.contains(colors.orange)).toEqual(true);
  });
});

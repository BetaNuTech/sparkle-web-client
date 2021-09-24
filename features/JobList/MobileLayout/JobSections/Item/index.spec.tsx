import { render, screen } from '@testing-library/react';
import moment from 'moment';
import {
  authorizedImprovementJob,
  openImprovementJob
} from '../../../../../__mocks__/jobs';
import stubIntersectionObserver from '../../../../../__tests__/helpers/stubIntersectionObserver';
import deepClone from '../../../../../__tests__/helpers/deepClone';
import formats from '../../../../../config/formats';
import configJobs from '../../../../../config/jobs';
import { colors } from '../../../index';
import Item from './index';

const FORCE_VISIBLE = true;

describe('Unit | Features | Job List | Mobile Layout | Job Sections | Item', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should show titelize type of job', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1',
      colors,
      configJobs,
      forceVisible: FORCE_VISIBLE
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
      configJobs,
      forceVisible: FORCE_VISIBLE
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
      configJobs,
      forceVisible: FORCE_VISIBLE
    };
    props.job.updatedAt = 1626736443;

    const expected = moment
      .unix(props.job.updatedAt)
      .format(formats.userDateTimeDisplay);

    render(<Item {...props} />);

    const jobUpdatedEl = screen.queryByTestId('mobile-row-job-updated');

    expect(jobUpdatedEl.textContent).toEqual(expected);
  });

  it('should have correct inspection color for property management project job type', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1',
      colors,
      configJobs: deepClone({
        ...configJobs,
        ...{
          typeColors: {
            'small:pm': 'alert',
            'small:hybrid': 'info'
          }
        }
      }),
      forceVisible: FORCE_VISIBLE
    };

    render(<Item {...props} />);

    const jobTypeTextEl = screen.queryByTestId('mobile-row-job-type');

    expect(jobTypeTextEl.classList.contains(colors.alert)).toEqual(true);
  });

  it('should have correct maintenance color for hybrid capital project job type', () => {
    const props = {
      job: deepClone(authorizedImprovementJob),
      propertyId: 'property-1',
      colors,
      configJobs: deepClone({
        ...configJobs,
        ...{
          typeColors: {
            'small:pm': 'info',
            'small:hybrid': 'orange'
          }
        }
      }),
      forceVisible: FORCE_VISIBLE
    };

    render(<Item {...props} />);

    const jobTypeTextEl = screen.queryByTestId('mobile-row-job-type');

    expect(jobTypeTextEl.classList.contains(colors.orange)).toEqual(true);
  });
});

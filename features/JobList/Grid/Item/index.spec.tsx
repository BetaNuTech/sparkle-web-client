import { render, screen } from '@testing-library/react';
import moment from 'moment';
import {
  openImprovementJob,
  openMaintenanceJob
} from '../../../../__mocks__/jobs';
import deepClone from '../../../../__tests__/helpers/deepClone';
import stubIntersectionObserver from '../../../../__tests__/helpers/stubIntersectionObserver';
import formats from '../../../../config/formats';
import configJobs from '../../../../config/jobs';
import { colors } from '../../index';
import Item from './index';

const FORCE_VISIBLE = true;

describe('Unit | Features | Job List | Grid | Item', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should show titelize type of job', () => {
    const expected = 'Improvement';
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1',
      colors,
      configJobs,
      forceVisible: FORCE_VISIBLE
    };
    props.job.type = 'improvement';
    render(<Item {...props} />);

    const result = screen.queryByTestId('grid-row-job-type-label');
    const actual = result && result.textContent;
    expect(actual).toEqual(expected);
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

    const result = screen.queryByTestId('grid-row-job-created');
    const actual = result && result.textContent;
    expect(actual).toEqual(expected);
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

    const result = screen.queryByTestId('grid-row-job-updated');
    const actual = result && result.textContent;
    expect(actual).toEqual(expected);
  });

  it('should have correct color for improvement job type', () => {
    const expected = true;
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
      }),
      forceVisible: FORCE_VISIBLE
    };

    render(<Item {...props} />);

    const result = screen.queryByTestId('grid-row-job-type-label');
    const actual = result && result.classList.contains(colors.alert);
    expect(actual).toEqual(expected);
  });

  it('should have correct color for maintenance job type', () => {
    const expected = true;
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
      }),
      forceVisible: FORCE_VISIBLE
    };

    render(<Item {...props} />);

    const result = screen.queryByTestId('grid-row-job-type-label');
    const actual = result && result.classList.contains(colors.orange);
    expect(actual).toEqual(expected);
  });
});

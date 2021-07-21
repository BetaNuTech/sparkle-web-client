import { render, screen } from '@testing-library/react';
import moment from 'moment';
import { openImprovementJob } from '../../../../__mocks__/jobs';
import deepClone from '../../../../__tests__/helpers/deepClone';
import formats from '../../../../config/formats';
import Item from './index';

describe('Unit | Features | Job List | Grid | Item', () => {
  it('should show titelize type of job', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1'
    };
    props.job.type = 'improvement';
    render(<Item {...props} />);

    const jobTypeText = screen.queryByTestId('job-type-text');

    expect(jobTypeText.textContent).toEqual('Improvement');
  });

  it('should show created at date in correct format', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1'
    };
    props.job.createdAt = 1626736443;

    const expected = moment
      .unix(props.job.createdAt)
      .format(formats.userDateTimeDisplay);

    render(<Item {...props} />);

    const jobCreatedEl = screen.queryByTestId('job-created-text');

    expect(jobCreatedEl.textContent).toEqual(expected);
  });

  it('should show updated at date in correct format', () => {
    const props = {
      job: deepClone(openImprovementJob),
      propertyId: 'property-1'
    };
    props.job.updatedAt = 1626736443;

    const expected = moment
      .unix(props.job.updatedAt)
      .format(formats.userDateTimeDisplay);

    render(<Item {...props} />);

    const jobUpdatedEl = screen.queryByTestId('job-updated-text');

    expect(jobUpdatedEl.textContent).toEqual(expected);
  });
});

import { render } from '@testing-library/react';
import DropdownHeader from './index';
import { JobApiResult } from '../hooks/useJobForm';

describe('Unit | Features | Job Edit | Dropdown Header', () => {
  it('should have options for cancel and button for submit', () => {
    const props = {
      jobLink: '',
      apiState: {} as JobApiResult,
      onSubmit: () => Promise.resolve()
    };
    const { container } = render(<DropdownHeader {...props} />);

    const anchors = container.querySelectorAll('a');
    const buttons = container.querySelectorAll('button');

    expect(anchors).toHaveLength(1);
    expect(buttons).toHaveLength(1);
  });

  it('given link in attribute should match cancel button', () => {
    const expected = '/property/jobs';
    const props = {
      jobLink: '/property/jobs',
      apiState: {} as JobApiResult,
      onSubmit: () => Promise.resolve()
    };
    const { container } = render(<DropdownHeader {...props} />);

    const anchors = container.querySelector('a');

    const cancelLink = anchors.getAttribute('href');

    expect(cancelLink).toEqual(expected);
  });
});

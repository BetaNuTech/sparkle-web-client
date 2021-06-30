import { render } from '@testing-library/react';
import { admin } from '../../../__mocks__/users';
import DropdownInspection from './index';

describe('Unit | Common | Dropdown | Link', () => {
  it('matches prior snapshot', () => {
    const { container } = render(<DropdownInspection user={admin} />);
    expect(container).toMatchSnapshot();
  });

  it('should has 1 links and 1 button for admin login', () => {
    const { container } = render(<DropdownInspection user={admin} />);

    const anchors = container.querySelectorAll('a');
    const buttons = container.querySelectorAll('button');

    expect(buttons).toHaveLength(1);
    expect(anchors).toHaveLength(1);
  });
});

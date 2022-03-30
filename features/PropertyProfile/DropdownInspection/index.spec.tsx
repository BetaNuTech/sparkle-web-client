import { render } from '@testing-library/react';
import { admin } from '../../../__mocks__/users';
import DropdownInspection from './index';

describe('Unit | Common | Dropdown | Link', () => {
  it('should has 2 button for admin login', () => {
    const { container } = render(<DropdownInspection user={admin} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
  });
});

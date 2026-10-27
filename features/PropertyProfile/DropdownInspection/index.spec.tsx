import { render } from '@testing-library/react';
import { admin, teamMember } from '../../../__mocks__/users';
import DropdownInspection from './index';

describe('Unit | Common | Dropdown | Link', () => {
  it('should has 3 buttons for admin login', () => {
    const { container } = render(<DropdownInspection user={admin} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
  });

  it('should only have unit # button for team member login', () => {
    const { container } = render(<DropdownInspection user={teamMember} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toEqual('Unit #');
  });
});

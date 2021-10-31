import { render } from '@testing-library/react';
import DropdownAdd from './index';

describe('Unit | Common | Dropdown | Link', () => {
  it('should have links for add team and property for admin', () => {
    const props = {
      canAddTeam: true,
      canAddProperty: true
    };
    const { container } = render(<DropdownAdd {...props} />);

    const anchors = container.querySelectorAll('a');

    expect(anchors).toHaveLength(2);
  });

  it('should not show add team option without create team permission', () => {
    const props = {
      canAddTeam: false,
      canAddProperty: true
    };
    const { container } = render(<DropdownAdd {...props} />);

    const addTeam = container.querySelector('[data-testid=dropdown-add-team]');

    expect(addTeam).toBeNull();
  });

  it('should not show add property option without create property permission', () => {
    const props = {
      canAddTeam: true,
      canAddProperty: false
    };
    const { container } = render(<DropdownAdd {...props} />);

    const addProperty = container.querySelector(
      '[data-testid=dropdown-add-property]'
    );

    expect(addProperty).toBeNull();
  });
});

import { render } from '@testing-library/react';
import DropdownAdd from './index';

describe('Unit | Common | Dropdown | Link', () => {

  it('matches prior snapshot', () => {
    const { container } = render(<DropdownAdd />);
    expect(container).toMatchSnapshot();
  });

  it('should has two links inside', () => {
    const { container } = render(<DropdownAdd />);

    const anchors = container.querySelectorAll('a');

    expect(anchors).toHaveLength(2);
  });
});

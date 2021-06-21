import { render } from '@testing-library/react';
import Header from './index';

describe('Unit | Features | Properties | Header', () => {
  it('matches prior snapshot', () => {
    const props = {
      sortBy: 'name',
      sortDir: 'asc',
      onSortChange: () => () => 'name'
    };
    const { container } = render(<Header {...props} />);
    expect(container).toMatchSnapshot();
  });
});

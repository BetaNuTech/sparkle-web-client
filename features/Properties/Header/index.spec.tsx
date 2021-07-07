import { render } from '@testing-library/react';
import { admin as user } from '../../../__mocks__/users';
import Header from './index';

describe('Unit | Features | Properties | Header', () => {
  it('matches prior snapshot', () => {
    const props = {
      user,
      sortBy: 'name',
      sortDir: 'asc',
      onSortChange: () => () => 'name'
    };
    const { container } = render(<Header {...props} />);
    expect(container).toMatchSnapshot();
  });
});

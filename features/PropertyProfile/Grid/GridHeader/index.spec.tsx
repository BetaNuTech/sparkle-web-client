import { render } from '@testing-library/react';
import { admin } from '../../../../__mocks__/users';
import GridHeader from './index';

describe('Unit | Features | Properties | Profile | Inspection | Grid | GridHeader', () => {
  it('matches prior snapshot', () => {
    const props = {
      user: admin
    };

    const { container } = render(<GridHeader {...props} />);
    expect(container).toMatchSnapshot();
  });
});

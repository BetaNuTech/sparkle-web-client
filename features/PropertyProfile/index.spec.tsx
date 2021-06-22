import { render as rtlRender } from '@testing-library/react';
import { admin } from '../../__mocks__/users';
import PropertyProfile from './index';

function render(ui: any, options: any = {}) {
  return rtlRender(ui, options);
}

describe('Unit | Features | PropertyProfile | Snapshot', () => {
  it('matches prior snapshot', () => {
    const wrapper = render(<PropertyProfile user={admin} />);
    expect(wrapper).toMatchSnapshot();
  });
});

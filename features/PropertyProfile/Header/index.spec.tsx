import { render } from '@testing-library/react';
import {fullProperty} from '../../../__mocks__/properties';
import Header from './index';

describe('Unit | Features | Properties | Profile', () => {
  it('matches prior snapshot', () => {
    const props = {
      property: fullProperty
    };
    const { container } = render(<Header {...props} />);
    expect(container).toMatchSnapshot();
  });
});

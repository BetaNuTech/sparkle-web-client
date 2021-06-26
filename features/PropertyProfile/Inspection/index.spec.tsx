import { render } from '@testing-library/react';
import inspections from '../../../__mocks__/inspections';
import templateCategories from '../../../__mocks__/templateCategories';
import Inspection from './index';

describe('Unit | Features | Properties | Profile | Inspection', () => {
  it('matches prior snapshot', () => {
    const props = {
      inspections,
      templateCategories
    };
    const { container } = render(<Inspection {...props} />);
    expect(container).toMatchSnapshot();
  });
});

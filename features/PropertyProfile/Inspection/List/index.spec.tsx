import { render } from '@testing-library/react';
import inspections from '../../../../__mocks__/inspections';
import templateCategories from '../../../../__mocks__/templateCategories';
import List from './index';

describe('Unit | Features | Properties | Profile | Inspection | List', () => {
  it('matches prior snapshot', () => {
    const props = {
      inspections,
      templateCategories
    };

    const { container } = render(<List {...props} />);
    expect(container).toMatchSnapshot();
  });
});

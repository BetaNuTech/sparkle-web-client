import { render } from '@testing-library/react';
import { fullInspection } from '../../../../__mocks__/inspections';
import templateCategories from '../../../../__mocks__/templateCategories';
import ListItem from './index';

describe('Unit | Features | Properties | Profile | Inspection | List| ListItem', () => {
  it('matches prior snapshot', () => {
    const props = {
      inspection: fullInspection,
      templateCategories
    };
    const { container } = render(<ListItem {...props} />);
    expect(container).toMatchSnapshot();
  });
});

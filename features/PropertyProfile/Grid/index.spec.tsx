import { render } from '@testing-library/react';
import inspections from '../../../__mocks__/inspections';
import { admin } from '../../../__mocks__/users';
import templateCategories from '../../../__mocks__/templateCategories';
import Grid from './index';

describe('Unit | Features | Properties | Profile | Inspection | Grid', () => {
  it('matches prior snapshot', () => {
    const props = {
      user: admin,
      inspections,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {}
    };
    const { container } = render(<Grid {...props} />);
    expect(container).toMatchSnapshot();
  });
});

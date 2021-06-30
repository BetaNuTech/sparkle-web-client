import { render } from '@testing-library/react';
import { admin } from '../../../../__mocks__/users';
import { fullInspection } from '../../../../__mocks__/inspections';
import templateCategories from '../../../../__mocks__/templateCategories';
import ListItem from './index';

describe('Unit | Features | Properties | Profile | Inspection | Grid | List| ListItem', () => {
  it('matches prior snapshot', () => {
    const props = {
      user: admin,
      inspection: fullInspection,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {}
    };
    const { container } = render(<ListItem {...props} />);
    expect(container).toMatchSnapshot();
  });
});

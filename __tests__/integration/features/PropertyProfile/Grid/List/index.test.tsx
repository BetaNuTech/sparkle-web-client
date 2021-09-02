import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { teamMember } from '../../../../../../__mocks__/users';
import templateCategories from '../../../../../../__mocks__/templateCategories';
import inspections from '../../../../../../__mocks__/inspections';
import stubIntersectionObserver from '../../../../../helpers/stubIntersectionObserver';
import List from '../../../../../../features/PropertyProfile/Grid/List';
import breakpoints from '../../../../../../config/breakpoints';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Profile | Inspection | Grid | List', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should render all the inspections given to the list', () => {
    const expected = 3;

    const props = {
      user: teamMember,
      inspections,
      templateCategories,
      propertyId: 'property-1',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      forceVisible: true
    };

    render(<List {...props} />);

    const header: HTMLElement = screen.queryByTestId(
      'property-profile-grid-inspections'
    );
    const actual = header.children.length;
    expect(actual).toEqual(expected);
  });
});

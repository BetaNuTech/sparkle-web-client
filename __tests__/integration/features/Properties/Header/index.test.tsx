import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import PropertiesHeader from '../../../../../features/Properties/Header';
import breakpoints from '../../../../../config/breakpoints';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

const onSortChange = () => () => true;

describe('Integration | Features | Properties | Header', () => {
  it('should only show create button when mobile user has permission to create a team or a property', () => {
    const expected = true;
    const props = {
      canAddTeam: true,
      canAddProperty: false,
      onSortChange
    };
    render(<PropertiesHeader {...props} />);

    const actual = Boolean(screen.queryByTestId('property-list-create'));
    expect(actual).toEqual(expected);
  });

  it('should not show create button when mobile user has no permission to create a team and property', () => {
    const expected = false;
    const props = {
      canAddTeam: false,
      canAddProperty: false,
      onSortChange
    };
    render(<PropertiesHeader {...props} />);

    const actual = Boolean(screen.queryByTestId('property-list-create'));
    expect(actual).toEqual(expected);
  });
});

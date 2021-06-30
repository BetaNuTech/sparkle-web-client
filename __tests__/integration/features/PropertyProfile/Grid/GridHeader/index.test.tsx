import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { admin, teamMember } from '../../../../../../__mocks__/users';
import GridHeader from '../../../../../../features/PropertyProfile/Grid/GridHeader';
import breakpoints from '../../../../../../config/breakpoints';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Profile | Inspection | Grid | Grid Header', () => {
  it('should render 6 column for user without having inspetion rights', () => {
    const expected = 6;

    render(<GridHeader user={teamMember} />);

    const header: HTMLElement = screen.queryByTestId('grid-header');
    const actual = header.children.length;
    expect(actual).toEqual(expected);
  });

  it('should render 7 column for user without having inspetion rights', () => {
    const expected = 7;

    render(<GridHeader user={admin} />);

    const header: HTMLElement = screen.queryByTestId('grid-header');
    const actual = header.children.length;
    expect(actual).toEqual(expected);
  });
});

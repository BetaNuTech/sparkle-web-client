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
  it('should render 8 columns for team member with unit # editing rights', () => {
    const expected = 8;

    render(<GridHeader user={teamMember} />);

    const header: HTMLElement = screen.queryByTestId('grid-header');
    const actual = header.children.length;
    expect(actual).toEqual(expected);
  });

  it('should render 8 columns for admin user', () => {
    const expected = 8;

    render(<GridHeader user={admin} />);

    const header: HTMLElement = screen.queryByTestId('grid-header');
    const actual = header.children.length;
    expect(actual).toEqual(expected);
  });

  it('should render a sortable unit # column', () => {
    render(<GridHeader user={admin} />);

    const unitHeader: HTMLElement = screen.queryByTestId(
      'grid-head-unit-number'
    );
    expect(unitHeader).toBeTruthy();
    expect(unitHeader.textContent).toEqual('Unit #');
  });
});

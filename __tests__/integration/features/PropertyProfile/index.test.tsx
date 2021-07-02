import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { admin as user } from '../../../../__mocks__/users';
import PropertyProfile from '../../../../features/PropertyProfile';
import breakpoints from '../../../../config/breakpoints';

function render(ui: any, options: any = {}) {
  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: contextWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Profile', () => {
  it('renders only mobile content for mobile devices', () => {
    render(<PropertyProfile user={user} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });
    const desktopHeader = screen.queryByTestId('property-profile-header');
    const propertyProfileOverview = screen.queryByTestId(
      'property-profile-overview'
    );
    const propertyProfileGridHeader = screen.queryByTestId('grid-header');

    const mobileHeader = screen.queryByTestId('property-profile-header-mobile');
    const mobileInspections = screen.queryByTestId(
      'property-profile-mobile-inspections'
    );
    const mobileFooter = screen.queryByTestId('property-profile-mobile-footer');

    expect(desktopHeader).toBeNull();
    expect(propertyProfileOverview).toBeNull();
    expect(propertyProfileGridHeader).toBeNull();

    expect(mobileHeader).toBeTruthy();
    expect(mobileInspections).toBeTruthy();
    expect(mobileFooter).toBeTruthy();
  });

  it('renders only desktop content for desktop devices', () => {
    render(<PropertyProfile user={user} />, {
      contextWidth: breakpoints.desktop.minWidth
    });
    const desktopHeader = screen.queryByTestId('property-profile-header');
    const propertyProfileOverview = screen.queryByTestId(
      'property-profile-overview'
    );
    const propertyProfileGridHeader = screen.queryByTestId('grid-header');

    const mobileHeader = screen.queryByTestId('property-profile-header-mobile');
    const mobileInspections = screen.queryByTestId(
      'property-profile-mobile-inspections'
    );
    const mobileFooter = screen.queryByTestId('property-profile-mobile-footer');

    expect(desktopHeader).toBeTruthy();
    expect(propertyProfileOverview).toBeTruthy();
    expect(propertyProfileGridHeader).toBeTruthy();

    // Should be null as it is desktop
    expect(mobileHeader).toBeNull();
    expect(mobileInspections).toBeNull();
    expect(mobileFooter).toBeNull();
  });
});
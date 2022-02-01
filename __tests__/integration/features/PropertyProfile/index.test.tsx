import sinon from 'sinon';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import mockTemplateCategories from '../../../../__mocks__/templateCategories';
import mockInspections from '../../../../__mocks__/inspections';
import mockYardiAuth from '../../../../__mocks__/yardi/authorization';
import PropertyProfile from '../../../../features/PropertyProfile';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';

const FORCE_VISIBLE = true;

function render(ui: any, options: any = {}) {
  sinon.restore();

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ResponsiveContext.Provider value={{ width: contextWidth }}>
        {ui}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </ResponsiveContext.Provider>
    </FirebaseAppProvider>,
    options
  );
}

describe('Integration | Features | Properties | Profile', () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('renders only mobile content for mobile devices', () => {
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
        property={fullProperty}
        templateCategories={mockTemplateCategories}
        inspections={mockInspections}
        yardiAuthorizer={mockYardiAuth}
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );
    const desktopHeader = screen.queryByTestId('property-profile-header');
    const propertyProfileOverview = screen.queryByTestId(
      'property-profile-overview'
    );
    const propertyProfileGridHeader = screen.queryByTestId('grid-header');

    const mobileHeader = screen.queryByTestId('property-profile-header-mobile');
    const mobileInspections = screen.queryByTestId(
      'property-profile-mobile-inspections'
    );
    const mobileSubHeader = screen.queryByTestId(
      'property-profile-mobile-subHeader'
    );

    expect(desktopHeader).toBeNull();
    expect(propertyProfileOverview).toBeNull();
    expect(propertyProfileGridHeader).toBeNull();

    expect(mobileHeader).toBeTruthy();
    expect(mobileInspections).toBeTruthy();
    expect(mobileSubHeader).toBeTruthy();
  });

  it('renders only desktop content for desktop devices', () => {
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
        property={fullProperty}
        templateCategories={mockTemplateCategories}
        inspections={mockInspections}
        yardiAuthorizer={mockYardiAuth}
      />,
      {
        contextWidth: breakpoints.desktop.minWidth
      }
    );
    const desktopHeader = screen.queryByTestId('property-profile-header');
    const propertyProfileOverview = screen.queryByTestId(
      'property-profile-overview'
    );
    const propertyProfileGridHeader = screen.queryByTestId('grid-header');

    const mobileHeader = screen.queryByTestId('property-profile-header-mobile');
    const mobileInspections = screen.queryByTestId(
      'property-profile-mobile-inspections'
    );
    const mobileSubHeader = screen.queryByTestId(
      'property-profile-mobile-subHeader'
    );

    expect(desktopHeader).toBeTruthy();
    expect(propertyProfileOverview).toBeTruthy();
    expect(propertyProfileGridHeader).toBeTruthy();

    // Should be null as it is desktop
    expect(mobileHeader).toBeNull();
    expect(mobileInspections).toBeNull();
    expect(mobileSubHeader).toBeNull();
  });

  it('should show only completed inspections for desktop devices', () => {
    const expected = 2;
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
        property={fullProperty}
        templateCategories={mockTemplateCategories}
        inspections={mockInspections}
        yardiAuthorizer={mockYardiAuth}
      />,
      {
        contextWidth: breakpoints.desktop.minWidth
      }
    );

    const filterControl = screen.queryByTestId('inspections-filter');

    if (filterControl) {
      fireEvent.change(filterControl, { target: { value: 'completed' } });
    }

    const listItems = screen.queryAllByTestId('inspection-grid-listitem');

    expect(listItems.length).toEqual(expected);
  });

  it('should show only incomplete inspections for desktop devices', () => {
    const expected = 1;
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
        property={fullProperty}
        templateCategories={mockTemplateCategories}
        inspections={mockInspections}
        yardiAuthorizer={mockYardiAuth}
      />,
      {
        contextWidth: breakpoints.desktop.minWidth
      }
    );

    const filterControl = screen.queryByTestId('inspections-filter');

    if (filterControl) {
      fireEvent.change(filterControl, { target: { value: 'incomplete' } });
    }

    const listItems = screen.queryAllByTestId('inspection-grid-listitem');

    expect(listItems.length).toEqual(expected);
  });

  it('should show only deficient exists inspections for desktop devices', () => {
    const expected = 1;
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
        property={fullProperty}
        templateCategories={mockTemplateCategories}
        inspections={mockInspections}
        yardiAuthorizer={mockYardiAuth}
      />,
      {
        contextWidth: breakpoints.desktop.minWidth
      }
    );

    const filterControl = screen.queryByTestId('inspections-filter');

    if (filterControl) {
      fireEvent.change(filterControl, {
        target: { value: 'deficienciesExist' }
      });
    }

    const listItems = screen.queryAllByTestId('inspection-grid-listitem');

    expect(listItems.length).toEqual(expected);
  });

  it('should show only completed inspections for mobile devices', () => {
    const expected = 2;
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
        property={fullProperty}
        templateCategories={mockTemplateCategories}
        inspections={mockInspections}
        yardiAuthorizer={mockYardiAuth}
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    const filterControl = screen.queryByTestId('inspections-filter');

    if (filterControl) {
      userEvent.click(filterControl);
    }

    const listItems = screen.queryAllByTestId(
      'property-profile-inspection-list-item'
    );

    expect(listItems.length).toEqual(expected);
  });

  it('should show only incomplete inspections for mobile devices', () => {
    const expected = 1;
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
        property={fullProperty}
        templateCategories={mockTemplateCategories}
        inspections={mockInspections}
        yardiAuthorizer={mockYardiAuth}
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    const filterControl = screen.queryByTestId('inspections-filter');

    if (filterControl) {
      userEvent.click(filterControl);
      userEvent.click(filterControl);
    }

    const listItems = screen.queryAllByTestId(
      'property-profile-inspection-list-item'
    );

    expect(listItems.length).toEqual(expected);
  });

  it('should show only deficient exists inspections for mobile devices', () => {
    const expected = 1;
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
        property={fullProperty}
        templateCategories={mockTemplateCategories}
        inspections={mockInspections}
        yardiAuthorizer={mockYardiAuth}
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );

    const filterControl = screen.queryByTestId('inspections-filter');

    if (filterControl) {
      userEvent.click(filterControl);
      userEvent.click(filterControl);
      userEvent.click(filterControl);
    }

    const listItems = screen.queryAllByTestId(
      'property-profile-inspection-list-item'
    );

    expect(listItems.length).toEqual(expected);
  });
});

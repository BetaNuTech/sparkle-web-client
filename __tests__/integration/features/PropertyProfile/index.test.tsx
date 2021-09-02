import sinon from 'sinon';
import {
  render as rtlRender,
  act,
  screen,
  fireEvent
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import mockTemplateCategories from '../../../../__mocks__/templateCategories';
import mockInspections from '../../../../__mocks__/inspections';
import PropertyProfile from '../../../../features/PropertyProfile';
import propertiesApi, {
  propertyResult
} from '../../../../common/services/firestore/properties';
import templateCategoriesApi, {
  templateCategoriesCollectionResult
} from '../../../../common/services/firestore/templateCategories';
import inspectionsApi, {
  inspectionCollectionResult
} from '../../../../common/services/firestore/inspections';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';
import { shuffle } from '../../../helpers/array';
import deepClone from '../../../helpers/deepClone';

const FORCE_VISIBLE = true;

function render(ui: any, options: any = {}) {
  sinon.restore();
  // Stub all properties requests
  const propertyPayload: propertyResult = {
    status: options.propertyStatus || 'success',
    error: options.propertyError || null,
    data: options.property || fullProperty
  };
  sinon.stub(propertiesApi, 'findRecord').returns(propertyPayload);

  // Stub all template categories
  const templateCategoriesPayload: templateCategoriesCollectionResult = {
    status: options.templateCategoriesStatus || 'success',
    error: options.templateCategoriesError || null,
    data: options.templateCategories || mockTemplateCategories
  };
  sinon
    .stub(templateCategoriesApi, 'findAll')
    .returns(templateCategoriesPayload);

  // Stub all property inspections
  const inspectionsPayload: inspectionCollectionResult = {
    status: options.inspectionsStatus || 'success',
    error: options.inspectionsError || null,
    data: options.inspections || mockInspections
  };
  sinon.stub(inspectionsApi, 'queryByProperty').returns(inspectionsPayload);

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
    const mobileFooter = screen.queryByTestId('property-profile-mobile-footer');

    expect(desktopHeader).toBeNull();
    expect(propertyProfileOverview).toBeNull();
    expect(propertyProfileGridHeader).toBeNull();

    expect(mobileHeader).toBeTruthy();
    expect(mobileInspections).toBeTruthy();
    expect(mobileFooter).toBeTruthy();
  });

  it('renders only desktop content for desktop devices', () => {
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
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
    const mobileFooter = screen.queryByTestId('property-profile-mobile-footer');

    expect(desktopHeader).toBeTruthy();
    expect(propertyProfileOverview).toBeTruthy();
    expect(propertyProfileGridHeader).toBeTruthy();

    // Should be null as it is desktop
    expect(mobileHeader).toBeNull();
    expect(mobileInspections).toBeNull();
    expect(mobileFooter).toBeNull();
  });

  it('should show only completed inspections for desktop devices', () => {
    const expected = 2;
    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
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

  it('automatically sorts by descending inspection creation date for desktop users', async () => {
    const times = [1625244317, 1625244316, 1625244315];
    const expected = times.map((c) => `${c}`).join(' | ');
    const inspections = deepClone(mockInspections);
    shuffle(times).forEach((time, i) => {
      if (inspections[i]) {
        inspections[i].creationDate = time;
      }
    });

    render(
      <PropertyProfile
        user={user}
        id="property-1"
        forceVisible={FORCE_VISIBLE}
      />,
      {
        inspections: shuffle(inspections), // randomized inspections
        contextWidth: breakpoints.desktop.minWidth // set to desktop UI
      }
    );

    const inspectionCreationDate: Array<HTMLElement> = screen.queryAllByTestId(
      'inspection-grid-list-item-creation-date'
    );
    const actual = inspectionCreationDate
      .map((item) => item.getAttribute('data-time'))
      .join(' | ');
    expect(actual).toEqual(expected);
  });

  it('sorts inspections by inspector name', async () => {
    const inspectors = ['matt jensen', 'john wick', 'aaron thompson'];
    const expected = inspectors.map((c) => `${c.toLowerCase()}`).join(' | ');
    const inspections = deepClone(mockInspections);
    inspectors.forEach((inspector, i) => {
      if (inspections[i]) {
        inspections[i].inspectorName = inspector;
      }
    });

    await act(async () => {
      const { container } = render(
        <PropertyProfile
          user={user}
          id="property-1"
          forceVisible={FORCE_VISIBLE}
        />,
        {
          inspections: shuffle(inspections) // randomized inspections
        }
      );

      const sortInspector = container.querySelector(
        '[data-testid=grid-head-inspector-name]'
      );
      await userEvent.click(sortInspector);
    });

    const propertyItems: Array<HTMLElement> = screen.queryAllByTestId(
      'inspection-grid-list-item-creator'
    );
    const actual = propertyItems
      .map((item) => item.textContent.trim().toLowerCase())
      .join(' | ');
    expect(actual).toEqual(expected);
  });

  it('sorts inspections by inspector name 22', async () => {
    const inspectors = ['matt jensen', 'john wick', 'aaron thompson'];
    const expected = inspectors.map((c) => `${c.toLowerCase()}`).join(' | ');
    const inspections = deepClone(mockInspections);
    inspectors.forEach((inspector, i) => {
      if (inspections[i]) {
        inspections[i].inspectorName = inspector;
      }
    });

    await act(async () => {
      const { container } = render(
        <PropertyProfile
          user={user}
          id="property-1"
          forceVisible={FORCE_VISIBLE}
        />,
        {
          inspections: shuffle(inspections) // randomized inspections
        }
      );

      const sortInspector = container.querySelector(
        '[data-testid=grid-head-inspector-name]'
      );
      await userEvent.click(sortInspector);
    });

    const propertyItems: Array<HTMLElement> = screen.queryAllByTestId(
      'inspection-grid-list-item-creator'
    );
    const actual = propertyItems
      .map((item) => item.textContent.trim().toLowerCase())
      .join(' | ');
    expect(actual).toEqual(expected);
  });
});

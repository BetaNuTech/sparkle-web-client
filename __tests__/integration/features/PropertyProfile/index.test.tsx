import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastProvider } from 'react-toast-notifications';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import mockTemplateCategories from '../../../../__mocks__/templateCategories';
import { fullInspection, inspectionA } from '../../../../__mocks__/inspections';
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
    data: options.inspections || [fullInspection, inspectionA]
  };
  sinon.stub(inspectionsApi, 'queryByProperty').returns(inspectionsPayload);

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ToastProvider>
        <ResponsiveContext.Provider value={{ width: contextWidth }}>
          {ui}
        </ResponsiveContext.Provider>
      </ToastProvider>
    </FirebaseAppProvider>,
    options
  );
}

describe('Integration | Features | Properties | Profile', () => {
  it('renders only mobile content for mobile devices', () => {
    render(<PropertyProfile user={user} id="property-1" />, {
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
    render(<PropertyProfile user={user} id="property-1" />, {
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

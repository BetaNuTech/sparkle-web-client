import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import mockTemplateCategories from '../../../../__mocks__/templateCategories';
import mockTemplates from '../../../../__mocks__/templates';
import CreateInspection from '../../../../features/CreateInspection';
import propertiesApi, {
  propertyResult
} from '../../../../common/services/firestore/properties';
import templateCategoriesApi, {
  templateCategoriesCollectionResult
} from '../../../../common/services/firestore/templateCategories';
import templatesApi, {
  templatesCollectionResult
} from '../../../../common/services/firestore/templates';
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

  // Stub all property templates
  const templatesPayload: templatesCollectionResult = {
    status: options.templateStatus || 'success',
    error: options.templateError || null,
    data: options.templates || mockTemplates
  };
  sinon.stub(templatesApi, 'queryByProperty').returns(templatesPayload);

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

describe('Integration | Features | Create Inspection', () => {
  it('renders all categories headings', () => {
    const expected = 3;
    render(<CreateInspection user={user} propertyId="property-1" />);

    const categoryHeads = screen.queryAllByTestId('template-category-item');
    const actual = categoryHeads.length;
    expect(actual).toEqual(expected);
  });

  it('renders all templates for all category', () => {
    const expected = mockTemplates.length;
    render(<CreateInspection user={user} propertyId="property-1" />);

    const listItems = screen.queryAllByTestId('template-category-list-item');
    const actual = listItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders all templates for each category', () => {
    const expected = '2 | 2 | 2';
    render(<CreateInspection user={user} propertyId="property-1" />);

    const listItems = screen.queryAllByTestId('template-category-item');

    const actual = listItems
      .map(
        (category) =>
          category.querySelectorAll('[data-testid=template-category-list-item]')
            .length
      )
      .join(' | ');

    expect(actual).toEqual(expected);
  });
});

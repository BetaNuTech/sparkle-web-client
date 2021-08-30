import sinon from 'sinon';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import mockTemplateCategories from '../../../../__mocks__/templateCategories';
import mockTemplates from '../../../../__mocks__/templates';
import mockTeams from '../../../../__mocks__/teams';
import PropertyEdit from '../../../../features/PropertyEdit';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';
import propertiesAPI from '../../../../common/services/api/properties';
import deepClone from '../../../helpers/deepClone';

function render(ui: any, options: any = {}) {
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

describe('Integration | Features | Property Edit', () => {
  afterEach(() => sinon.restore());

  it('should allow users to unselect and submit templates', async () => {
    const expected = {
      'template-2': true
    };
    const [template] = mockTemplates;
    const onSave = sinon.stub(propertiesAPI, 'update').resolves(fullProperty);
    const props = {
      isOnline: true,
      user,
      id: fullProperty.id,
      propertyId: '123',
      property: fullProperty,
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />);

    const templatesButton = screen.getByTestId('templates-button-desktop');
    userEvent.click(templatesButton);
    await waitFor(() => screen.queryByTestId('property-edit-template-modal'));
    const template1 = screen.getByTestId(`checkbox-item-${template.id}`);
    const save = screen.getByTestId('save-button-desktop');
    await userEvent.click(template1);
    await userEvent.click(save);

    const result = onSave.firstCall || { args: [] };
    const payload = result.args[1] || { templates: [] };
    const actual = payload.templates;
    expect(actual).toEqual(expected);
  });

  it('should allow users to select and submit templates', async () => {
    const expected = {
      'template-1': true,
      'template-2': true,
      'template-3': true,
      'template-4': true
    };
    const [template] = mockTemplates;
    const property = deepClone(fullProperty);
    (property.templates || {})[template.id] = true; // add template to property
    const onSave = sinon.stub(propertiesAPI, 'update').resolves(fullProperty);
    const props = {
      isOnline: true,
      user,
      id: fullProperty.id,
      propertyId: '123',
      property: fullProperty,
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />);

    const templatesButton = screen.getByTestId('templates-button-desktop');
    userEvent.click(templatesButton);
    screen.queryByTestId('property-edit-template-modal');
    const template3 = screen.getByTestId('checkbox-item-template-3');
    const template4 = screen.getByTestId('checkbox-item-template-4');
    const save = screen.getByTestId('save-button-desktop');
    await userEvent.click(template3);
    await userEvent.click(template4);
    await userEvent.click(save);

    const result = onSave.firstCall || { args: [] };
    const payload = result.args[1] || { templates: [] };
    const actual = payload.templates;
    expect(actual).toEqual(expected);
  });

  it('should allow users to unselect team and submit', async () => {
    const expected = '';
    const onSave = sinon.stub(propertiesAPI, 'update').resolves(fullProperty);
    const props = {
      isOnline: true,
      user,
      id: fullProperty.id,
      propertyId: '123',
      property: fullProperty,
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />);

    const teamButton = screen.getByTestId('team-button-desktop');
    userEvent.click(teamButton);
    screen.queryByTestId('update-team-modal');
    const team1 = screen.getByTestId('checkbox-item-team-1');
    await userEvent.click(team1);
    await userEvent.click(team1);
    const save = screen.getByTestId('save-button-desktop');
    await userEvent.click(save);

    const result = onSave.firstCall || { args: [] };
    const payload = result.args[1] || { team: 'team-1' };
    const actual = payload.team;

    expect(actual).toEqual(expected);
  });

  it('should allow users to select team and submit', async () => {
    const expected = 'team-2';
    const onSave = sinon.stub(propertiesAPI, 'update').resolves(fullProperty);
    const props = {
      isOnline: true,
      user,
      id: fullProperty.id,
      propertyId: '123',
      property: fullProperty,
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />);

    const teamButton = screen.getByTestId('team-button-desktop');
    userEvent.click(teamButton);
    screen.queryByTestId('update-team-modal');
    const team2 = screen.getByTestId('checkbox-item-team-2');
    const save = screen.getByTestId('save-button-desktop');
    await userEvent.click(team2);
    await userEvent.click(save);

    const result = onSave.firstCall || { args: [] };
    const payload = result.args[1] || { team: '' };
    const actual = payload.team;
    expect(actual).toEqual(expected);
  });
});

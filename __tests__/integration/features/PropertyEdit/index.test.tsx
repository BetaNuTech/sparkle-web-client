import sinon from 'sinon';
import Router from 'next/router';
import {
  render as rtlRender,
  screen,
  waitFor,
  act,
  fireEvent
} from '@testing-library/react';
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
import propertiesApi from '../../../../common/services/api/properties';
import deepClone from '../../../helpers/deepClone';
import propertyFormErrors from '../../../../features/PropertyEdit/errors';
import { unselectedAbcItem } from '../../../../__mocks__/inspections';

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
    const templates = [...mockTemplates].map((template) => ({
      ...template,
      items: { 'item-1': unselectedAbcItem }
    }));
    const [template] = templates;

    const onSave = sinon
      .stub(propertiesApi, 'updateProperty')
      .resolves(fullProperty);
    const props = {
      isOnline: true,
      user,
      property: fullProperty,
      teams: mockTeams,
      templates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />);

    const templatesButton = screen.getByTestId('templates-button-desktop');
    await act(async () => {
      await userEvent.click(templatesButton);
    });
    await waitFor(() => screen.queryByTestId('property-edit-template-modal'));
    const template1 = screen.getByTestId(`checkbox-item-${template.id}`);
    const save = screen.getByTestId('save-button-desktop');
    await act(async () => {
      await userEvent.click(template1);
      await userEvent.click(save);
    });

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
    const templates = [...mockTemplates].map((template) => ({
      ...template,
      items: { 'item-1': unselectedAbcItem }
    }));
    const [template] = templates;

    const property = deepClone(fullProperty);
    (property.templates || {})[template.id] = true; // add template to property
    const onSave = sinon
      .stub(propertiesApi, 'updateProperty')
      .resolves(fullProperty);
    const props = {
      isOnline: true,
      user,
      property: fullProperty,
      teams: mockTeams,
      templates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />);

    const templatesButton = screen.getByTestId('templates-button-desktop');
    userEvent.click(templatesButton);
    screen.queryByTestId('property-edit-template-modal');
    const template3 = screen.getByTestId('checkbox-item-template-3');
    const template4 = screen.getByTestId('checkbox-item-template-4');
    const save = screen.getByTestId('save-button-desktop');
    await act(async () => {
      await userEvent.click(template3);
      await userEvent.click(template4);
      await userEvent.click(save);
    });

    const result = onSave.firstCall || { args: [] };
    const payload = result.args[1] || { templates: [] };
    const actual = payload.templates;
    expect(actual).toEqual(expected);
  });

  it('should allow users to unselect team and submit', async () => {
    const expected = '';
    const onSave = sinon
      .stub(propertiesApi, 'updateProperty')
      .resolves(fullProperty);
    const props = {
      isOnline: true,
      user,
      property: fullProperty,
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />);

    const teamButton = screen.getByTestId('team-button-desktop');
    await userEvent.click(teamButton);
    screen.queryByTestId('update-team-modal');
    const team1 = screen.getByTestId('checkbox-item-team-1');
    await userEvent.click(team1);
    const save = screen.getByTestId('save-button-desktop');
    await act(async () => {
      await userEvent.click(save);
    });

    const result = onSave.firstCall || { args: [] };
    const payload = result.args[1] || { team: 'team-1' };
    const actual = payload.team;

    expect(actual).toEqual(expected);
  });

  it('should allow users to select team and submit', async () => {
    const expected = 'team-2';
    const onSave = sinon
      .stub(propertiesApi, 'updateProperty')
      .resolves(fullProperty);
    const props = {
      isOnline: true,
      user,
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
    await act(async () => {
      await userEvent.click(save);
    });

    const result = onSave.firstCall || { args: [] };
    const payload = result.args[1] || { team: '' };
    const actual = payload.team;
    expect(actual).toEqual(expected);
  });

  it('publishes a new property when it does not exist yet', async () => {
    const expected = true;
    const props = {
      isOnline: true,
      user,
      property: { name: '' },
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const postReq = sinon.stub(propertiesApi, 'createProperty').resolves({});
    sinon.stub(Router, 'push').returns();

    await act(async () => {
      const [save] = await screen.findAllByTestId('save-button-desktop');
      const nameInput = await screen.findByTestId('property-form-name');
      await fireEvent.change(nameInput, { target: { value: 'New Property' } });
      await userEvent.click(save);
    });

    const actual = postReq.called;
    expect(actual).toEqual(expected);
  });

  it('updates a property when it already exists', async () => {
    const expected = true;
    const props = {
      isOnline: true,
      user,
      property: fullProperty,
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const putReq = sinon.stub(propertiesApi, 'updateProperty').resolves({});

    await act(async () => {
      const [save] = await screen.findAllByTestId('save-button-desktop');
      const nameInput = await screen.findByTestId('property-form-name');
      await fireEvent.change(nameInput, { target: { value: 'Update' } });
      await userEvent.click(save);
    });

    const actual = putReq.called;
    expect(actual).toEqual(expected);
  });

  it('publishes an updated logo to property, along with other updates', async () => {
    const expected = [true, true];
    const props = {
      isOnline: true,
      user,
      property: fullProperty,
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const putReq = sinon.stub(propertiesApi, 'updateProperty').resolves({});
    const postImage = sinon.stub(propertiesApi, 'uploadImage').resolves({
      id: fullProperty.id,
      name: fullProperty.name,
      logoName: 'test.png',
      logoURL: 'a.co/test.png'
    });

    await act(async () => {
      const [save] = await screen.findAllByTestId('save-button-desktop');
      const nameInput = screen.getByTestId('property-form-name');
      const logoInput = screen.getByTestId('property-form-add-logo');
      fireEvent.change(nameInput, { target: { value: 'Update' } });
      fireEvent.change(logoInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
        }
      });
      userEvent.click(save);
    });

    const actual = [putReq.called, postImage.called];
    expect(actual).toEqual(expected);
  });

  it('publishes an updated profile image to property, along with other updates', async () => {
    const expected = [true, true];
    const props = {
      isOnline: true,
      user,
      property: fullProperty,
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const putReq = sinon.stub(propertiesApi, 'updateProperty').resolves({});
    const postImage = sinon.stub(propertiesApi, 'uploadImage').resolves({
      id: fullProperty.id,
      name: fullProperty.name,
      photoName: 'test.png',
      photoURL: 'a.co/test.png'
    });

    await act(async () => {
      const [save] = await screen.findAllByTestId('save-button-desktop');
      const nameInput = screen.getByTestId('property-form-name');
      const profileImgInput = screen.getByTestId('property-form-add-image');
      fireEvent.change(nameInput, { target: { value: 'Update' } });
      fireEvent.change(profileImgInput, {
        target: {
          files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
        }
      });
      userEvent.click(save);
    });

    const actual = [putReq.called, postImage.called];
    expect(actual).toEqual(expected);
  });

  it('shows form name error label when empty while creating a new property', async () => {
    const expected = propertyFormErrors.nameRequired;
    const props = {
      isOnline: true,
      user,
      property: { name: '' },
      teams: mockTeams,
      templates: mockTemplates,
      templateCategories: mockTemplateCategories
    };
    render(<PropertyEdit {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    await act(async () => {
      const [save] = await screen.findAllByTestId('save-button-desktop');
      await userEvent.click(save);
    });

    const formErrorNameRequired = screen.queryByTestId(
      'error-label-nameRequired'
    ) as HTMLElement;

    const actual = formErrorNameRequired
      ? formErrorNameRequired.textContent
      : '';
    expect(actual).toEqual(expected);
  });
});

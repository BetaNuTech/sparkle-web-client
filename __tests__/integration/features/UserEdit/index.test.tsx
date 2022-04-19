import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import { admin, noAccess, teamLead } from '../../../../__mocks__/users';
import properties from '../../../../__mocks__/properties';
import teams from '../../../../__mocks__/teams';
import UserModel from '../../../../common/models/user';
import UserEdit from '../../../../features/UserEdit/index';
import { errors } from '../../../../features/UserEdit/hooks/useUserEdit';
import wait from '../../../helpers/wait';
import userApi from '../../../../common/services/api/users';
import ErrorBadRequest from '../../../../common/models/errors/badRequest';
import errorReports from '../../../../common/services/api/errorReports';

describe('Integration | features | User Edit', () => {
  afterEach(() => sinon.restore());

  it('should render "Add User" title when creating new user', () => {
    const expected = 'Add User';
    const props = {
      properties,
      teams,
      user: admin,
      target: { id: 'new' } as UserModel,
      isOnline: true
    };
    render(<UserEdit {...props} />);

    const titleEl = screen.queryByTestId('user-edit-header-title');
    expect(titleEl).toHaveTextContent(expected);
  });

  it('should render "Edit User" title when updating user', () => {
    const expected = 'Edit User';
    const props = {
      properties,
      teams,
      user: admin,
      target: admin,
      isOnline: true
    };
    render(<UserEdit {...props} />);

    const titleEl = screen.queryByTestId('user-edit-header-title');
    expect(titleEl).toHaveTextContent(expected);
  });

  it('should check and show errors for empty states', async () => {
    const props = {
      properties,
      teams,
      user: admin,
      target: admin,
      isOnline: true
    };
    render(<UserEdit {...props} />);

    const firstNameEl = screen.queryByTestId('user-edit-first-name-input');
    const lastNameEl = screen.queryByTestId('user-edit-last-name-input');

    await act(async () => {
      fireEvent.change(firstNameEl, { target: { value: '' } });
      fireEvent.change(lastNameEl, { target: { value: '' } });
      await waitFor(() => wait());
    });

    const formErrorFirstName = screen.queryByTestId(
      'error-label-firstName'
    ) as HTMLElement;

    const formErrorLastName = screen.queryByTestId(
      'error-label-lastName'
    ) as HTMLElement;

    expect(formErrorFirstName).toBeTruthy();
    expect(formErrorFirstName).toHaveTextContent(errors.firstName);

    expect(formErrorLastName).toBeTruthy();
    expect(formErrorLastName).toHaveTextContent(errors.lastName);
  });

  it('should check and show errors for invalid email', async () => {
    const props = {
      properties,
      teams,
      user: admin,
      target: { id: 'new' } as UserModel,
      isOnline: true
    };
    render(<UserEdit {...props} />);

    const emailEl = screen.queryByTestId('user-edit-email-input');

    await act(async () => {
      fireEvent.change(emailEl, { target: { value: 'test' } });
      await waitFor(() => wait());
    });
    const formErrorEmail = screen.queryByTestId('error-label-email');

    expect(formErrorEmail).toBeTruthy();
    expect(formErrorEmail).toHaveTextContent(errors.invalidEmail);
  });

  it('should render only first/last name and email fields when creating a new user', () => {
    const props = {
      properties,
      teams,
      user: admin,
      target: { id: 'new' } as UserModel,
      isOnline: true,
      sendNotification: sinon.spy()
    };
    render(<UserEdit {...props} />);

    const emailEl = screen.queryByTestId('user-edit-email-input');
    const firstNameEl = screen.queryByTestId('user-edit-first-name-input');
    const lastNameEl = screen.queryByTestId('user-edit-last-name-input');
    const adminEl = screen.queryByTestId('user-edit-admin-input');
    const corporateEl = screen.queryByTestId('user-edit-corporate-input');
    const teamsEl = screen.queryByTestId('user-edit-teams-input');
    const propertiesEl = screen.queryByTestId('user-edit-properties-input');
    const isDisabledEl = screen.queryByTestId('user-edit-isDisabled-input');
    const pushOptOutEl = screen.queryByTestId('user-edit-pushOptOut-input');

    // Should render First Name,Last Name and Email
    expect(emailEl).toBeTruthy();
    expect(firstNameEl).toBeTruthy();
    expect(lastNameEl).toBeTruthy();

    // Should not render other fields
    expect(adminEl).toBeFalsy();
    expect(corporateEl).toBeFalsy();
    expect(teamsEl).toBeFalsy();
    expect(propertiesEl).toBeFalsy();
    expect(isDisabledEl).toBeFalsy();
    expect(pushOptOutEl).toBeFalsy();
  });

  it('should render all fields except email and push opt out when updating another user as admin', () => {
    const props = {
      properties,
      teams,
      user: admin,
      target: teamLead,
      isOnline: true,
      sendNotification: sinon.spy()
    };
    render(<UserEdit {...props} />);

    const emailEl = screen.queryByTestId('user-edit-email-input');
    const firstNameEl = screen.queryByTestId('user-edit-first-name-input');
    const lastNameEl = screen.queryByTestId('user-edit-last-name-input');
    const adminEl = screen.queryByTestId('user-edit-admin-input');
    const corporateEl = screen.queryByTestId('user-edit-corporate-input');
    const teamsEl = screen.queryByTestId('user-edit-teams-input');
    const propertiesEl = screen.queryByTestId('user-edit-properties-input');
    const isDisabledEl = screen.queryByTestId('user-edit-isDisabled-input');
    const pushOptOutEl = screen.queryByTestId('user-edit-pushOptOut-input');

    // Should not render Email and pushOptOut
    expect(emailEl).toBeFalsy();
    expect(pushOptOutEl).toBeFalsy();

    // Should render other fields
    expect(firstNameEl).toBeTruthy();
    expect(lastNameEl).toBeTruthy();
    expect(adminEl).toBeTruthy();
    expect(corporateEl).toBeTruthy();
    expect(teamsEl).toBeTruthy();
    expect(propertiesEl).toBeTruthy();
    expect(isDisabledEl).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it('should render only first/last name and push opt out fields for non-admins updating their own profile', async () => {
    const props = {
      properties,
      teams,
      user: teamLead,
      target: teamLead,
      isOnline: true,
      sendNotification: sinon.spy()
    };
    render(<UserEdit {...props} />);

    await waitFor(() => wait());
    const emailEl = screen.queryByTestId('user-edit-email-input');
    const firstNameEl = screen.queryByTestId('user-edit-first-name-input');
    const lastNameEl = screen.queryByTestId('user-edit-last-name-input');
    const adminEl = screen.queryByTestId('user-edit-admin-input');
    const corporateEl = screen.queryByTestId('user-edit-corporate-input');
    const teamsEl = screen.queryByTestId('user-edit-teams-input');
    const propertiesEl = screen.queryByTestId('user-edit-properties-input');
    const isDisabledEl = screen.queryByTestId('user-edit-isDisabled-input');
    const pushOptOutEl = screen.queryByTestId('user-edit-pushOptOut-input');

    // Should render First Name, Last Name and pushOptOut
    expect(firstNameEl).toBeTruthy();
    expect(lastNameEl).toBeTruthy();
    expect(pushOptOutEl).toBeTruthy();

    // Should not render other fields
    expect(emailEl).toBeFalsy();
    expect(adminEl).toBeFalsy();
    expect(corporateEl).toBeFalsy();
    expect(teamsEl).toBeFalsy();
    expect(propertiesEl).toBeFalsy();
    expect(isDisabledEl).toBeFalsy();
  });

  it('should requst to create new user after completing new user form', async () => {
    const expected = {
      firstName: 'First',
      lastName: 'Last',
      email: 'test@test.com'
    };
    const createCall = sinon.stub(userApi, 'createRecord');

    const props = {
      properties,
      teams,
      user: admin,
      target: { id: 'new' } as UserModel,
      isOnline: true,
      sendNotification: sinon.spy()
    };
    render(<UserEdit {...props} />);

    const firstNameEl = screen.queryByTestId('user-edit-first-name-input');
    const lastNameEl = screen.queryByTestId('user-edit-last-name-input');
    const emailEl = screen.queryByTestId('user-edit-email-input');
    const actionEl = screen.queryAllByTestId('user-edit-save-button')[0];

    await act(async () => {
      fireEvent.change(emailEl, { target: { value: expected.email } });
      fireEvent.change(firstNameEl, { target: { value: expected.firstName } });
      fireEvent.change(lastNameEl, { target: { value: expected.lastName } });
    });

    act(() => {
      fireEvent.click(actionEl);
    });
    await waitFor(() => wait());

    const actual = createCall.getCall(0).args[0];
    expect(actual).toMatchObject(expected);
  });

  it('should requst to update user after valid updates to update user form', async () => {
    const expectedTeamId = teams[0].id;
    const expectedPropertyId = properties[0].id;
    const expected = {
      firstName: 'First',
      lastName: 'Last',
      admin: true,
      corporate: true,
      isDisabled: true,
      teams: {
        [expectedTeamId]: true
      },
      properties: {
        [expectedPropertyId]: true
      }
    };

    const updateCall = sinon.stub(userApi, 'updateRecord');

    const props = {
      properties,
      teams,
      user: admin,
      target: noAccess,
      isOnline: true,
      sendNotification: sinon.spy()
    };
    render(<UserEdit {...props} />);

    const firstNameEl = screen.queryByTestId('user-edit-first-name-input');
    const lastNameEl = screen.queryByTestId('user-edit-last-name-input');
    const adminEl = screen.queryByTestId('user-edit-admin-input');
    const corporateEl = screen.queryByTestId('user-edit-corporate-input');
    const isDisabledEl = screen.queryByTestId('user-edit-isDisabled-input');
    const teamsEl = screen.queryByTestId('user-edit-teams-input');
    const propertiesEl = screen.queryByTestId('user-edit-properties-input');

    const actionEl = screen.queryAllByTestId('user-edit-save-button')[0];

    await act(async () => {
      await waitFor(() => wait(200));
      fireEvent.change(firstNameEl, { target: { value: expected.firstName } });
      await waitFor(() => wait());
      fireEvent.change(lastNameEl, { target: { value: expected.lastName } });
      await waitFor(() => wait());
      fireEvent.click(adminEl);
      await waitFor(() => wait());
      fireEvent.click(corporateEl);
      await waitFor(() => wait());
      fireEvent.click(isDisabledEl);
      await waitFor(() => wait());
    });

    act(() => {
      fireEvent.click(teamsEl);
    });

    const teamModal = screen.queryByTestId('user-edit-team-modal');
    await waitFor(() => teamModal);
    const teamItemEl = screen.queryByTestId(
      `modal-list-item-${expectedTeamId}`
    );

    await act(async () => {
      fireEvent.click(teamItemEl);
    });

    act(() => {
      fireEvent.click(propertiesEl);
    });

    const propertiesModal = screen.queryByTestId('user-edit-properties-modal');
    await waitFor(() => propertiesModal);
    const propertyItemEl = screen.queryByTestId(
      `modal-list-item-${expectedPropertyId}`
    );

    act(() => {
      fireEvent.click(propertyItemEl);
    });

    await act(async () => {
      expect(actionEl).toBeEnabled();
      fireEvent.click(actionEl);
    });

    const actual = updateCall.getCall(0).args[1];
    expect(actual).toMatchObject(expected);
  });

  it('should render a fields error label when a related bad request error is received', async () => {
    const expected = {
      firstName: 'first name error',
      lastName: 'last name error',
      email: 'email error'
    };
    const badRequestError = new ErrorBadRequest('bad request');
    badRequestError.addErrors([
      { source: { pointer: 'email' }, title: 'email', detail: expected.email }
    ]);
    sinon.stub(userApi, 'createRecord').rejects(badRequestError);

    const props = {
      properties,
      teams,
      user: admin,
      target: { id: 'new' } as UserModel,
      isOnline: true,
      sendNotification: sinon.spy()
    };
    render(<UserEdit {...props} />);

    const firstNameEl = screen.queryByTestId('user-edit-first-name-input');
    const lastNameEl = screen.queryByTestId('user-edit-last-name-input');
    const emailEl = screen.queryByTestId('user-edit-email-input');

    await act(async () => {
      fireEvent.change(emailEl, { target: { value: 'test@test.com' } });
      fireEvent.change(firstNameEl, { target: { value: 'First' } });
      fireEvent.change(lastNameEl, { target: { value: 'Last' } });
    });
    act(() => {
      const actionEl = screen.queryAllByTestId('user-edit-save-button')[0];
      expect(actionEl).toBeEnabled();
      fireEvent.click(actionEl);
    });
    await waitFor(() => wait());

    const formErrorEmail = screen.queryByTestId('error-label-email');

    expect(formErrorEmail).toBeTruthy();
    expect(formErrorEmail).toHaveTextContent(expected.email);
  });
});

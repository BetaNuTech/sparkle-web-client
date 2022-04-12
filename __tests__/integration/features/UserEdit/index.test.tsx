import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { admin } from '../../../../__mocks__/users';
import properties from '../../../../__mocks__/properties';
import teams from '../../../../__mocks__/teams';
import UserModel from '../../../../common/models/user';
import UserEdit from '../../../../features/UserEdit/index';
import { errors } from '../../../../features/UserEdit/hooks/useUserEdit';
import wait from '../../../helpers/wait';

describe('Integration | features | User Edit', () => {
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
});

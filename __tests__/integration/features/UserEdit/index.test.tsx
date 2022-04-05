import { render, screen } from '@testing-library/react';
import { admin } from '../../../../__mocks__/users';
import properties from '../../../../__mocks__/properties';
import teams from '../../../../__mocks__/teams';
import UserModel from '../../../../common/models/user';
import UserEdit from '../../../../features/UserEdit/index';

describe('Integration | features | User Edit', () => {
  it('should render "Add User" title when creating new user', async () => {
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

  it('should render "Edit User" title when updating user', async () => {
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
});

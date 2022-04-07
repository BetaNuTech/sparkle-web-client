import sinon from 'sinon';

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import useUserEdit, { errors } from './useUserEdit';
import UserModel from '../../../common/models/user';

describe('Unit | Features | Job Edit | Hooks | Use Validate Job Form', () => {
  afterEach(() => sinon.restore());

  test('should not allow user to publish until form is having publishable updates', async () => {
    const { result } = renderHook(() =>
      useUserEdit({ id: 'new' } as UserModel)
    );

    result.current.register('email', {
      required: errors.email
    });
    result.current.register('firstName', {
      required: errors.firstName
    });
    result.current.register('lastName', {
      required: errors.lastName
    });

    // disabled as email, first name and last name are missing
    expect(result.current.isDisabled).toBeTruthy();

    await act(async () => {
      await result.current.setValue('email', 'test@test.com', {
        shouldValidate: true
      });
    });

    // disabled as first name and last name are missing
    expect(result.current.isDisabled).toBeTruthy();

    await act(async () => {
      await result.current.setValue('firstName', 'Dan', {
        shouldValidate: true
      });
    });

    // disabled as last name are missing
    expect(result.current.isDisabled).toBeTruthy();

    await act(async () => {
      await result.current.setValue('lastName', 'Jonas', {
        shouldValidate: true
      });
    });

    // enabled as all required have values
    expect(result.current.isDisabled).toBeFalsy();
  });
});

import sinon from 'sinon';

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import {
  openImprovementJob,
  approvedImprovementJob,
  authorizedImprovementJob
} from '../../../__mocks__/jobs';
import formErrors from '../Form/errors';
import useValidateJobForm from './useValidateJobForm';

describe('Unit | Features | Job Edit | Hooks | Use Validate Job Form', () => {
  afterEach(() => sinon.restore());

  test('should add error for blank title', async () => {
    const expectedValue = '';

    let formState = null;
    const { result } = renderHook(() =>
      useValidateJobForm(openImprovementJob, false)
    );
    await act(async () => {
      result.current.register('title', {
        required: formErrors.titleRequired
      });

      await result.current.setValue('title', expectedValue, {
        shouldValidate: true
      });
      formState = result.current.formState;
    });

    const errorMsg = formState.errors?.title?.message || '';
    expect(errorMsg).toEqual(formErrors.titleRequired);
  });

  test('should add error for blank need if job is in approved state', async () => {
    const expectedValue = '';

    let formState = null;
    const { result } = renderHook(() =>
      useValidateJobForm(approvedImprovementJob, false)
    );
    await act(async () => {
      result.current.register('need', result.current.needValidationOptions);

      await result.current.setValue('need', expectedValue, {
        shouldValidate: true
      });

      formState = result.current.formState;
    });

    const errorMsg = formState.errors?.need?.message || '';
    expect(errorMsg).toEqual(formErrors.descriptionRequired);
  });

  test('should add error for blank need if job is in authorized state', async () => {
    const expectedValue = '';

    let formState = null;
    const { result } = renderHook(() =>
      useValidateJobForm(authorizedImprovementJob, false)
    );
    await act(async () => {
      result.current.register('need', result.current.needValidationOptions);

      await result.current.setValue('need', expectedValue, {
        shouldValidate: true
      });

      formState = result.current.formState;
    });

    const errorMsg = formState.errors?.need?.message || '';
    expect(errorMsg).toEqual(formErrors.descriptionRequired);
  });
});

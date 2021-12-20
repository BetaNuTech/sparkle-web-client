import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import jobsApi from '../../../common/services/api/jobs';
import { openImprovementJob } from '../../../__mocks__/jobs';

import currentUser from '../../../common/utils/currentUser';
import useJobForm from './useJobForm';

const STUBBED_NOTIFICATIONS = (message: string, options?: any) => [
  message,
  options
];

describe('Unit | Features | Job Edit | Hooks | Use Job Form', () => {
  afterEach(() => sinon.restore());

  test('should call the create job method of api if its new job', async () => {
    const expected = true;
    const triggerFormValidation = sinon.spy();
    const getFormValues = sinon.spy();
    const formState = { errors: {} };

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(jobsApi, 'createNewJob');

    await act(async () => {
      const { result } = renderHook(() =>
        useJobForm(
          STUBBED_NOTIFICATIONS,
          true,
          triggerFormValidation,
          getFormValues,
          formState,
          openImprovementJob
        )
      );
      result.current.onSubmit('approved');
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
    const result = spyFunc.firstCall || { args: [] };
    expect(result.args[0]).toEqual(openImprovementJob.property);
  });

  test('should call the update job method of api', async () => {
    const expected = true;
    const triggerFormValidation = sinon.spy();
    const getFormValues = sinon.spy();
    const formState = { errors: {} };

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(jobsApi, 'updateJob');

    await act(async () => {
      const { result } = renderHook(() =>
        useJobForm(
          STUBBED_NOTIFICATIONS,
          false,
          triggerFormValidation,
          getFormValues,
          formState,
          openImprovementJob
        )
      );
      result.current.onSubmit('approved');
    });

    const actual = spyFunc.called;
    const result = spyFunc.firstCall || { args: [] };
    expect(actual).toEqual(expected);
    expect(result.args[0]).toEqual(openImprovementJob.property);
    expect(result.args[1]).toEqual(openImprovementJob.id);
  });
});

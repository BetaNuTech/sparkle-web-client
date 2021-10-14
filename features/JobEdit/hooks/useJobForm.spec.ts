import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import jobsApi from '../../../common/services/api/jobs';
import jobModel from '../../../common/models/job';
import currentUser from '../../../common/utils/currentUser';
import useJobForm from './useJobForm';

const STUBBED_NOTIFICATIONS = (message: string, options?: any) => [
  message,
  options
];

describe('Unit | Features | Job Edit | Hooks | Use Job Form', () => {
  afterEach(() => sinon.restore());

  test('should call the create job method of api', async () => {
    const expected = true;

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(jobsApi, 'createNewJob');

    await act(async () => {
      const { result } = renderHook(() => useJobForm(STUBBED_NOTIFICATIONS));
      result.current.postJobCreate('property-1', {} as jobModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the update job method of api', async () => {
    const expected = true;

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(jobsApi, 'updateJob');

    await act(async () => {
      const { result } = renderHook(() => useJobForm(STUBBED_NOTIFICATIONS));
      result.current.putJobUpdate('property-1', 'job-1', {} as jobModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});

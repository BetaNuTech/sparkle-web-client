import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act, waitFor } from '@testing-library/react';
import moment from 'moment';
import DeficientItem from '../../../common/models/deficientItem';
import DeficientItemLocalUpdates from '../../../common/models/deficientItems/unpublishedUpdates';
import deficientItemUpdates from '../../../common/services/indexedDB/deficientItemUpdates';
import useUnpublishedItemUpdates from './useUnpublishedDeficiencyUpdates';

const PROPERTY_ID = '123';
const DEFICIENCY_ID = '456';

describe('Unit | Features | Deficient Item Edit | Hooks | Use Unpublished Item Updates', () => {
  afterEach(() => sinon.restore());

  test('should load an existing unpublished deficiency record', async () => {
    const expected = {
      currentPlanToFix: 'current plan to fix'
    } as DeficientItem;
    const createdAt = moment().unix();
    const queryrecordResult = {
      id: 'abc',
      property: PROPERTY_ID,
      deficiency: DEFICIENCY_ID,
      createdAt,
      ...expected
    } as DeficientItemLocalUpdates;

    // Stub requests
    sinon.stub(deficientItemUpdates, 'queryRecord').resolves(queryrecordResult);

    const { result } = renderHook(() =>
      useUnpublishedItemUpdates(DEFICIENCY_ID, createdAt)
    );

    await act(async () => {
      await waitFor(() => result.current.status === 'success');
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const actual = result.current.data || {};
    expect(actual).toMatchObject(expected);
  });

  // eslint-disable-next-line max-len
  test('should not load existing record if it’s creation date is different then the remote record’s latest update date', async () => {
    const updates = {
      currentPlanToFix: 'current plan to fix'
    } as DeficientItem;
    const createdAt = moment().subtract(1, 'day').unix();
    const updatedAt = moment().unix();
    const expected = {
      id: 'abc',
      property: PROPERTY_ID,
      deficiency: DEFICIENCY_ID,
      createdAt,
      ...updates
    } as DeficientItemLocalUpdates;

    // Stub requests
    sinon.stub(deficientItemUpdates, 'queryRecord').resolves(expected);

    const { result } = renderHook(() =>
      useUnpublishedItemUpdates(DEFICIENCY_ID, updatedAt)
    );

    await act(async () => {
      await waitFor(() => result.current.status === 'success');
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const actual = result.current.data || {};
    expect(actual).toEqual({});
  });
});

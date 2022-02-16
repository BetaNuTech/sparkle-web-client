import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import createDeficientItem from '../../../__tests__/helpers/createDeficientItem';

import useSelectionsAndSearch from './useSelectionsAndSearch';

const deficientItems = [
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-1',
    itemTitle: 'one',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-2',
    itemTitle: 'two',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-3',
    itemTitle: 'three',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-4',
    itemTitle: 'four',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'overdue',
    id: 'deficiency-5',
    itemTitle: 'one',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'overdue',
    id: 'deficiency-6',
    itemTitle: 'five',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-7',
    itemTitle: 'six',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-8',
    itemTitle: 'seven',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-9',
    itemTitle: 'eight',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-10',
    itemTitle: 'nine',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-11',
    itemTitle: 'three',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-12',
    itemTitle: 'four',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-13',
    itemTitle: 'five',
    sectionTitle: ''
  }),
  createDeficientItem({
    state: 'pending',
    id: 'deficiency-14',
    itemTitle: 'six',
    sectionTitle: ''
  })
];

describe('Unit | features | Deficient Items | Hooks | useSelectionsAndSearch', () => {
  afterEach(() => sinon.restore());

  test('should add selected deficiency in selected deficiencies based on group', () => {
    const sendNotification = sinon.spy();

    const expected = { [deficientItems[0].state]: [deficientItems[0].id] };

    const { result } = renderHook(() =>
      useSelectionsAndSearch(deficientItems, 'property-1', sendNotification)
    );

    act(() => {
      result.current.onSelectDeficiency(
        deficientItems[0].state,
        deficientItems[0].id
      );
    });
    expect(result.current.selectedDeficiencies).toMatchObject(expected);
  });

  test('should add first 10 group deficiencies in selected deficiencies based on group', () => {
    const sendNotification = sinon.spy();
    const pendingGroupItems = deficientItems.filter(
      (item) => item.state === 'pending'
    );
    const expected = {
      pending: pendingGroupItems.map((item) => item.id).splice(0, 10)
    };

    const { result } = renderHook(() =>
      useSelectionsAndSearch(deficientItems, 'property-1', sendNotification)
    );

    act(() => {
      result.current.onGroupSelection('pending', {
        target: { checked: true }
      } as ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.selectedDeficiencies).toMatchObject(expected);
  });

  // eslint-disable-next-line max-len
  test('should send user facing notification error if user try to selected more than 10 deficiencies in same group', () => {
    const sendNotification = sinon.spy();

    const { result } = renderHook(() =>
      useSelectionsAndSearch(deficientItems, 'property-1', sendNotification)
    );

    act(() => {
      result.current.onGroupSelection('pending', {
        target: { checked: true }
      } as ChangeEvent<HTMLInputElement>);
      result.current.onSelectDeficiency('pending', 'deficiency-14');
    });

    expect(sendNotification.called).toBeTruthy();
  });

  test('should filter deficient items on search', async () => {
    const sendNotification = sinon.spy();
    const expectedResultOne = 'one | two | four | four';
    const expectedResultTwo = 'one';

    const { result } = renderHook(() =>
      useSelectionsAndSearch(deficientItems, 'property-1', sendNotification)
    );
    await act(async () => {
      result.current.onSearchKeyDown({ target: { value: 'o' } });

      // need to wait for 300 ms
      // as we have 300ms debounce in useSearching Hook
      await new Promise((r) => setTimeout(r, 300));
    });
    const { deficientItemsByState } = result.current;

    const actualResultOne = deficientItemsByState
      .get('pending')
      .map((item) => item.itemTitle)
      .join(' | ');
    const actualResultTwo = deficientItemsByState
      .get('overdue')
      .map((item) => item.itemTitle)
      .join(' | ');

    expect(actualResultOne).toEqual(expectedResultOne);
    expect(actualResultTwo).toEqual(expectedResultTwo);
  });
});

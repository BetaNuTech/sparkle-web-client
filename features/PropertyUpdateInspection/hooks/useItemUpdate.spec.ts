import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import deepmerge from '../../../common/utils/deepmerge';
import deepClone from '../../../__tests__/helpers/deepClone';
import useItemUpdate from './useItemUpdate';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import {
  unselectedCheckmarkItem,
  selectedCheckmarkItem,
  unselectedThumbsItem,
  selectedCheckedExclaimItem,
  unselectedAbcItem,
  unselectedOneToFiveItem
} from '../../../__mocks__/inspections';

const ITEMS = Object.freeze({
  [unselectedCheckmarkItem.id]: unselectedCheckmarkItem,
  [selectedCheckmarkItem.id]: selectedCheckmarkItem,
  [unselectedThumbsItem.id]: unselectedThumbsItem,
  [selectedCheckedExclaimItem.id]: selectedCheckedExclaimItem,
  [unselectedAbcItem.id]: unselectedAbcItem,
  [unselectedOneToFiveItem.id]: unselectedOneToFiveItem
});

describe('Unit | Features | Property Update Inspection | Hooks | Use Item Update', () => {
  afterEach(() => sinon.restore());

  test('should set main input type to two action thumb when main input type is not set', () => {
    const expected = 'twoactions_thumbs';
    const { result } = renderHook(() => useItemUpdate());
    const items = deepClone(ITEMS);
    const itemId = unselectedCheckmarkItem.id;
    items[itemId].mainInputType = ''; // remove

    const actual = result.current.setMainInputType(
      {} as inspectionTemplateItemModel,
      items[itemId].mainInputType
    );
    expect(actual.mainInputType).toEqual(expected);
  });

  test('should not set main input type to two action thumb when already present', () => {
    const expected = 0;
    const { result } = renderHook(() => useItemUpdate());
    const itemId = unselectedCheckmarkItem.id;

    const actual = result.current.setMainInputType(
      {} as inspectionTemplateItemModel,
      ITEMS[itemId].mainInputType
    );
    expect(Object.keys(actual).length).toEqual(expected);
  });

  test('should resets the main input type selection to none', () => {
    const expected = false;
    const { result } = renderHook(() => useItemUpdate());
    const itemId = selectedCheckedExclaimItem.id;

    const actual = result.current.setMainInputSelected(
      {} as inspectionTemplateItemModel,
      ITEMS[itemId],
      1,
      ITEMS[itemId].mainInputSelected,
      ITEMS[itemId].mainInputSelection
    );
    expect(actual.mainInputSelected).toEqual(expected);
  });

  test('should not change the main input selected property if there is no change', () => {
    const expected = 0;
    const { result } = renderHook(() => useItemUpdate());
    const itemId = selectedCheckedExclaimItem.id;

    const actual = result.current.setMainInputSelected(
      {} as inspectionTemplateItemModel,
      ITEMS[itemId],
      2,
      ITEMS[itemId].mainInputSelected,
      ITEMS[itemId].mainInputSelection
    );
    expect(Object.keys(actual).length).toEqual(expected);
  });

  test('should not change the main input selection property if there is no change', () => {
    const expected = 0;
    const { result } = renderHook(() => useItemUpdate());
    const itemId = selectedCheckedExclaimItem.id;

    const actual = result.current.setMainInputSelection(
      {} as inspectionTemplateItemModel,
      ITEMS[itemId],
      1,
      ITEMS[itemId].mainInputSelection
    );
    expect(Object.keys(actual).length).toEqual(expected);
  });

  test('should change the main input selection property if there is a change', () => {
    const expected = 2;
    const { result } = renderHook(() => useItemUpdate());
    const itemId = selectedCheckedExclaimItem.id;

    const actual = result.current.setMainInputSelection(
      {} as inspectionTemplateItemModel,
      ITEMS[itemId],
      2,
      ITEMS[itemId].mainInputSelection
    );
    expect(actual.mainInputSelection).toEqual(expected);
  });

  test('should return updates object with keys when there is a change', () => {
    const expected = 2;
    const { result } = renderHook(() => useItemUpdate());
    const itemId = selectedCheckedExclaimItem.id;

    act(() => {
      result.current.updateMainInputSelection(ITEMS[itemId], ITEMS[itemId], 2);
    });

    const actual = result.current.inspectionUpdates[itemId].mainInputSelection;
    expect(actual).toEqual(expected);
  });

  test('should return empty update object when there is no change', async () => {
    const expected = 0;
    const { result } = renderHook(() => useItemUpdate());
    const itemId = selectedCheckedExclaimItem.id;

    act(() => {
      result.current.updateMainInputSelection(ITEMS[itemId], ITEMS[itemId], 1);
    });

    const updatedItem = deepmerge(ITEMS, result.current.inspectionUpdates);

    act(() => {
      result.current.updateMainInputSelection(
        updatedItem[itemId],
        ITEMS[itemId],
        1
      );
    });

    const actual = result.current.inspectionUpdates[itemId];
    expect(Object.keys(actual).length).toEqual(expected);
  });
});

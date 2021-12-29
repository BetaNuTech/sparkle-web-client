import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import useIndexedDBStorage from './useIndexedDBStorage';

describe('Unit | Common | Hooks | Use IndexedDB Storage', () => {
  afterEach(() => {
    sinon.restore();
    jest.restoreAllMocks();
  });

  test('should return available and used space percentage ', async () => {
    const expectedUsage = 10;
    const expectedAvailableSpace = 90;
    const sendNotification = sinon.spy();

    // Mock navigator storage api
    const estimateMock = jest
      .fn()
      .mockResolvedValue({ usage: expectedUsage, quota: 100 });
    Object.defineProperty(navigator, 'storage', {
      value: { estimate: estimateMock },
      configurable: true
    });

    const { result } = renderHook(() => useIndexedDBStorage(sendNotification));
    await act(async () => {
      result.current.setStorageSpacePercentage();
    });

    expect(result.current.usedSpacePercentage).toEqual(expectedUsage);
    expect(result.current.availableSpacePercentage).toEqual(
      expectedAvailableSpace
    );
  });

  test('should always return round up value for used and available space percentage', async () => {
    const expectedUsage = 5;
    const expectedAvailableSpace = 95;
    const sendNotification = sinon.spy();

    // Mock navigator storage api
    const estimateMock = jest
      .fn()
      .mockResolvedValue({ usage: expectedUsage, quota: 100 });
    Object.defineProperty(navigator, 'storage', {
      value: { estimate: estimateMock },
      configurable: true
    });

    const { result } = renderHook(() => useIndexedDBStorage(sendNotification));
    await act(async () => {
      result.current.setStorageSpacePercentage();
    });

    expect(result.current.usedSpacePercentage).toEqual(expectedUsage);
    expect(result.current.availableSpacePercentage).toEqual(
      expectedAvailableSpace
    );
  });
});

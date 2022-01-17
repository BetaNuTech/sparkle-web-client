import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useDeficientItemSectionVisibility from './useDeficientItemSectionVisibility';
import {
  deficientItem,
  deficientItemWithNotes
} from '../../../__mocks__/deficientItems';

describe('Unit | Common | Hooks | Use Deficient Item Section Visibility', () => {
  afterEach(() => sinon.restore());

  test('should allow to render notes if inspection have inspector notes', () => {
    const { result } = renderHook(() =>
      useDeficientItemSectionVisibility(deficientItemWithNotes)
    );
    expect(result.current.showNotes).toBeTruthy();
  });

  test('should  notallow to render notes if inspection does not have inspector notes', () => {
    const { result } = renderHook(() =>
      useDeficientItemSectionVisibility(deficientItem)
    );
    expect(result.current.showNotes).toBeFalsy();
  });
});

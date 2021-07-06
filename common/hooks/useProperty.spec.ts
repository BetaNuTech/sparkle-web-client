import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useProperty from './useProperty';
import propertiesApi from '../services/firestore/properties';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Property', () => {
  afterEach(() => sinon.restore());

  test('should request property record', () => {
    const expected = 'property-123';
    const findRecord = sinon
      .stub(propertiesApi, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useProperty({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});

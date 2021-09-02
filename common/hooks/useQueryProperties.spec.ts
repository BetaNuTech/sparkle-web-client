import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useQueryProperties from './useQueryProperties';
import propertiesDb from '../services/firestore/properties';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Query Properties', () => {
  afterEach(() => sinon.restore());

  test('should request property record', () => {
    const expected = ['property-123'];
    const queryRecords = sinon
      .stub(propertiesDb, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useQueryProperties({}, expected));

    const result = queryRecords.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});

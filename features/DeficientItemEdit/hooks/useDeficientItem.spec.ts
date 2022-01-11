import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useDeficientItem from './useDeficientItem';
import deficienciesDb from '../../../common/services/firestore/deficiencies';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: {}
};

describe('Unit | Common | Hooks | Use Deficient Item', () => {
  afterEach(() => sinon.restore());

  test('should request deficiency record', () => {
    const expected = 'deficiency-123';
    const findRecord = sinon
      .stub(deficienciesDb, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useDeficientItem({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});

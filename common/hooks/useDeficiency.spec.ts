import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useDeficiency from './useDeficiency';
import deficienciesDb from '../services/firestore/deficiencies';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: {}
};

describe('Unit | Common | Hooks | Use Deficiency', () => {
  afterEach(() => sinon.restore());

  test('should request deficiency record', () => {
    const expected = 'deficiency-123';
    const findRecord = sinon
      .stub(deficienciesDb, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useDeficiency({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});

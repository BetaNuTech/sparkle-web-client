import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useInspection from './useInspection';
import inspectionsDb from '../services/firestore/inspections';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Properties | Hooks | Use Inspection', () => {
  afterEach(() => sinon.restore());

  test('should request inspection', () => {
    const expected = 'inspection-123';
    const findRecord = sinon
      .stub(inspectionsDb, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useInspection({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});

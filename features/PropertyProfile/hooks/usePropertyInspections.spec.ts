import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import usePropertyInspections from './usePropertyInspections';
import inspectionsApi from '../../../common/services/firestore/inspections';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Properties | Hooks | Use Property Inspections', () => {
  afterEach(() => sinon.restore());

  test('should request property inspections associated with a property', () => {
    const expected = 'property-123';
    const queryByProperty = sinon
      .stub(inspectionsApi, 'queryByProperty')
      .returns(emptyCollectionResult);
    renderHook(() => usePropertyInspections({}, expected));

    const result = queryByProperty.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});

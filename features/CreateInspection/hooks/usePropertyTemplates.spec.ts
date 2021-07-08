import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTemplates from './usePropertyTemplates';
import templatesApi from '../../../common/services/firestore/templates';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Create Inspection | Hooks | Use Property Templates', () => {
  afterEach(() => sinon.restore());

  test('should request property templates associated with a property', () => {
    const expected = 'property-123';
    const queryByProperty = sinon
      .stub(templatesApi, 'queryByProperty')
      .returns(emptyCollectionResult);
    renderHook(() => useTemplates({}, expected));

    const result = queryByProperty.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});

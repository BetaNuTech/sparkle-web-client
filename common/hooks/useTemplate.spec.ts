import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTemplate from './useTemplate';
import templatesDb from '../services/firestore/templates';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Properties | Hooks | Use Template', () => {
  afterEach(() => sinon.restore());

  test('should request template', () => {
    const expected = 'template-123';
    const findRecord = sinon
      .stub(templatesDb, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useTemplate({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});

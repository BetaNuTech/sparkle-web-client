import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTemplates from './useTemplates';
import templatesDb from '../services/firestore/templates';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Templates', () => {
  afterEach(() => sinon.restore());

  test('should request all templates', () => {
    const expected = true;
    const findAll = sinon
      .stub(templatesDb, 'findAll')
      .returns(emptyCollectionResult);
    renderHook(() => useTemplates({}));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });
});

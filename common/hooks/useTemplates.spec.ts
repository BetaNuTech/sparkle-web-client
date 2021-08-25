import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTemplates from './useTemplates';
import templatesApi from '../services/firestore/templates';

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
      .stub(templatesApi, 'queryAll')
      .returns(emptyCollectionResult);
    renderHook(() => useTemplates({}));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });
});

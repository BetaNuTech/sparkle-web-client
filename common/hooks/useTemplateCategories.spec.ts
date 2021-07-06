import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useTemplateCategories from './useTemplateCategories';
import templateCategoryApi from '../services/firestore/templateCategories';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Template Categories', () => {
  afterEach(() => sinon.restore());

  test('should fetch all template categories', () => {
    const expected = true;
    const findAll = sinon
      .stub(templateCategoryApi, 'findAll')
      .returns(emptyCollectionResult);
    renderHook(() => useTemplateCategories({}));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });
});

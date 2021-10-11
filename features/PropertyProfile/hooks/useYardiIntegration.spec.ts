import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useYardiIntegration from './useYardiIntegration';
import integrationsDb from '../../../common/services/firestore/integrations';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Property Profile | Hooks | Use Yardi Integration', () => {
  afterEach(() => sinon.restore());

  test('should request property yardi authorizer configuration for property', () => {
    const expected = true;

    const queryYardi = sinon
      .stub(integrationsDb, 'queryYardi')
      .returns(emptyCollectionResult);

    renderHook(() => useYardiIntegration({}));

    const actual = queryYardi.called;

    expect(actual).toEqual(expected);
  });
});

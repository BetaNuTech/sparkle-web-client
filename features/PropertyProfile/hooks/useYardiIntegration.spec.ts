import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useYardiIntegration from './useYardiIntegration';
import integrationsApi from '../../../common/services/integrations';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Property Profile | Hooks | Use Yardi Integration', () => {
  afterEach(() => sinon.restore());

  test('should request property yardi authorizer configuration for property', () => {
    const expected = true;

    const queryYardiRecord = sinon
      .stub(integrationsApi, 'queryYardiRecord')
      .returns(emptyCollectionResult);

    renderHook(() => useYardiIntegration({}));

    const actual = queryYardiRecord.called;

    expect(actual).toEqual(expected);
  });
});

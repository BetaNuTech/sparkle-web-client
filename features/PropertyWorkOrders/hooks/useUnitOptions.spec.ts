import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import yardiApi from '../../../common/services/api/yardi';
import errorReports from '../../../common/services/api/errorReports';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';
import { yardiResidentOne } from '../../../__mocks__/yardi/residents';
import useUnitOptions from './useUnitOptions';

describe('Unit | Features | Property Work Orders | Hooks | Use Unit Options', () => {
  afterEach(() => sinon.restore());

  it('should resolve the pickable units from the property residents', async () => {
    sinon.stub(yardiApi, 'getResidentsRequest').resolves({
      residents: [yardiResidentOne],
      occupants: []
    });

    const { result, waitFor } = renderHook(() => useUnitOptions('property-1'));
    expect(result.current.status).toEqual('loading');
    await waitFor(() => result.current.status === 'success');

    expect(result.current.data).toEqual([
      {
        unit: yardiResidentOne.leaseUnit,
        resident: yardiResidentOne.id,
        label: `${yardiResidentOne.leaseUnit} · amy Hutcherson`
      }
    ]);
  });

  it('should fall back to an error status without reporting a known Yardi failure', async () => {
    sinon
      .stub(yardiApi, 'getResidentsRequest')
      .rejects(new ErrorProxyForbidden('yardi not authenticated'));
    const report = sinon.stub(errorReports, 'send').resolves();

    const { result, waitFor } = renderHook(() => useUnitOptions('property-1'));
    await waitFor(() => result.current.status === 'error');

    expect(result.current.data).toEqual([]);
    expect(report.called).toEqual(false);
  });

  it('should report an unexpected failure and still fall back', async () => {
    sinon.stub(yardiApi, 'getResidentsRequest').rejects(Error('boom'));
    const report = sinon.stub(errorReports, 'send').resolves();

    const { result, waitFor } = renderHook(() => useUnitOptions('property-1'));
    await waitFor(() => result.current.status === 'error');

    expect(report.called).toEqual(true);
  });
});

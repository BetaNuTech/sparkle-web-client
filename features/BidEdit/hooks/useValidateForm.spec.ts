import sinon from 'sinon';

import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';
import formats from '../../../config/formats';
import { openBid } from '../../../__mocks__/bids';
import formErrors from '../Form/errors';
import useValidateForm from './useValidateForm';

describe('Unit | Features | Bid Edit | Hooks | Use Validate Form', () => {
  afterEach(() => sinon.restore());

  const apiBid = (({
    vendor,
    costMin,
    costMax,
    startAt,
    scope,
    completeAt,
    vendorDetails,
    vendorW9,
    vendorInsurance,
    vendorLicense
  }) => ({
    vendor,
    costMin,
    costMax,
    startAt,
    completeAt,
    scope,
    vendorDetails,
    vendorW9,
    vendorInsurance,
    vendorLicense
  }))(openBid);

  test('should set default values to form', async () => {
    const startAtProcessed = moment
      .unix(openBid.startAt)
      .format(formats.browserDateDisplay);
    const completeAtProcessed = moment
      .unix(openBid.completeAt)
      .format(formats.browserDateDisplay);

    let formData = null;
    await act(async () => {
      const { result } = renderHook(() =>
        useValidateForm(apiBid, openBid, false)
      );
      formData = result.current.formData;
    });
    expect(formData.vendor).toEqual(openBid.vendor);
    expect(formData.vendorDetails).toEqual(openBid.vendorDetails);
    expect(formData.costMin).toEqual(openBid.costMin);
    expect(formData.costMax).toEqual(openBid.costMax);
    expect(formData.scope).toEqual(openBid.scope);
    expect(formData.startAt).toEqual(startAtProcessed);
    expect(formData.completeAt).toEqual(completeAtProcessed);
  });

  test('should add error for blank vendor name', async () => {
    const expectedValue = '';

    let formData = null;
    let formState = null;
    const { result } = renderHook(() =>
      useValidateForm(apiBid, openBid, false)
    );
    await act(async () => {
      result.current.register('vendor', {
        required: formErrors.vendorRequired
      });

      await result.current.setValue('vendor', expectedValue, {
        shouldValidate: true
      });

      formData = result.current.formData;
      formState = result.current.formState;
    });

    const errorMsg = formState.errors?.vendor?.message || '';
    expect(formData.vendor).toEqual(expectedValue);
    expect(errorMsg).toEqual(formErrors.vendorRequired);
  });
});

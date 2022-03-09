import { useState } from 'react';
import moment from 'moment';
import { useForm, useWatch, FormState, UseFormSetValue } from 'react-hook-form';
import FormInputs from '../Form/FormInputs';
import bidModel from '../../../common/models/bid';
import formErrors from '../Form/errors';
import formats from '../../../config/formats';

interface useValidateFormReturn {
  register: any;
  formData: any;
  triggerFormValidation(): void;
  formState: FormState<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  costMaxValidateOptions: any;
  costMinValidateOptions: any;
  startAtValidateOptions: any;
  completeAtValidateOptions: any;
  normalizeFormData: (formBid: FormInputs) => any;
  startAtProcessed: string;
  completeAtProcessed: string;
  isFixedCostType: boolean;
  setCostType(type: 'fixed' | 'range'): void;
}

/* eslint-disable */
const useValidateForm = (
  apiBid: FormInputs,
  bid: bidModel,
  isNewBid: boolean
): useValidateFormReturn => {
  //check and set cost type
  const [isFixedCostType, setFixedCostType] = useState(
    isNewBid ? true : bid.costMin === bid.costMax
  );
  const setCostType = (type) => {
    setFixedCostType(type === 'fixed');
  };

  //Invoke useForm for edit bid form
  const {
    register,
    control,
    trigger: triggerFormValidation,
    formState,
    setValue
  } = useForm<FormInputs>({
    mode: 'all'
  });

  //set startAtProcessed and completeAtProcessed in browser date display format
  let startAtProcessed = null;
  let completeAtProcessed = null;

  if (!isNewBid) {
    startAtProcessed =
      bid.startAt &&
      moment.unix(bid.startAt).format(formats.browserDateDisplay);
    completeAtProcessed =
      bid.completeAt &&
      moment.unix(bid.completeAt).format(formats.browserDateDisplay);
  }

  // Setup watcher for form changes
  const formData = useWatch({
    control,
    defaultValue: {
      vendor: apiBid.vendor,
      vendorDetails: apiBid.vendorDetails,
      costMin: apiBid.costMin,
      costMax: apiBid.costMax,
      scope: apiBid.scope,
      startAt: startAtProcessed,
      completeAt: completeAtProcessed,
      vendorInsurance: apiBid.vendorInsurance,
      vendorW9: apiBid.vendorW9
    }
  });

  //  Cost min validator to check it should be less than max cost
  const costMinValidator = (value) => {
    let isValid = true;
    const costMax: HTMLInputElement = document.getElementById(
      'costMax'
    ) as HTMLInputElement;
    if (value && costMax && costMax.value) {
      isValid = Number(costMax.value) > Number(value);
    }
    return isValid || formErrors.costMinMaxGreater;
  };

  // Cost max validator to check it should be more than min cost
  const costMaxValidator = (value) => {
    let isValid = true;
    const costMin: HTMLInputElement = document.getElementById(
      'costMin'
    ) as HTMLInputElement;
    if (value && costMin && costMin.value) {
      isValid = Number(costMin.value) < Number(value);
    }
    return isValid || formErrors.costMaxMinGreater;
  };

  const costMaxValidateOptions: any = {
    validate: (value) => {
      const validateResult = costMaxValidator(value);
      if (validateResult && typeof validateResult === 'boolean') {
        triggerFormValidation('costMin');
      }
      return validateResult;
    }
  };
  const costMinValidateOptions: any = {
    validate: costMinValidator
  };

  // Start at validator to check it should be less than complete date
  const startDateValidator = (value) => {
    let isValid = true;
    const bidCompleteAt: HTMLInputElement = document.getElementById(
      'bidCompleteAt'
    ) as HTMLInputElement;
    // Should not check for less value if it doesn't have value
    if (value && bidCompleteAt && bidCompleteAt.value) {
      isValid = moment(bidCompleteAt.value).unix() >= moment(value).unix();
    }
    return isValid || formErrors.startAtLess;
  };

  // Complete at validator to check it should be more than start date
  const completeDateValidator = (value) => {
    let isValid = true;
    const bidStartAt: HTMLInputElement = document.getElementById(
      'bidStartAt'
    ) as HTMLInputElement;
    // Should not check for less value if it doesn't have value
    if (value && bidStartAt && bidStartAt.value) {
      isValid = moment(bidStartAt.value).unix() <= moment(value).unix();
    }
    return isValid || formErrors.completeAtLess;
  };

  // Start at validations
  const startAtValidateOptions: any = { validate: startDateValidator };

  const isApprovedOrComplete =
    !isNewBid && ['approved', 'complete'].includes(bid.state);

  // Complete at validations
  const completeAtValidateOptions: any = { validate: completeDateValidator };

  if (isApprovedOrComplete) {
    startAtValidateOptions.required = formErrors.startAtRequired;
    completeAtValidateOptions.required = formErrors.completeAtRequired;
  }

  const normalizeFormData = (formBid: FormInputs) => {
    // Enforce numeric costs
    formBid.costMin = Number(formBid.costMin);
    formBid.costMax = Number(formBid.costMax);

    // Enforce UNIX timestamp dates
    formBid.startAt = formBid.startAt ? moment(formBid.startAt).unix() : 0;
    formBid.completeAt = formBid.completeAt
      ? moment(formBid.completeAt).unix()
      : 0;

    // Set fixed bid min/max costs to the same value
    if (isFixedCostType) {
      formBid.costMax = formBid.costMin;
    }

    return formBid;
  };

  return {
    register,
    triggerFormValidation,
    formState,
    setValue,
    formData,
    costMaxValidateOptions,
    costMinValidateOptions,
    normalizeFormData,
    startAtProcessed,
    completeAtProcessed,
    startAtValidateOptions,
    completeAtValidateOptions,
    isFixedCostType,
    setCostType
  };
};

export default useValidateForm;

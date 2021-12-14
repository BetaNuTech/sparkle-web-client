import {
  useForm,
  FormState,
  UseFormSetValue,
  UseFormRegister,
  UseFormGetValues,
  UseFormTrigger
} from 'react-hook-form';
import FormInputs from '../Form/FormInputs';
import jobModel from '../../../common/models/job';
import formErrors from '../Form/errors';

interface useValidateJobFormReturn {
  register: UseFormRegister<FormInputs>;
  triggerFormValidation: UseFormTrigger<FormInputs>;
  formState: FormState<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  getValues: UseFormGetValues<FormInputs>;
  needValidationOptions: any;
  expediteReasonValidation: any;
  sowValidationOptions: any;
}

/* eslint-disable */
const useValidateJobForm = (
  job: jobModel,
  isNewJob: boolean
): useValidateJobFormReturn => {
  //check and set cost type

  //Invoke useForm for edit bid form
  const {
    register,
    control,
    trigger: triggerFormValidation,
    formState,
    getValues,
    setValue
  } = useForm<FormInputs>({
    mode: 'all'
  });

  // Validate if job meets scope of work requirements
  const sowValidator = (value) => {
    let isValid = true;
    if (!value) {
      isValid = false;
    }
    // Check if we have attachment in SOW
    const attachmentList = document.getElementById('sowAttachmentList');
    if (!isValid && attachmentList) {
      isValid = attachmentList.children.length > 0;
    }
    return isValid || formErrors.scopeRequired;
  };

  const isApprovedOrAuthorized =
    !isNewJob && ['approved', 'authorized'].includes(job.state);

  const needValidationOptions: any = {};
  const expediteReasonValidation: any = {};
  const sowValidationOptions: any = {};
  if (isApprovedOrAuthorized) {
    // Add need validation if job is in approve or authorized state
    needValidationOptions.required = formErrors.descriptionRequired;

    // Add scope of work validation if job is in approve or authorized state
    sowValidationOptions.validate = sowValidator;
  }
  if (job.expediteReason) {
    // Add expedite reason required if it is present
    expediteReasonValidation.required = formErrors.expediteReasonRequired;
  }

  return {
    register,
    triggerFormValidation,
    formState,
    getValues,
    setValue,
    needValidationOptions,
    expediteReasonValidation,
    sowValidationOptions
  };
};

export default useValidateJobForm;

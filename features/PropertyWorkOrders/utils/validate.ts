import yardiCustomValues from '../../../common/models/yardi/customValues';
import {
  yardiWorkOrderWritable,
  WORK_ORDER_MAX_LENGTHS
} from '../../../common/models/yardi/workOrder';
import { isReasonRequired } from './customValues';

export type WorkOrderFieldErrors = Record<string, string>;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const errorMessages = {
  unitRequired: 'Unit is required',
  reasonRequired: 'This status requires a reason',
  dueDateFormat: 'Due date must be YYYY-MM-DD',
  emailFormat: 'Requestor email must be a valid email address',
  tooLong: (max: number): string => `Must be ${max} characters or fewer`
};

// Validate a work order form state
// against Yardi's rules before sending
// it to the API, returning any field errors
export default function validateWorkOrder(
  values: yardiWorkOrderWritable,
  customValues: yardiCustomValues,
  isCreating = false
): WorkOrderFieldErrors {
  const errors: WorkOrderFieldErrors = {};

  if (isCreating && !`${values.unit || ''}`.trim()) {
    errors.unit = errorMessages.unitRequired;
  }

  // Max lengths
  Object.keys(WORK_ORDER_MAX_LENGTHS).forEach((field) => {
    const value = values[field];
    if (
      typeof value === 'string' &&
      value.length > WORK_ORDER_MAX_LENGTHS[field]
    ) {
      errors[field] = errorMessages.tooLong(WORK_ORDER_MAX_LENGTHS[field]);
    }
  });

  // Statuses with required reasons
  if (
    values.status &&
    !values.reason &&
    isReasonRequired(customValues, values.status)
  ) {
    errors.reason = errorMessages.reasonRequired;
  }

  if (values.dueDate && !DATE_PATTERN.test(values.dueDate)) {
    errors.dueDate = errorMessages.dueDateFormat;
  }

  if (values.requestorEmail && !EMAIL_PATTERN.test(values.requestorEmail)) {
    errors.requestorEmail = errorMessages.emailFormat;
  }

  return errors;
}

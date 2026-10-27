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
  dueDatePast: 'Due date cannot be in the past',
  emailFormat: 'Requestor email must be a valid email address',
  tooLong: (max: number): string => `Must be ${max} characters or fewer`
};

// Today's date in the user's time zone
// as YYYY-MM-DD, the form's date format
export const todayIsoDate = (now: Date = new Date()): string => {
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
};

// Validate a work order form state
// against Yardi's rules before sending
// it to the API, returning any field errors
export default function validateWorkOrder(
  values: yardiWorkOrderWritable,
  customValues: yardiCustomValues,
  isCreating = false,
  today: string = todayIsoDate()
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

  // Due dates are today or later; an
  // existing past due date only fails
  // when the user changes it, because
  // the controller validates only the
  // attributes being sent
  if (values.dueDate && !DATE_PATTERN.test(values.dueDate)) {
    errors.dueDate = errorMessages.dueDateFormat;
  } else if (values.dueDate && values.dueDate < today) {
    errors.dueDate = errorMessages.dueDatePast;
  }

  if (values.requestorEmail && !EMAIL_PATTERN.test(values.requestorEmail)) {
    errors.requestorEmail = errorMessages.emailFormat;
  }

  return errors;
}

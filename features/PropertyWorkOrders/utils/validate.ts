import yardiCustomValues from '../../../common/models/yardi/customValues';
import {
  yardiWorkOrderWritable,
  WORK_ORDER_ASSIGNEE_CODE_MAX_LENGTH,
  WORK_ORDER_ASSIGNEE_HOURS_MAX,
  WORK_ORDER_MAX_LENGTHS
} from '../../../common/models/yardi/workOrder';

import { isReasonRequired } from './customValues';

// Assignees arrive as the form holds them
// (hours as text) or as the API takes them
type AssigneeInput = string | { code: string; hours?: number | string };
export type ValidatableWorkOrder = Omit<yardiWorkOrderWritable, 'assignees'> & {
  assignees?: AssigneeInput[];
};

export type WorkOrderFieldErrors = Record<string, string>;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const errorMessages = {
  summaryRequired: 'A summary is required when there is no unit',
  reasonRequired: 'This status requires a reason',
  dueDateFormat: 'Due date must be YYYY-MM-DD',
  dueDatePast: 'Due date cannot be in the past',
  emailFormat: 'Requestor email must be a valid email address',
  assigneeCode: `Assignee codes must be 1 to ${WORK_ORDER_ASSIGNEE_CODE_MAX_LENGTH} characters`,
  assigneeDuplicate: 'An employee is listed twice',
  assigneeHours: `Hours must be a number from 0 to ${WORK_ORDER_ASSIGNEE_HOURS_MAX}`,
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
  values: ValidatableWorkOrder,
  customValues: yardiCustomValues,
  isCreating = false,
  today: string = todayIsoDate()
): WorkOrderFieldErrors {
  const errors: WorkOrderFieldErrors = {};

  // A request without a unit (office, grounds,
  // parking…) is filed against the property.
  // Yardi accepts that but refuses an empty
  // body, and a summary identifies the request
  if (
    isCreating &&
    !`${values.unit || ''}`.trim() &&
    !`${values.briefDescription || ''}`.trim()
  ) {
    errors.briefDescription = errorMessages.summaryRequired;
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

  // Assignees are employee codes, each
  // with optional labor hours
  const assignees = (values.assignees || []).map((assignee) =>
    typeof assignee === 'string'
      ? { code: assignee.trim(), hours: '' }
      : {
          code: `${assignee?.code || ''}`.trim(),
          hours: `${assignee?.hours ?? ''}`.trim()
        }
  );
  const isBadHours = (hours: string) => {
    if (hours === '') return false;
    const value = Number(hours);
    return (
      !Number.isFinite(value) ||
      value < 0 ||
      value > WORK_ORDER_ASSIGNEE_HOURS_MAX
    );
  };
  if (
    assignees.some(
      ({ code }) => !code || code.length > WORK_ORDER_ASSIGNEE_CODE_MAX_LENGTH
    )
  ) {
    errors.assignees = errorMessages.assigneeCode;
  } else if (
    new Set(assignees.map(({ code }) => code.toLowerCase())).size !==
    assignees.length
  ) {
    errors.assignees = errorMessages.assigneeDuplicate;
  } else if (assignees.some(({ hours }) => isBadHours(hours))) {
    errors.assignees = errorMessages.assigneeHours;
  }

  return errors;
}

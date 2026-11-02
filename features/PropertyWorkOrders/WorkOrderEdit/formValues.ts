import workOrderModel, {
  yardiWorkOrderWritable
} from '../../../common/models/yardi/workOrder';
import customValuesModel from '../../../common/models/yardi/customValues';
import {
  toDisplayValue,
  getCategoryNames,
  getStatusNames,
  getSubCategories
} from '../utils/customValues';

// Every writable attribute as the
// form holds it (strings & booleans)
export interface WorkOrderFormValues {
  unit: string;
  resident: string;
  briefDescription: string;
  description: string;
  priority: string;
  category: string;
  subCategory: string;
  status: string;
  reason: string;
  resolution: string;
  vendor: string;
  dueDate: string;
  requestorName: string;
  requestorPhone: string;
  requestorEmail: string;
  accessNotes: string;
  problemNotes: string;
  technicianNotes: string;
  permissionToEnter: boolean;
  tenantCaused: boolean;
  assignees: AssigneeFormValue[];
}

// An assignee as the form holds it: the
// employee code and the labor hours as
// typed, blank when none are set
export interface AssigneeFormValue {
  code: string;
  hours: string;
}

export const EMPTY_FORM_VALUES: WorkOrderFormValues = Object.freeze({
  unit: '',
  resident: '',
  briefDescription: '',
  description: '',
  priority: '',
  category: '',
  subCategory: '',
  status: '',
  reason: '',
  resolution: '',
  vendor: '',
  dueDate: '',
  requestorName: '',
  requestorPhone: '',
  requestorEmail: '',
  accessNotes: '',
  problemNotes: '',
  technicianNotes: '',
  permissionToEnter: false,
  tenantCaused: false,
  assignees: []
});

// Lists compare as sets of codes: order
// and case are not a change, blanks are ignored
const toListKey = (assignees: AssigneeFormValue[] = []): string =>
  assignees
    .map((assignee) => `${assignee?.code || ''}`.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join('\u0000');

const toHoursText = (hours: unknown): string => {
  const value = Number(hours);
  return Number.isFinite(value) && value > 0 ? `${value}` : '';
};

// Load a work order into form values,
// restoring the custom-values casing of
// the pickers the API lowercases on read
export function toFormValues(
  workOrder: workOrderModel | null,
  customValues: customValuesModel
): WorkOrderFormValues {
  const values = { ...EMPTY_FORM_VALUES };
  if (!workOrder) return values;

  Object.keys(EMPTY_FORM_VALUES).forEach((key) => {
    const value = workOrder[key];
    if (Array.isArray(EMPTY_FORM_VALUES[key])) {
      return; // handled below
    }
    if (typeof EMPTY_FORM_VALUES[key] === 'boolean') {
      values[key] = Boolean(value);
    } else if (value !== undefined && value !== null) {
      values[key] = `${value}`;
    }
  });

  // Yardi reports assignees as records; the
  // form holds their codes and hours as text
  values.assignees = (workOrder.assignees || [])
    .map((assignee) => ({
      code: `${assignee?.code || ''}`.trim(),
      hours: toHoursText(assignee?.hours)
    }))
    .filter((assignee) => assignee.code);

  values.priority = toDisplayValue(customValues?.priorities, values.priority);
  values.category = toDisplayValue(
    getCategoryNames(customValues),
    values.category
  );
  values.subCategory = toDisplayValue(
    getSubCategories(customValues, values.category),
    values.subCategory
  );
  values.status = toDisplayValue(getStatusNames(customValues), values.status);

  return values;
}

// Attributes to send to the API: everything
// set when creating, or only what changed
// when updating an existing work order
export function toPayload(
  values: WorkOrderFormValues,
  original: WorkOrderFormValues | null
): yardiWorkOrderWritable {
  const payload: yardiWorkOrderWritable = {};

  Object.keys(EMPTY_FORM_VALUES).forEach((key) => {
    const value = values[key];

    // The assignee list replaces the whole
    // assignment, so it is sent as a unit when
    // the people or any hours changed (or when
    // creating with anyone picked). An assignee
    // whose hours the user left alone goes as a
    // bare code, which keeps Yardi's hours; one
    // whose hours were typed or cleared goes
    // with them, cleared meaning 0
    if (Array.isArray(EMPTY_FORM_VALUES[key])) {
      const list: AssigneeFormValue[] = (value || [])
        .map((assignee) => ({
          code: `${assignee?.code || ''}`.trim(),
          hours: `${assignee?.hours ?? ''}`.trim()
        }))
        .filter((assignee) => assignee.code);
      const before: AssigneeFormValue[] = original ? original[key] || [] : [];
      const peopleChanged = original
        ? toListKey(list) !== toListKey(before)
        : list.length > 0;

      const items = list.map((assignee) => {
        const previous = before.find(
          (item) => item.code.toLowerCase() === assignee.code.toLowerCase()
        );
        const previousHours = previous ? `${previous.hours || ''}`.trim() : '';
        if (assignee.hours === previousHours) return assignee.code;
        return {
          code: assignee.code,
          hours: assignee.hours === '' ? 0 : Number(assignee.hours)
        };
      });
      const hoursChanged = items.some((item) => typeof item !== 'string');

      if (peopleChanged || hoursChanged) payload[key] = items;
      return;
    }

    const isBoolean = typeof EMPTY_FORM_VALUES[key] === 'boolean';
    const trimmed = isBoolean ? value : `${value || ''}`.trim();

    if (original) {
      if (trimmed !== original[key]) payload[key] = trimmed;
    } else if (isBoolean ? value : trimmed) {
      payload[key] = trimmed;
    }
  });

  return payload;
}

// Trim all string values
export function trimValues(values: WorkOrderFormValues): WorkOrderFormValues {
  const result = { ...values };
  Object.keys(result).forEach((key) => {
    if (typeof result[key] === 'string') result[key] = result[key].trim();
  });
  return result;
}

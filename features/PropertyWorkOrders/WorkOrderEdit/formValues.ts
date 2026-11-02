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
  assignees: string[]; // employee codes
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
const toListKey = (codes: string[] = []): string =>
  codes
    .map((code) => `${code}`.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join('\u0000');

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

  // Yardi reports assignees as records;
  // the form holds their employee codes
  values.assignees = (workOrder.assignees || [])
    .map((assignee) => `${assignee?.code || ''}`.trim())
    .filter(Boolean);

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
    // assignment, so it is sent as a unit:
    // when it changed, or when creating with any
    if (Array.isArray(EMPTY_FORM_VALUES[key])) {
      const codes = (value || [])
        .map((code) => `${code}`.trim())
        .filter(Boolean);
      const changed = original
        ? toListKey(codes) !== toListKey(original[key])
        : codes.length > 0;
      if (changed) payload[key] = codes;
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

import yardiCustomValues, {
  yardiCustomReason
} from '../../../common/models/yardi/customValues';

// Yardi matches picker values case-insensitively
// and the API lowercases them on read
const normalize = (value = ''): string => `${value}`.trim().toLowerCase();

// Sub-category placeholders Yardi uses
// when a category has no real sub-categories
const PLACEHOLDER_SUB_CATEGORIES = ['', 'n/a', 'na', 'none', '-'];

// Find the custom-values casing of a value
// the API returned lowercased, falling back
// to the value itself when it is unknown
export function toDisplayValue(options: string[] = [], value = ''): string {
  if (!value) return '';
  const match = options.find((opt) => normalize(opt) === normalize(value));
  return match || value;
}

// Real sub-categories of a category,
// ignoring placeholders like "n/a"
export function getSubCategories(
  customValues: yardiCustomValues,
  category = ''
): string[] {
  const match = (customValues?.categories || []).find(
    (cat) => normalize(cat.name) === normalize(category)
  );
  return (match?.subCategories || []).filter(
    (sub) => !PLACEHOLDER_SUB_CATEGORIES.includes(normalize(sub))
  );
}

// Reasons Yardi accepts for a status
export function getReasons(
  customValues: yardiCustomValues,
  status = ''
): yardiCustomReason[] {
  if (!status) return [];
  return (customValues?.reasons || []).filter(
    (reason) => normalize(reason.status) === normalize(status)
  );
}

// Does a status require a reason
export function isReasonRequired(
  customValues: yardiCustomValues,
  status = ''
): boolean {
  return getReasons(customValues, status).some((reason) => reason.required);
}

// All status names
export function getStatusNames(customValues: yardiCustomValues): string[] {
  return (customValues?.statuses || []).map((status) => status.name);
}

// All category names
export function getCategoryNames(customValues: yardiCustomValues): string[] {
  return (customValues?.categories || []).map((category) => category.name);
}

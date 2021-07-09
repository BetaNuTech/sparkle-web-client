// Selectable inspection filters
export const filters = ['', 'completed', 'incomplete', 'deficienciesExist'];

// User friendly names
const filterNames = {
  completed: 'Completed',
  incomplete: 'Incomplete',
  deficienciesExist: 'Deficiencies Exist'
};

// User friendly names for no records
const filterNoRecords = {
  completed: 'No completed Inspections',
  incomplete: 'No incomplete Inspections',
  deficienciesExist: 'No deficient Inspections'
};

export const activeInspectionFilterName = (filter: string): string =>
  filter ? filterNames[filter] : '';

export const getInspectionNoRecordText = (filter: string): string =>
  filter ? filterNoRecords[filter] : '';

export const nextInspectionsFilter = (currentFilter: string): string =>
  filters[filters.indexOf(currentFilter) + 1] || filters[0]; // Get next or first

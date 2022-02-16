// get all selected deficiencies
// from session storage
// and return selected deficiencies
// related to property
const getSelectedDeficiencies = (
  propertyId: string
): Record<string, string[]> => {
  const selectedDeficiencies =
    sessionStorage.getItem('selectedDeficiencies') || '{}';
  return JSON.parse(selectedDeficiencies)[propertyId] || {};
};

// save selected deficiencies
// in session storage
// by property id
const setSelectedDeficiencies = (
  propertyId: string,
  selectedDeficiencies: Record<string, string[]>
): Record<string, string[]> => {
  const previousSelectedDeficiencies =
    sessionStorage.getItem('selectedDeficiencies') || '{}';

  const combinedSelectedDeficiencies = {
    ...JSON.parse(previousSelectedDeficiencies),
    [propertyId]: selectedDeficiencies
  };
  sessionStorage.setItem(
    'selectedDeficiencies',
    JSON.stringify(combinedSelectedDeficiencies)
  );
  return combinedSelectedDeficiencies;
};

export default {
  getSelectedDeficiencies,
  setSelectedDeficiencies
};

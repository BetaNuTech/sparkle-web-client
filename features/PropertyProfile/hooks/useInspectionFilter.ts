import { useEffect, useState } from 'react';
import inspectionModel from '../../../common/models/inspection';

interface useInspectionFiltersResult {
  filteredInspections: Array<inspectionModel>;
}

// Hooks for filtering inspections list
export default function useInspectionFilter(
  filter: string,
  inspections: Array<inspectionModel>
): useInspectionFiltersResult {
  const [memo, setMemo] = useState('[]');

  let inspectionsList = [...inspections];

  if (filter === 'completed') {
    inspectionsList = inspectionsList.filter(
      (item) => item.inspectionCompleted
    );
  } else if (filter === 'incomplete') {
    inspectionsList = inspectionsList.filter(
      (item) => !item.inspectionCompleted
    );
  } else if (filter === 'deficienciesExist') {
    inspectionsList = inspectionsList.filter((item) => item.deficienciesExist);
  }

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(inspectionsList);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return { filteredInspections: inspectionsList };
}

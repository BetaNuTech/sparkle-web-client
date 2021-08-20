import { useEffect, useState } from 'react';
import jobModel from '../../../common/models/job';

interface ISection {
  title?: string;
  state: string;
  jobs: Array<jobModel>;
}

interface useJobSectionsResult {
  sections: Array<ISection>;
}

// Hooks for filtering inspections list
export default function useJobSections(
  jobs: Array<jobModel>,
  filterState: string
): useJobSectionsResult {
  const [memo, setMemo] = useState('[]');

  const sections = <ISection[]>[
    {
      title: 'Open',
      state: 'open',
      jobs: <jobModel[]>[]
    },
    {
      title: 'Approved',
      state: 'approved',
      jobs: <jobModel[]>[]
    },
    {
      title: 'Authorized',
      state: 'authorized',
      jobs: <jobModel[]>[]
    },
    {
      title: 'Completed',
      state: 'complete',
      jobs: <jobModel[]>[]
    }
  ].filter((s) => (filterState ? s.state === filterState : true));

  sections.forEach((s) => {
    s.jobs = [...jobs.filter((j) => j.state === s.state)];
  });

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(sections);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return { sections };
}

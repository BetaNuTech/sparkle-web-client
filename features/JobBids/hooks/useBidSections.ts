import { useEffect, useState } from 'react';
import bidModel from '../../../common/models/bid';

interface ISection {
  title?: string;
  state: string;
  bids: Array<bidModel>;
}

interface useBidSectionsResult {
  sections: Array<ISection>;
}

// Hooks for filtering inspections list
export default function useBidSections(
  bids: Array<bidModel>,
  filterState: string
): useBidSectionsResult {
  const [memo, setMemo] = useState('[]');

  const sections = <ISection[]>[
    {
      title: 'Open',
      state: 'open',
      bids: <bidModel[]>[]
    },
    {
      title: 'Rejected',
      state: 'rejected',
      bids: <bidModel[]>[]
    },
    {
      title: 'Incomplete',
      state: 'incomplete',
      bids: <bidModel[]>[]
    }
  ].filter((s) => (filterState ? s.state === filterState : true));

  sections.forEach((s) => {
    s.bids = [...bids.filter((b) => b.state === s.state)];
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

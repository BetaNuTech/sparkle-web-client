import { useEffect, useState } from 'react';
import teamModel from '../models/team';
import teamsDb, { teamResult } from '../services/firestore/teams';

interface useTeamResult extends teamResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

export default function useTeam(
  firestore: any, // eslint-disable-line
  teamId: string
): useTeamResult {
  const [memo, setMemo] = useState('{}');

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as teamModel,
    handlers,
    memo
  };

  const result = teamsDb.findRecord(firestore, teamId);
  Object.assign(payload, result, { handlers });

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(payload.data);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return payload;
}

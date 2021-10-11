import { useEffect, useState } from 'react';
import trelloApi, { trelloBoard } from '../../../common/services/api/trello';

const PREFIX = 'Features: Trello: hooks: useTrelloBoards';

interface useBoardsResult {
  status: string;
  error?: Error;
  data: Array<trelloBoard>;
}

// Hooks for loading job record by job id
export default function useTrelloBoards(): useBoardsResult {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('loading');

  // No access payload
  const payload = {
    status,
    error,
    data
  };

  useEffect(() => {
    trelloApi.findAllBoards().then(
      (result) => {
        setData(result);
        setStatus('success');
      },
      (err) => {
        setError(Error(`${PREFIX} load failed: ${err}`));
      }
    );
  }, []);

  return payload;
}

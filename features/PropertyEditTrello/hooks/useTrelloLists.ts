import { useState, useEffect } from 'react';
import trelloApi, { trelloList } from '../../../common/services/api/trello';
import errorReports from '../../../common/services/api/errorReports';

const PREFIX = 'Features: Trello: hooks: useTrelloList';
export interface TrelloApiResult {
  isLoading: boolean;
  status: string;
  response: trelloList[];
}

type userNotifications = (message: string, options?: any) => any;

interface useTrelloListsResult {
  openLists: trelloList[];
  closeLists: trelloList[];
  findLists(boardId: string, isOpen: boolean): Promise<Error | trelloList[]>;
  isOpenLoading: boolean;
  isClosedLoading: boolean;
}

// In memory cache of trello
// lists grouped by board
const trelloListsByBoard: Record<string, trelloList[]> = {};

// Add lists to board's cache
export const setCachedLists = (boardId: string, lists: trelloList[]): void => {
  trelloListsByBoard[boardId] =
    trelloListsByBoard[boardId] || ([] as trelloList[]);
  trelloListsByBoard[boardId].push(...lists);
};

export default function useTrelloLists(
  openBoardId: string,
  closedBoardId: string,
  sendNotification: userNotifications
): useTrelloListsResult {
  const [isOpenLoading, setIsOpenLoading] = useState(false);
  const [isClosedLoading, setIsClosedLoading] = useState(false);
  const [openLists, setOpenLists] = useState([]);
  const [closeLists, setCloseLists] = useState([]);

  const findLists = (
    boardId: string,
    isOpen: boolean
  ): Promise<Error | trelloList[]> => {
    if (isOpen) {
      setIsOpenLoading(true);
    } else {
      setIsClosedLoading(true);
    }

    // Check if trello lists are cached for requested board
    const cachedLists = trelloListsByBoard[boardId] || ([] as trelloList[]);
    const isCached = cachedLists.length > 0;

    // Resolve cached or fetch board's lists
    const request = isCached
      ? Promise.resolve(cachedLists)
      : trelloApi.findAllBoardLists(boardId);

    return request
      .then((trelloLists) => {
        // Add uncached results to in-memory cache
        if (!isCached) setCachedLists(boardId, trelloLists);

        if (isOpen) {
          setOpenLists(trelloLists);
        } else {
          setCloseLists(trelloLists);
        }

        return trelloLists;
      })
      .catch((err) => {
        // Send notification if request fails
        sendNotification('Trello lists failed to load, please try again.', {
          type: 'error'
        });

        const wrappedErr = Error(`${PREFIX} findLists: load failed: ${err}`);
        // Send the error report to backend
        // eslint-disable-next-line import/no-named-as-default-member
        errorReports.send(wrappedErr);
        return wrappedErr;
      })
      .finally(() => {
        if (isOpen) {
          setIsOpenLoading(false);
        } else {
          setIsClosedLoading(false);
        }
      });
  };

  // Inital load of open board's lists
  useEffect(() => {
    if (openBoardId) {
      findLists(openBoardId, true);
    }
  }, [openBoardId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Inital load of closed boards lists
  useEffect(() => {
    if (closedBoardId) {
      findLists(closedBoardId, false);
    }
  }, [closedBoardId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isOpenLoading, isClosedLoading, findLists, openLists, closeLists };
}

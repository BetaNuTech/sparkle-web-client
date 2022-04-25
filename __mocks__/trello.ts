import TrelloIntegrationModel from '../common/models/trelloIntegration';
import trelloPropertyModel from '../common/models/propertyTrelloIntegration';
import {
  trelloBoard,
  trelloList,
  trelloOrganization
} from '../common/services/api/trello';

// Used
export const trelloOrg: trelloOrganization = {
  id: 'organization-1',
  name: 'Sparkle'
};

export const trelloBoardWithOrg: trelloBoard = {
  id: 'board-1',
  name: 'Board One',
  organization: JSON.parse(JSON.stringify(trelloOrg))
};

export const trelloBoardWithoutOrg: trelloBoard = {
  id: 'board-2',
  name: 'Board Two'
};

export const trelloBoards: Array<trelloBoard> = [
  trelloBoardWithOrg,
  trelloBoardWithoutOrg
];

export const openList: trelloList = {
  id: 'list-1',
  name: 'Open',
  board: 'board-1'
};

export const closeList: trelloList = {
  id: 'list-2',
  name: 'Close',
  board: 'board-1'
};

export const trelloLists: Array<trelloList> = [openList, closeList];

export const trelloUser: TrelloIntegrationModel = {
  member: 'member-1',
  trelloFullName: 'trello_handle',
  trelloUsername: 'trellouser'
};

export const propertyTrelloIntegration: trelloPropertyModel = {
  closedBoard: trelloBoardWithOrg.id,
  closedBoardName: trelloBoardWithOrg.name,
  closedList: closeList.id,
  closedListName: closeList.name,
  openBoard: trelloBoardWithOrg.id,
  openBoardName: trelloBoardWithOrg.name,
  openList: openList.id,
  openListName: openList.name
};

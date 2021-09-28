import {
  trelloBoard,
  trelloList,
  trelloOrganization
} from '../common/services/api/trello';

export const trelloOrg: trelloOrganization = {
  id: 'organization-1',
  name: 'Sparkle'
};

export const trelloBoardWithOrg: trelloBoard = {
  id: 'board-1',
  name: 'Trello Board',
  organization: JSON.parse(JSON.stringify(trelloOrg))
};

export const trelloListWithOrg: trelloList = {
  id: 'list-1',
  name: 'Trello Board > List',
  board: trelloBoardWithOrg.id
};

export default [trelloOrg, trelloBoardWithOrg, trelloListWithOrg];

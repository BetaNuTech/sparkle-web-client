import produce from 'immer';

const initialTeamsState = {
  items: [],
  loadingStatusOfTeams: 'NEVER'
};

export const teamsReducer = produce((draft, action) => {
  switch (action.type) {
    case 'FETCH_DATA_OF_TEAMS':
      draft.items = [];
      draft.loadingStatusOfTeams = 'LOADING';
      break;
    case 'SET_DATA_OF_TEAMS':
      draft.items = action.payload;
      draft.loadingStatusOfTeams = 'LOADED';
      break;
    case 'SET_LOADING_STATUS_OF_TEAMS':
      draft.loadingStatusOfTeams = action.payload;
      break;

    default:
      break;
  }
}, initialTeamsState);

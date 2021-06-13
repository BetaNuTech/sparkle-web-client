import produce from 'immer';

export const initialPropertiesState = {
  activeSort: {
    sortBy: 'name',
    orderBy: 'asc'
  },
  items: [],
  loadingStatusOfProperties: 'NEVER'
};

export const propertiesReducer = produce((draft, action) => {
  switch (action.type) {
    case 'FETCH_DATA_OF_PROPERTIES':
      draft.items = [];
      draft.loadingStatusOfProperties = 'LOADING';
      break;
    case 'SET_DATA_OF_PROPERTIES':
      draft.items = action.payload;
      draft.loadingStatusOfProperties = 'LOADED';
      break;
    case 'SET_LOADING_STATUS_OF_PROPERTIES':
      draft.loadingStatusOfProperties = action.payload;
      break;

    default:
      break;
  }
}, initialPropertiesState);

export const fetchDataOfTeams = () => ({
  type: 'FETCH_DATA_OF_TEAMS'
});

export const setDataOfTeams = (payload) => ({
  type: 'SET_DATA_OF_TEAMS',
  payload
});

export const setLoadingStatusOfTeams = (payload) => ({
  type: 'SET_LOADING_STATUS_OF_TEAMS',
  payload
});

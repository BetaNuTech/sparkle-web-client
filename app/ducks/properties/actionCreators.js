export const fetchDataOfProperties = () => ({
  type: 'FETCH_DATA_OF_PROPERTIES'
});

export const setDataOfProperties = (payload) => ({
  type: 'SET_DATA_OF_PROPERTIES',
  payload
});

export const setLoadingStatusOfProperties = (payload) => ({
  type: 'SET_LOADING_STATUS_OF_PROPERTIES',
  payload
});

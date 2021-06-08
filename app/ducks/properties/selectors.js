export const selectStateOfProperties = (state) => state.properties;

export const selectActiveSortOfProperties = (state) =>
  selectStateOfProperties(state).activeSort;

export const selectItemsOfProperties = (state) =>
  selectStateOfProperties(state).items;

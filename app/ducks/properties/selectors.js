export const selectStateOfProperties = (state) => state.properties;

export const selectItemsOfProperties = (state) =>
  selectStateOfProperties(state).items;

export const selectStateOfTeams = (state) => state.teams;

export const selectItemsOfTeams = (state) => selectStateOfTeams(state).items;

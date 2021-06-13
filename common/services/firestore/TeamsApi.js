import teamsMock from '../../../__mocks__/PropertiesPage/teamsMock.json';

export const TeamsApi = {
  async fetchDataOfTeams() {
    const data = teamsMock;

    return data;
  }
};

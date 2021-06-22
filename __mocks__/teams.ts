import teamModel from '../common/models/team';

export const teamWithProperties: teamModel = {
  id: 'team-1',
  name: 'Team One',
  properties: {
    'property-1': true,
    'property-2': true
  }
};

export const teamWithoutProperties: teamModel = {
  id: 'team-2',
  name: 'Team Two'
};

export default [teamWithProperties, teamWithoutProperties];

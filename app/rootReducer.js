import { combineReducers } from 'redux';
import { teamsReducer } from './ducks/teams/reducer';
import { propertiesReducer } from './ducks/properties/reducer';

export const rootReducer = combineReducers({
  teams: teamsReducer,
  properties: propertiesReducer
});

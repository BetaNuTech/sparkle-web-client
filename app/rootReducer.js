import { combineReducers } from 'redux';
import { propertiesReducer } from './ducks/properties/reducer';

export const rootReducer = combineReducers({
  properties: propertiesReducer
});

import { all } from 'redux-saga/effects';
import { teamsSaga } from './ducks/teams/sagas';
import { propertiesSaga } from './ducks/properties/sagas';

export default function* rootSaga() {
  yield all([teamsSaga(), propertiesSaga()]);
}

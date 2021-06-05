import { all } from 'redux-saga/effects';
import { propertiesSaga } from './ducks/properties/sagas';

export default function* rootSaga() {
  yield all([propertiesSaga()]);
}

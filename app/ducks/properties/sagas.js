import { call, put, takeLatest } from 'redux-saga/effects';
import { PropertiesApi } from '../../../common/services/firestore/PropertiesApi';
import {
  setDataOfProperties,
  setLoadingStatusOfProperties
} from './actionCreators';

export function* fetchDataOfPropertiesRequest() {
  try {
    const items = yield call(PropertiesApi.fetchDataOfProperties);
    yield put(setDataOfProperties(items));
  } catch (error) {
    yield put(setLoadingStatusOfProperties('ERROR'));
  }
}

export function* propertiesSaga() {
  yield takeLatest('FETCH_DATA_OF_PROPERTIES', fetchDataOfPropertiesRequest);
}

import { call, put, takeLatest } from 'redux-saga/effects';
import { TeamsApi } from '../../../common/services/firestore/TeamsApi';
import { setDataOfTeams, setLoadingStatusOfTeams } from './actionCreators';

export function* fetchDataOfTeamsRequest() {
  try {
    const items = yield call(TeamsApi.fetchDataOfTeams);
    yield put(setDataOfTeams(items));
  } catch (error) {
    yield put(setLoadingStatusOfTeams('ERROR'));
  }
}

export function* teamsSaga() {
  yield takeLatest('FETCH_DATA_OF_TEAMS', fetchDataOfTeamsRequest);
}

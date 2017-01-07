'use babel'

import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import TeamLoader from '../../TeamLoader'

function* persistTheTeamSaga() {
  try {
    const teamLoader = new TeamLoader()
    teamLoader.persist()
    yield put({ type: 'teamWasPersisted', payload: 'done' })
  } catch (e) {
    console.log(e)
    yield put({ type: 'status', payload: 'error' })
  }
}

export default function* persistTheTeam() {
  yield* takeEvery('addNewTeam', persistTheTeamSaga);
}

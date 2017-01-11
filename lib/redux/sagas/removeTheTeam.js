'use babel'

import { takeEvery } from 'redux-saga'
import { put, select } from 'redux-saga/effects'

import TeamLoader from '../../TeamLoader'

function* removeTheTeamSaga(action) {
  const teamLoader = new TeamLoader()
  const teams = yield select(state => state.teams)
  const nextTeamToBeActive = teams.filter(t => t.id !== action.payload.id)[0]

  try {
    teamLoader.removeTeam(action.payload)
    yield put({ type: 'teamWasDeleted', payload: 'done' })

    if (nextTeamToBeActive) {
      yield put({ type: 'setCurrentTeam', payload: nextTeamToBeActive })
    } else {
      yield put({ type: 'setCurrentTeam', payload: null })
    }
  } catch (e) {
    yield put({ type: 'status', payload: 'error' })
  }
}

export default function* persistTheTeam() {
  yield* takeEvery('removeTeam', removeTheTeamSaga);
}

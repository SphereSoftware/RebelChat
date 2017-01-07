'use babel'

import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { ChannelObject } from '../../../lib/objects'

import TeamLoader from '../../TeamLoader'

function fetchChannelHistory(channel) {
  return (new TeamLoader()).find(channel.teamId).history(channel)
  .then(response => ({ response }))
  .catch(error => ({ error }))
}

function markChannelAsRead(channel) {
  return (new TeamLoader()).find(channel.teamId).mark(channel)
  .then(response => ({ response }))
  .catch(error => ({ error }))
}

function* loadHistorySaga(action) {
  // Do not load history if something is here
  const channel = action.payload
  const currentMessages = yield select(state => state.messages[`${channel.teamId}#${channel.id}`])

  // mark channel as read
  if (currentMessages) {
    yield call(markChannelAsRead, channel)
    return
  }

  // set in progress & mark as read
  yield put({ type: 'updateChannel', payload: new ChannelObject({ ...channel, status: 'inProgress' }) })
  yield call(markChannelAsRead, channel)

  const { response, error } = yield call(fetchChannelHistory, channel)
  if (response) {
    yield put({ type: 'updateChannel', payload: new ChannelObject({ ...channel, status: 'online' }) })
  } else {
    yield put({ type: 'loadHistoryFailed', error })
    yield put({ type: 'updateChannel', payload: new ChannelObject({ ...channel, status: 'error' }) })
  }
}

export default function* loadChannelHistory() {
  yield* takeEvery('setActiveChannel', loadHistorySaga);
}

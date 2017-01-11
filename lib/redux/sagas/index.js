'use babel'

import loadChannelHistory from './loadChannelHistory'
import persistTheTeam from './persistTheTeam'
import removeTheTeam from './removeTheTeam'
import notifyOnMessage from './notifyOnMessage'

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield [
    loadChannelHistory(),
    persistTheTeam(),
    removeTheTeam(),
    notifyOnMessage(),
  ]
}

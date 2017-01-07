'use babel'

import { createStore, applyMiddleware, combineReducers } from 'redux'

import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import * as reducers from './modules'
import rootSaga from './sagas'

const logger = createLogger()
const sagaMiddleware = createSagaMiddleware()

const initdata = {
  currentTeam: null,
  teams: [],
  activeChannels: {},
  channels: {},
  users: {},
  messages: {},
  status: null,
  isVisible: false,
}

export default createStore(
  combineReducers(reducers),
  initdata,
  applyMiddleware(logger, sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

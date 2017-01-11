'use babel'

// ================= Team Managment ===========================================================
import { createAction, handleActions } from 'redux-actions'

export const setAllMessages = createAction('setAllMessages')
export const addMessages = createAction('addMessages')
export const sendMessage = createAction('sendMessage')
export const receiveMessage = createAction('receiveMessage')
export const updateMessage = createAction('updateMessage')
export const replaceMessage = createAction('replaceMessage', (from, to) => [from, to])

// ================= Team Managment =====================================================================
import { removeTeam } from './teams'

export default handleActions({
  // initial set all messages in a channel
  [setAllMessages]: (state, action) => {
    const messages = action.payload
    const { teamId, channelId } = messages[0]
    const key = `${teamId}#${channelId}`

    return {
      ...state,
      [key]: messages.reduce((acc, message) => {
        acc[message.id] = message
        return acc
      }, {}),
    }
  },

  [addMessages]: (state, action) => {
    const messages = action.payload
    const { teamId, channelId } = messages[0]
    const key = `${teamId}#${channelId}`
    const channelMessages = state[key] || {}

    return {
      ...state,
      [key]: messages.reduce((acc, message) => {
        acc[message.id] = message
        return acc
      }, channelMessages),
    }
  },

  // add each new channel
  [sendMessage]: (state, action) => {
    const message = action.payload
    const { teamId, channelId } = action.payload
    const key = `${teamId}#${channelId}`
    const channelMessages = state[key] || {}

    return {
      ...state,
      [key]: {
        ...channelMessages,
        [message.id]: message,
      },
    }
  },

  // receive message
  [receiveMessage]: (state, action) => {
    const message = action.payload
    const { teamId, channelId } = action.payload
    const key = `${teamId}#${channelId}`
    const channelMessages = state[key] || {}

    return {
      ...state,
      [key]: {
        ...channelMessages,
        [message.id]: message,
      },
    }
  },

  // update message
  [updateMessage]: (state, action) => {
    const message = action.payload
    const { teamId, channelId } = action.payload
    const key = `${teamId}#${channelId}`
    const channelMessages = state[key] || {}
    return {
      ...state,
      [key]: {
        ...channelMessages,
        [message.id]: message,
      },
    }
  },

  // add each new channel
  [replaceMessage]: (state, action) => {
    const [from, to] = action.payload

    const { teamId, channelId } = from
    const key = `${teamId}#${channelId}`
    const channelMessages = state[key] || {}

    // remove existing message
    delete channelMessages[from.id]

    return {
      ...state,
      [key]: {
        ...channelMessages,
        [to.id]: to,
      },
    }
  },

  // clean up data when team was deleted
  [removeTeam]: (state, action) => {
    const teamId = action.payload.id
    const keys = Object.keys(state).filter(id => !RegExp(`${teamId}#`).test(id))

    return keys.reduce((memo, key) => {
      memo[key] = state[key]
      return memo
    }, {})
  },
}, {})

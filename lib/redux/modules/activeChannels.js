'use babel'

// ================= Active Channel Managment ===========================================================
import { createAction, handleActions } from 'redux-actions'
import { setAllChannels, addChannels, addNewChannel, removeChannel, updateChannel } from './channels'
export const setActiveChannel = createAction('setActiveChannel')

export default handleActions({
  // set first channel as default on initial load
  [setAllChannels]: (state, action) => {
    const { channels, teamId } = action.payload
    const activeChannel = state[teamId] || channels.filter(ch => ch.isMember)[0]
    return {
      ...state,
      [teamId]: activeChannel,
    }
  },

  // set first channel as default if no channel selected
  [addChannels]: (state, action) => {
    const { channels, teamId } = action.payload
    const activeChannel = state[teamId] || channels.filter(ch => ch.isMember)[0]
    return {
      ...state,
      [teamId]: activeChannel,
    }
  },

  // set provided channel as selected
  [setActiveChannel]: (state, action) => {
    const channel = action.payload

    channel.lastRead = new Date()
    channel.unreadCount = 0

    return {
      ...state,
      [channel.teamId]: channel,
    }
  },

  // add each new channel
  [addNewChannel]: (state, action) => {
    const channel = action.payload
    return {
      ...state,
      [channel.teamId]: channel,
    }
  },

  // update channel
  [removeChannel]: (state, action) => {
    const channel = action.payload

    const isCurrentActive = state[channel.teamId] || {}

    if (isCurrentActive.id !== channel.id) {
      return state
    }

    return {
      ...state,
      [channel.teamId]: undefined,
    }
  },

  // update channel
  [updateChannel]: (state, action) => {
    const channel = action.payload

    if (channel.id === (state[channel.teamId] || {}).id) {
      return {
        ...state,
        [channel.teamId]: channel,
      }
    }

    if (!action.payload.isMember) {
      return state
    }

    return {
      ...state,
      [channel.teamId]: state[channel.teamId] || channel,
    }
  },
}, {})

'use babel'

// ================= Team Managment ===========================================================
import { createAction, handleActions } from 'redux-actions'

export const setAllChannels = createAction('setAllChannels')
export const addChannels = createAction('addChannels')
export const addNewChannel = createAction('addNewChannel')
export const removeChannel = createAction('removeChannel')
export const updateChannel = createAction('updateChannel')
export const setActiveChannel = createAction('setActiveChannel')

// ================= Team Managment =====================================================================
import { removeTeam } from './teams'

export default handleActions({
  // initial set all channels
  [setAllChannels]: (state, action) => {
    const { channels, teamId } = action.payload
    return {
      ...state,
      [teamId]: channels.reduce((acc, channel) => {
        acc[channel.id] = channel
        return acc
      }, {}),
    }
  },

  // Add channels
  [addChannels]: (state, action) => {
    const { channels, teamId } = action.payload
    const currentChannels = state[teamId] || {}
    return {
      ...state,
      [teamId]: channels.reduce((acc, channel) => {
        acc[channel.id] = channel
        return acc
      }, currentChannels),
    }
  },

  // add each new channel
  [addNewChannel]: (state, action) => {
    const channel = action.payload
    const teamChannels = state[channel.teamId] || {}
    return {
      ...state,
      [channel.teamId]: {
        ...teamChannels,
        [channel.id]: channel,
      },
    }
  },

  // add each new channel
  [removeChannel]: (state, action) => {
    const channel = action.payload
    const teamChannels = state[channel.teamId] || {}
    const channelToRemove = teamChannels[channel.id]
    channelToRemove.isMember = false
    channelToRemove.status = 'online'
    return {
      ...state,
      [channel.teamId]: {
        ...teamChannels,
        [channel.id]: channelToRemove,
      },
    }
  },

  // update channel
  [updateChannel]: (state, action) => {
    const channel = action.payload
    const teamChannels = state[channel.teamId] || {}
    return {
      ...state,
      [channel.teamId]: {
        ...teamChannels,
        [channel.id]: channel,
      },
    }
  },

  // when channel is active reset unread count
  [setActiveChannel]: (state, action) => {
    const channel = action.payload
    channel.lastRead = new Date()
    channel.unreadCount = 0
    const teamChannels = state[channel.teamId] || {}
    return {
      ...state,
      [channel.teamId]: {
        ...teamChannels,
        [channel.id]: channel,
      },
    }
  },

  // clean up data when team was deleted
  [removeTeam]: (state, action) => {
    delete state[action.payload.id]

    return {
      ...state,
    }
  },
}, {})

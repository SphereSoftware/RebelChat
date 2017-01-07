'use babel'

// ================= Team Managment ===========================================================
import { createAction, handleActions } from 'redux-actions'

export const setAllUsers = createAction('setAllUsers')
export const addUsers = createAction('addUsers')
export const addNewUser = createAction('addNewUser')
export const updateUser = createAction('updateUser')

export default handleActions({
  // initial set all users
  [setAllUsers]: (state, action) => {
    const { users, teamId } = action.payload
    return {
      ...state,
      [teamId]: users.reduce((acc, user) => {
        acc[user.id] = user
        return acc
      }, {}),
    }
  },

  // Add users bunch of users at the same time
  [addUsers]: (state, action) => {
    const { users, teamId } = action.payload
    const currentTeamUsers = state[teamId] || {}
    return {
      ...state,
      [teamId]: users.reduce((acc, user) => {
        acc[user.id] = user
        return acc
      }, currentTeamUsers),
    }
  },

  // add each new team to the store
  [addNewUser]: (state, action) => {
    const user = action.payload
    const teamUsers = state[user.teamId] || {}
    return {
      ...state,
      [user.teamId]: {
        ...teamUsers,
        [user.id]: user,
      },
    }
  },

  // update provided user
  [updateUser]: (state, action) => {
    const user = action.payload
    const teamUsers = state[user.teamId] || {}
    return {
      ...state,
      [user.teamId]: {
        ...teamUsers,
        [user.id]: user,
      },
    }
  },
}, {})

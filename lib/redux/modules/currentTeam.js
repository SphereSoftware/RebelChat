'use babel'

// ================= Team Managment ===========================================================
import { createAction, handleActions } from 'redux-actions'
import { addNewTeam, updateTeam } from './teams'

export const setCurrentTeam = createAction('setCurrentTeam')

export default handleActions({
  // add first team as default current
  [addNewTeam]: (state, action) => {
    if (!state) {
      return action.payload
    }
    return state
  },

  // update current team if it match
  [updateTeam]: (state, action) => {
    if (state && state.id === action.payload.id) {
      return action.payload
    }
    return state
  },

  // set selected team as current
  [setCurrentTeam]: (state, action) => (action.payload ? action.payload : state),
}, null)

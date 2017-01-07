'use babel'

// ================= Team Managment ===========================================================
import { createAction, handleActions } from 'redux-actions'

export const addNewTeam = createAction('addNewTeam')
export const updateTeam = createAction('updateTeam')

export default handleActions({
  // add each new team to the store
  [addNewTeam]: (state, action) => [...state, action.payload],

  // update team object
  [updateTeam]: (state, action) => state.map(team => (team.id === action.payload.id ? action.payload : team)),
}, [])

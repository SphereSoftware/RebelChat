'use babel'

// ================= Application Level Managment ===========================================================
import { createAction, handleActions } from 'redux-actions'

export const setStatus = createAction('setStatus')

export default handleActions({
  // add each new team to the store
  [setStatus]: (state, action) => action.payload,
}, '')

'use babel'

// ================= Application Level Managment ===========================================================
import { createAction, handleActions } from 'redux-actions'

export const setVisiable = createAction('setVisiable')

export default handleActions({
  // set Application is visiable or hiden
  [setVisiable]: (state, action) => action.payload,
}, false)

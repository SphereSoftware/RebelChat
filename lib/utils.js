'use babel'

import _ from 'underscore-plus'

export const nowTs = () => (new Date()).getTime()
export const uniqueId = () => _.uniqueId()
export const messageTs = date => (new Date(date)).toLocaleString().split(',')[1].trim().replace(/:\d\d\s/, ' ')

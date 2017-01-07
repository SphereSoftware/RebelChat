'use babel';

import { uniqueId } from '../utils'

export default class UserObject {
  constructor(options) {
    const {
      id,
      jid,
      username,
      avatar,
      displayName,
      teamId,
      status,
      email,
    } = options

    this.id = id || uniqueId()
    this.jid = jid
    this.teamId = teamId
    this.username = username
    this.avatar = avatar || 'https://i2.wp.com/koding-cdn.s3.amazonaws.com/images/default.avatar.140.png?ssl=1'
    this.displayName = displayName
    this.email = email
    this.status = status
  }

  serialize() {
    const {
      id,
      jid,
      username,
      avatar,
      displayName,
      teamId,
      status,
      email,
    } = this

    return {
      id,
      jid,
      username,
      avatar,
      displayName,
      teamId,
      status,
      email,
    }
  }
}

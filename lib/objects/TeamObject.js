'use babel';

import { uniqueId } from '../utils'
import TeamLoader from '../TeamLoader'

export default class TeamObject {
  constructor({ id, userId, name, icon, status, accessToken }) {
    this.id = id || uniqueId()
    this.userId = userId
    this.name = name
    this.icon = icon
    this.status = status || 'new'
    this.accessToken = accessToken
  }

  send(message, optCb) {
    this.getConnection().send(message, optCb)
  }

  leave(channel, optCb) {
    this.getConnection().leave(channel, optCb)
  }

  join(channel, optCb) {
    this.getConnection().join(channel, optCb)
  }

  getConnection() {
    return (new TeamLoader()).find(this.id)
  }

  serialize() {
    const { id, userId, name, icon, status, accessToken } = this

    return {
      id,
      userId,
      name,
      icon,
      status,
      accessToken,
    }
  }
}

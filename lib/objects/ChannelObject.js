'use babel';

import { nowTs, uniqueId } from '../utils'

export default class ChannelObject {
  constructor(options) {
    const {
      id,
      jid,
      teamId,
      name,
      type,
      topic,
      memberIds,
      isMember,
      unreadCount,
      lastRead,
      status,
    } = options

    this.id = id || uniqueId()
    this.jid = jid
    this.teamId = teamId
    this.name = name
    this.type = type
    this.topic = topic
    this.memberIds = memberIds || []
    this.isMember = isMember || false
    this.unreadCount = unreadCount || 0
    this.lastRead = lastRead || nowTs()
    this.status = status
  }

  serialize() {
    const {
      id,
      jid,
      teamId,
      name,
      type,
      topic,
      memberIds,
      isMember,
      unreadCount,
      lastRead,
      status,
    } = this

    return {
      id,
      jid,
      teamId,
      name,
      type,
      topic,
      memberIds,
      isMember,
      unreadCount,
      lastRead,
      status,
    }
  }
}

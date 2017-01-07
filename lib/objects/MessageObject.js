'use babel';

import { nowTs } from '../utils'

export default class MessageObject {
  constructor(options) {
    const {
      id,
      teamId,
      senderId,
      channelId,
      text,
      type,
      file,
      createdAt,
      state,
      safe,
    } = options

    this.id = id || nowTs()
    this.teamId = teamId
    this.senderId = senderId
    this.channelId = channelId
    this.text = text
    this.type = type || 'text'
    this.file = file
    this.createdAt = createdAt || nowTs()
    this.state = state || 'new' // sent, seen
    this.safe = (safe === true)
  }

  serialize() {
    const {
      id,
      teamId,
      senderId,
      channelId,
      text,
      type,
      file,
      createdAt,
      state,
      safe,
    } = this

    return {
      id,
      teamId,
      senderId,
      channelId,
      text,
      type,
      file,
      createdAt,
      state,
      safe,
    }
  }
}

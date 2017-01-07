'use babel'

import path from 'path'
import fs from 'fs-plus'

import {
  RtmClient,
  WebClient,
  MemoryDataStore,
  RTM_EVENTS,
  CLIENT_EVENTS,
} from '@slack/client'

const RTM_CLIENT_EVENTS = CLIENT_EVENTS.RTM

import { TeamObject, UserObject, ChannelObject, MessageObject } from './objects'

import { setStatus } from './redux/modules/status'
import { updateTeam, addNewTeam } from './redux/modules/teams'
import { setAllUsers } from './redux/modules/users'
import { addNewChannel, removeChannel, updateChannel, addChannels } from './redux/modules/channels'
import { setActiveChannel } from './redux/modules/activeChannels'
import { sendMessage, receiveMessage, replaceMessage, addMessages } from './redux/modules/messages'

import store from './redux/store'

export default class Slack {
  constructor(options) {
    this.id = options.team_id || options.id
    this.userId = options.user_id || options.userId
    this.name = options.team_name || options.name
    this.accessToken = options.access_token || options.accessToken

    this.rtm = new RtmClient(this.accessToken, {
      logLevel: 'debug',
      dataStore: new MemoryDataStore(),
    })

    this.web = new WebClient(this.accessToken)
    this.bind()
  }

  bind() {
    const { rtm } = this

    rtm.on(RTM_EVENTS.CHANNEL_JOINED, (obj) => {
      const { channel } = obj
      if (channel) {
        const chObj = new ChannelObject({
          id: channel.id,
          teamId: this.id,
          name: channel.name,
          type: 'group',
          topic: channel.topic,
          memberIds: channel.members,
          isMember: channel.is_member,
          unreadCount: channel.unread_count,
          lastRead: channel.last_read,
          status: 'online',
        })
        store.dispatch(addNewChannel(chObj))
      }
    })

    rtm.on(RTM_EVENTS.CHANNEL_LEFT, (obj) => {
      const { channel } = obj
      if (channel) {
        const chObj = new ChannelObject({
          id: channel,
          teamId: this.id,
          type: 'group',
        })
        store.dispatch(removeChannel(chObj))
      }
    })

    rtm.on(RTM_EVENTS.MESSAGE, (msg) => {
      if (msg.type !== 'message' || msg.subtype) {
        return
      }

      const message = new MessageObject({
        id: msg.ts,
        senderId: msg.user,
        channelId: msg.channel,
        teamId: this.id,
        text: msg.text,
        createdAt: msg.ts * 1000,
        state: 'received',
      })

      store.dispatch(receiveMessage(message))
      if (this.getDisplayedChannel().id !== message.channelId) {
        this.incrementUnread(message)
      }
    });

    rtm.on(RTM_CLIENT_EVENTS.AUTHENTICATED, (rtmStartData) => {
      // set up connection data
      this.id = rtmStartData.team.id
      this.name = rtmStartData.team.name
      this.userId = rtmStartData.self.id
      if (!rtmStartData.team.icon.image_default) {
        this.icon = rtmStartData.team.icon.image_230
      }

      const teamObject = new TeamObject({
        ...this.serialize(),
      })
      store.dispatch(addNewTeam(teamObject))
      store.dispatch(setStatus('ready'))

      this.fullFillUsers(rtmStartData.users)
      this.fullFillChannels(rtmStartData.channels)
      this.fullFillDirectMessages(rtmStartData.ims)
      this.didConnect()
    })

    return this
  }

  connect() {
    this.rtm.start()
  }

  getDisplayedChannel() {
    const { currentTeam, activeChannels } = store.getState()
    return activeChannels[currentTeam.id] || {}
  }

  incrementUnread(msg) {
    const { channels } = store.getState()
    let channel = channels[this.id][msg.channelId]

    if (!channel) {
      const obj = this.rtm.dataStore.getChannelGroupOrDMById(msg.channelId)

      if (obj.is_group) {
        // clean up private group name
        const name = obj.name
          .replace(/--/gi, ', ')
          .replace(/^[^-]+-/, '')
          .replace(/-\d?/, '')

        channel = new ChannelObject({
          id: obj.id,
          teamId: this.id,
          name,
          type: 'group',
          memberIds: obj.members,
          isMember: obj.is_mpim,
          unreadCount: obj.unread_count,
          lastRead: obj.last_read,
          status: 'online',
        })
      }
    } else {
      channel.unreadCount += 1
    }

    store.dispatch(updateChannel(channel))
  }

  send(message) {
    switch (message.type) {
      case 'file':
        this.sendFile(message)
        break
      case 'text':
        this.sendTextMessage(message)
        break
      default:
        this.sendTextMessage(message)
    }
  }

  sendFile(message) {
    const filePath = message.text
    const fileName = path.basename(filePath)
    const streamOpts = {
      channels: message.channelId,
      filename: fileName,
      file: fs.createReadStream(filePath),
    }

    store.dispatch(sendMessage(new MessageObject({
      ...message.serialize(),
      text: `in progress ${fileName}` }),
    ))

    this.web.files.upload(fileName, streamOpts, (err, res) => {
      const newMessage = new MessageObject({
        ...message.serialize(),
        text: 'File was uploaded',
        type: 'file',
        file: res.file,
        state: 'sent',
      })

      store.dispatch(replaceMessage(message, newMessage))
    })
  }

  sendTextMessage(message) {
    store.dispatch(sendMessage(message))
    this.rtm.sendMessage(message.text, message.channelId, (err, msg) => {
      if (!msg) { return }
      const newMessage = new MessageObject({
        ...message.serialize(),
        id: msg.ts,
        state: 'sent',
      })
      store.dispatch(replaceMessage(message, newMessage))
    })
  }

  /* eslint consistent-return: 0 */
  prepareMessage(rawMsg, channel) {
    let message
    if (rawMsg.type !== 'message') {
      return
    }

    switch (rawMsg.subtype) {
      case 'file_share': {
        message = new MessageObject({
          id: rawMsg.ts,
          senderId: rawMsg.user,
          channelId: channel.id,
          teamId: channel.teamId,
          text: rawMsg.text,
          type: 'file',
          file: rawMsg.file,
          createdAt: rawMsg.ts * 1000,
          state: 'received',
        })
        break
      }
      case undefined: {
        message = new MessageObject({
          id: rawMsg.ts,
          senderId: rawMsg.user,
          channelId: channel.id,
          teamId: channel.teamId,
          type: 'text',
          text: rawMsg.text,
          createdAt: rawMsg.ts * 1000,
          state: 'received',
        })
        break
      }
      default:
    }

    return message
  }

  history(channel, options = {}) {
    let req
    if (channel.type === 'group') {
      req = this.web.channels.history(channel.id, options)
    } else {
      req = this.web.im.history(channel.id, options)
    }

    return req.then((response) => {
      const messages = response.messages.reduce((memo, rawMsg) => {
        const message = this.prepareMessage(rawMsg, channel)
        if (message) {
          memo.push(message)
        }

        return memo
      }, [])

      if (messages.length > 0) {
        store.dispatch(addMessages(messages))
      }
    })
  }

  mark(channel) {
    const ts = ((new Date()).getTime() * 0.001) + 0.000001
    if (channel.type === 'group') {
      return this.web.channels.mark(channel.id, ts)
    }

    return this.web.im.mark(channel.id, ts)
  }

  join(channel, optCb) {
    if (channel.type === 'group') {
      this.web.channels.join(channel.name, optCb)
    } else {
      console.log('join channel - ', channel)
    }
  }

  leave(channel, optCb) {
    if (channel.type === 'group') {
      this.web.channels.leave(channel.id, optCb)
    } else {
      console.log('leaving channel - ', channel)
    }
  }

  didConnect() {
    const teamObject = new TeamObject({
      ...this.serialize(),
      status: 'online',
    })
    store.dispatch(updateTeam(teamObject))
  }

  fullFillUsers(rawUsers) {
    const users = rawUsers.map((user) => {
      return new UserObject({
        id: user.id,
        teamId: this.id,
        username: user.name,
        displayName: user.profile.real_name,
        avatar: user.profile.image_72,
        status: (user.presence === 'active' ? 'online' : 'offline'),
      })
    })
    store.dispatch(setAllUsers({ users, teamId: this.id }))
  }

  fullFillChannels(rawChannels) {
    const channels = rawChannels.map((channel) => {
      return new ChannelObject({
        id: channel.id,
        teamId: this.id,
        name: channel.name,
        type: 'group',
        topic: channel.topic,
        memberIds: channel.members,
        isMember: channel.is_member,
        unreadCount: channel.unread_count,
        lastRead: channel.last_read,
        status: 'online',
      })
    })

    store.dispatch(addChannels({ channels, teamId: this.id }))
    store.dispatch(setActiveChannel(channels.filter(ch => ch.isMember)[0]))
  }

  fullFillDirectMessages(dms) {
    const channels = dms.map((channel) => {
      return new ChannelObject({
        id: channel.id,
        teamId: this.id,
        name: this.rtm.dataStore.getUserById(channel.user).name,
        type: 'dm',
        memberIds: [channel.user, this.userId],
        isMember: true,
        unreadCount: channel.unread_count,
        lastRead: channel.last_read,
      })
    })
    store.dispatch(addChannels({ channels, teamId: this.id }))
  }

  serialize() {
    const { id, name, userId, icon, accessToken } = this
    const type = 'Slack'

    return {
      id,
      type,
      name,
      userId,
      icon,
      accessToken,
    }
  }
}

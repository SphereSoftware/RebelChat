'use babel'

import { Client } from 'irc'

import { TeamObject, UserObject, ChannelObject, MessageObject } from './objects'

import { updateTeam, addNewTeam } from './redux/modules/teams'
import { addNewUser, addUsers } from './redux/modules/users'
import { addNewChannel, updateChannel, addChannels } from './redux/modules/channels'
import { setActiveChannel } from './redux/modules/activeChannels'
import { sendMessage, receiveMessage, replaceMessage } from './redux/modules/messages'

import store from './redux/store'

export default class Irc {
  constructor(options) {
    const { server, nick, password, channels } = options

    this.type = 'Irc'
    this.nick = nick
    this.password = password
    this.server = server
    this.channels = channels || ['#general']

    this.userId = nick
    this.id = `${nick}@${server}`
    this.accessToken = this.id
    this.name = nick
    this.icon = options.icon || 'IrcIcon'

    this.irc = new Client(server, nick, {
      debug: true, // FIXME remove when not needed
      channels,
      autoConnect: false,
      retryCount: 10,
      retryDelay: 20000,
      userName: nick,
      password,
      nick,
      realName: options.realName || `IRC ${nick}`,
    })
    this.bind()

    window.iii = this.irc // FIXME DEBUGANCHOR remove afterwards
    window.iii2 = this // FIXME DEBUGANCHOR remove afterwards
  }

  connect() {
    store.dispatch(addNewTeam(
      new TeamObject({
        ...this.serialize(),
      })
    ))
    store.dispatch(addNewUser(
      new UserObject({
        id: this.nick,
        teamId: this.id,
        username: this.userName,
        displayName: this.nick,
        status: 'online',
      })
    ))

    this.irc.connect()
  }

  bind() {
    const irc = this.irc

    irc.addListener('error', (message) => {
      console.log('IRC::ERROR !!!', message)
    })

    irc.addListener('registered', (message) => {
      console.log('IRC::registered', message)
      this.didConnect()
    })

    irc.addListener('message', (from, to, text) => {
      console.log(`IRC::message ${from}=>${to}: ${text}`)
      const createdAt = new Date()
      store.dispatch(receiveMessage(
        new MessageObject({
          id: (new Date()).getTime(),
          senderId: from,
          channelId: to,
          teamId: this.id,
          text,
          createdAt,
          state: 'received',
        })
      ))

      const channel = store.getState().channels[this.id][to]
      if (channel) {
        channel.unreadCount += 1
        store.dispatch(updateChannel(channel))
      }
    })

    irc.addListener('join', (channel, nick, message) => {
      console.log(`IRC::JOIN ${channel} ${nick}`, message)

      const newChannel = new ChannelObject({
        id: channel,
        teamId: this.id,
        name: channel.slice(1),
        type: 'group',
        topic: channel,
        memberIds: [this.userId],
        isMember: true,
        status: 'online',
      })

      store.dispatch(addNewChannel(newChannel))

      if (channel === this.channels[0]) {
        store.dispatch(setActiveChannel(newChannel))
      }
    })

    irc.addListener('raw', (message) => {
      const [ nick, ...args ] = message.args

      switch (message.command.toLowerCase()) {
        case 'rpl_topic': {
          this.handleRplTopic(message)
          break
        }

        case 'rpl_namreply': {
          this.handleRplNamreply(message)
          break
        }

        default: {
          console.log(`IRC::RAW *** ${message.command}`, message)
        }
      }
    })
  }

  didConnect() {
    this.updateTeam({status: 'online'})
  }

  handleRplTopic(message) {
    const [ nick, chanName, topic ] = message.args

    console.log(`IRC::rpl_topic`, message)
    const channel = store.getState().channels[this.id][chanName]
    store.dispatch(updateChannel(
      new ChannelObject({ ...channel, topic })
    ))
  }

  handleRplNamreply(message) {
    console.log(`IRC::rpl_namreply`, message)
    const [ nick, _tmp, chanName, userNamesStr ] = message.args
    const state = store.getState()
    const channels = state.channels[this.id]
    const currentChannel = channels[chanName]

    const userNames = userNamesStr.split(/\s+/).filter((x) => x)
    const updates = userNames.reduce(
      (accum, nick) => {
        if (nick !== this.nick) {
          accum.memberIds.push(nick)
        }

        if (!state.users[this.id][nick]) {
          accum.users.push(
            new UserObject({
              id: nick,
              teamId: this.id,
              username: nick,
              displayName: nick,
              status: 'online',
            })
          )
        }

        if (!channels[nick]) {  // create missing direct msg chan
          accum.channels.push(
            new ChannelObject({
              id: nick,
              teamId: this.id,
              name: nick,
              type: 'dm',
              memberIds: [nick, this.userId],
              isMember: true,
              lastRead: 0,
            })
          )
        }

        return accum
      },
      {
        users: [],
        channels: [],
        memberIds: currentChannel.memberIds,
        teamId: this.id,
      }
    )

    store.dispatch(addUsers(updates))
    store.dispatch(addChannels(updates))
    store.dispatch(updateChannel(
      new ChannelObject({
         ...currentChannel,
         memberIds: updates.memberIds,
      })
    ))
  }

  updateTeam(updates) {
    const newTeamObject = new TeamObject({
      ...this.serialize(),
      ...updates,
    })
    store.dispatch(updateTeam(newTeamObject))
  }

  history(channel, options = {}) {
    return new Promise((resolve, reject) => {
      resolve({})
    })
  }

  mark(channel) {
    return new Promise((resolve, reject) => {
      resolve({})
    })
  }

  join(channel, optCb) {
    return new Promise((resolve, reject) => {
      resolve({})
    })
  }

  send(message) {
    store.dispatch(sendMessage(message))
    this.irc.say(message.channelId, message.text)
    const newMessage = new MessageObject({
      ...message.serialize(),
      createdAt: new Date(),
      state: 'sent',
    })

    store.dispatch(replaceMessage(message, newMessage))
  }

  serialize() {
    const {
      id,
      type,
      name,
      nick,
      password,
      server,
      channels,
      userId,
      icon,
      accessToken,
    } = this

    return {
      id,
      type,
      name,
      nick,
      password,
      server,
      channels,
      userId,
      icon,
      accessToken,
    }
  }
}

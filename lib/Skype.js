'use babel'

import { TeamObject, UserObject, ChannelObject, MessageObject } from './objects'

import { setStatus } from './redux/modules/status'
import { updateTeam, addNewTeam } from './redux/modules/teams'
import { setAllUsers, addNewUser } from './redux/modules/users'
import { addNewChannel, removeChannel, updateChannel, addChannels } from './redux/modules/channels'
import { setActiveChannel } from './redux/modules/activeChannels'
import { sendMessage, receiveMessage, replaceMessage, addMessages } from './redux/modules/messages'

import store from './redux/store'
import { Skyweb } from 'skyweb-revised'

export default class Skype {
  constructor(options) {
    const { login, password } = options

    this.login = login
    this.password = password

    this.userId = `8:${login}`
    this.id = `skype:id:${this.userId}`
    this.accessToken = this.id
    this.name = `${login} Skype`
    this.icon = 'http://icons.veryicon.com/png/System/Windows%208%20Metro/Apps%20Skype%20alt%20Metro.png'

    this.web = new Skyweb()
  }

  bind() {
    this.web.messagesCallback = (eventMessages) => {
      this.handleEvents(eventMessages)
    }

    this.web.getConversations((conversations) => {
      this.fullFillChannelsAndDirectMessages(conversations)
    })
  }

  connect() {
    this.web.login(this.login, this.password).then(() => {
      console.log('Skyweb is initialized now')
      console.log('Going incognito.')
      this.web.setStatus('Hidden')

      const teamObject = new TeamObject({
        ...this.serialize(),
      })
      store.dispatch(addNewTeam(teamObject))
      this.fullFillUsers(this.web.contactsService.contacts)
      this.addCurrentUser(this.web.skypeAccount.selfInfo)

      store.dispatch(setStatus('ready'))

      this.bind()
      this.didConnect()
    }).catch((reason: string) => {
      console.log(reason)
    })

    window.xxx = this.web // FIXME DEBUGANCHOR remove afterwards
  }

  addCurrentUser(rawUserData) {
    store.dispatch(addNewUser(new UserObject({
      id: `8:${rawUserData.username}`,
      teamId: this.id,
      email: rawUserData.emails[0],
      username: rawUserData.username,
      displayName: `${rawUserData.firstname} ${rawUserData.lastname}`,
      avatar: rawUserData.avatarUrl,
      status: 'online',
    })))
  }

  handleEvents(eventMessages) {
    const messages = eventMessages.reduce((memo, item) => {
      if (
        item.resourceType === 'NewMessage' &&
        item.resource.from.indexOf(this.login) === -1 &&
        item.resource.messagetype !== 'Control/Typing' &&
        item.resource.messagetype !== 'Control/ClearTyping'
      ) {
        const rawMsg = item.resource
        const message = new MessageObject({
          id: rawMsg.id,
          senderId: rawMsg.from.split('/').pop(),
          channelId: rawMsg.conversationLink.split('/').pop(),
          teamId: this.id,
          type: 'text',
          text: rawMsg.content,
          createdAt: rawMsg.originalarrivaltime,
          state: 'received',
        })
        memo.push(message)
      }
      return memo
    }, [])

    if (messages.length > 0) {
      store.dispatch(addMessages(messages))
    }
  }

  fullFillUsers(rawUsers) {
    const users = rawUsers.map((user) => {
      return new UserObject({
        id: `8:${user.id}`,
        teamId: this.id,
        username: user.id,
        displayName: user.display_name,
        avatar: user.avatar_url,
        status: (user.presence === 'active' ? 'online' : 'offline'),
      })
    })
    store.dispatch(setAllUsers({ users, teamId: this.id }))
  }

  fullFillChannelsAndDirectMessages(rawChannels) {
    const channels = rawChannels.map((channel) => {
      if (channel.threadProperties) {
        // Group channel
        const members = channel.threadProperties.topic
          .split(', ')
          .filter(name => (name !== '...' || name !== this.login))

        return new ChannelObject({
          id: channel.id,
          teamId: this.id,
          name: `${members.join(', ').substr(0, 14)}`,
          type: 'group',
          topic: members.join(', '),
          memberIds: [this.userId, ...members.map(name => `8:${name}`)],
          isMember: true,
          lastRead: channel.version,
          status: 'online',
        })
      }

      // Direct message
      return new ChannelObject({
        id: channel.id,
        teamId: this.id,
        name: channel.id.replace(/^(8:)/, ''),
        type: 'dm',
        memberIds: [channel.id, this.userId],
        isMember: true,
        lastRead: channel.version,
      })
    })

    store.dispatch(addChannels({ channels, teamId: this.id }))
    store.dispatch(setActiveChannel(channels.filter(ch => ch.isMember)[0]))
  }

  /* eslint consistent-return: 0 */
  prepareMessage(rawMsg, channel) {
    if (rawMsg.type.toLowerCase() !== 'message') {
      return
    }

    return new MessageObject({
      id: rawMsg.id,
      senderId: rawMsg.from.split('/').pop(),
      channelId: channel.id,
      teamId: channel.teamId,
      type: 'text',
      text: rawMsg.content,
      createdAt: rawMsg.originalarrivaltime,
      state: 'received',
    })
  }


  history(channel, options = {}) {
    this.web.fetchHistory(channel.id, (response) => {
      const messages = response.reduce((memo, rawMsg) => {
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

    return new Promise((resolve, reject) => {
      resolve({})
    })
  }

  send(message) {
    store.dispatch(sendMessage(message))
    this.web.sendMessage(message.channelId, message, (err, data) => {
      if (!data) { return }

      const newMessage = new MessageObject({
        ...message.serialize(),
        createdAt: data.OriginalArrivalTime,
        state: 'sent',
      })

      store.dispatch(replaceMessage(message, newMessage))
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

  serialize() {
    const { id, name, login, password, userId, icon, accessToken } = this
    const type = 'Skype'

    return {
      id,
      type,
      login,
      password,
      name,
      userId,
      icon,
      accessToken,
    }
  }
}

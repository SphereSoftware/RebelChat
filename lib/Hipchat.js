'use babel'

/* eslint no-unused-vars: 0 */

import { Client, Element } from 'node-xmpp'
import Hipchatter from 'hipchatter'

import { TeamObject, UserObject, ChannelObject, MessageObject } from './objects'
import { setStatus } from './redux/modules/status'
import { updateTeam, addNewTeam } from './redux/modules/teams'
import { addNewUser, addUsers } from './redux/modules/users'
import { addChannels } from './redux/modules/channels'
import { setActiveChannel } from './redux/modules/activeChannels'
import { sendMessage, receiveMessage, replaceMessage, addMessages } from './redux/modules/messages'

import store from './redux/store'

export default class Hipchat {
  constructor(options) {
    // jid: for instance 372299_3093452@chat.hipchat.com
    const [teamId, userId] = options.jid.split('@')[0].split('_')

    this.jid = options.jid
    this.id = parseInt(options.id || teamId, 10)
    this.password = options.password
    this.userId = parseInt(options.userId || userId, 10)
    this.accessToken = options.accessToken

    this.client = new Client({
      jid: `${options.jid}`,
      password: this.password,
      reconnect: true,
      autostart: false,
    })

    this.web = new Hipchatter(this.accessToken)
    this.bind()
  }

  get avaliableStanzaElement() {
    return new Element('presence', { type: 'available' }).c('show').t('chat')
  }

  get startupStanzaElement() {
    return new Element('iq', { type: 'get', id: 'startup' })
                    .c('query', {
                      xmlns: 'http://hipchat.com/protocol/startup',
                      send_auto_join_user_presences: true,
                    })
  }

  loadData() {
    const { web } = this
    // Create a team object
    const teamObject = new TeamObject({
      ...this.serialize(),
    })
    store.dispatch(addNewTeam(teamObject))
    store.dispatch(setStatus('ready'))

    // fetch all users
    web.users((err, users) => {
      if (err) {
        console.error("can't load users - hipchat", err)
        return
      }

      this.fullFillUsers(users)
    })

    // fetch all rooms
    web.rooms((err, channels) => {
      if (err) {
        console.error("can't load rooms - hipchat", err)
        return
      }

      this.fullFillChannels(channels)
    })
  }

  bind() {
    const { client } = this

    // Handle online event
    client.on('online', () => {
      // set ourselves as online
      console.log("We're online!")
      client.send(this.avaliableStanzaElement)
      client.send(this.startupStanzaElement)

      // send keepalive data or server will disconnect us after 150s of inactivity
      setInterval(() => {
        client.send(' ')
        console.log("We're STILLL online!")
      }, 30000)
    })

    // Handle error event
    client.on('error', (err) => {
      console.error(err)
    })

    client.on('stanza', (stanza) => {
      if (stanza.attrs.type === 'error') {
        console.error('Stanza Error: ', stanza)
        return
      }

      // handle startap info
      if (stanza.is('iq') && stanza.id === 'startup') {
        this.fullFillCurrentUser(stanza)
      }

      // handle chat message
      if (stanza.is('message')) {
        this.handleRecivedMessage(stanza)
      }
    })
    return this
  }

  getChannelIdByJid(jid) {
    return this.allChannelIdsByJid[jid]
  }

  handleRecivedMessage(stanza) {
    if (stanza.attrs.type === 'groupchat') {
      const body = stanza.getChild('body')
      if (!body) {
        return;
      }

      let id
      if (stanza.attrs.mid) {
        id = stanza.attrs.mid
      }

      let senderId
      if (stanza.attrs.from_jid) {
        senderId = stanza.attrs.from_jid.split('@')[0].split('_')[1]
      }

      const [jid, nik] = stanza.attrs.from.split('/')
      const channelId = this.getChannelIdByJid(jid)
      const text = body.getText()

      if (id && channelId && senderId) {
        const message = new MessageObject({
          id,
          senderId,
          channelId,
          teamId: this.id,
          text,
          createdAt: new Date(stanza.attrs.ts * 1000),
          state: 'recived',
        })

        store.dispatch(receiveMessage(message))
      }
    }
  }

  fullFillCurrentUser(stanza) {
    const email = stanza.children[0].getChildren('email')[0].children[0]
    const username = stanza.children[0].getChildren('mention_name')[0].children[0]
    const displayName = stanza.children[0].getChildren('name')[0].children[0]
    const avatar = stanza.children[0].getChildren('photo_small')[0].children[0]
    this.icon = avatar
    this.name = username
    this.xmppRoomNickName = displayName

    // First of all you have to add Yerself
    store.dispatch(addNewUser(new UserObject({
      id: this.userId,
      teamId: this.id,
      email,
      username,
      displayName,
      avatar,
      status: 'online',
    })))
    this.loadData()
    this.didConnect()
  }

  connect() {
    this.client.connect()
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
    // process file here
  }

  sendTextMessage(message) {
    const { web } = this
    store.dispatch(sendMessage(message))
    web.send_room_message(message.channelId, message.text, (err, msg) => {
      if (!msg) { return }
      const newMessage = new MessageObject({
        ...message.serialize(),
        id: msg.id,
        state: 'sent',
      })
      store.dispatch(replaceMessage(message, newMessage))
    })
  }

  prepareMessage(rawMsg, channel) {
    if (rawMsg.type !== 'message') {
      return null
    }

    return new MessageObject({
      id: rawMsg.id,
      senderId: rawMsg.from.id,
      channelId: channel.id,
      teamId: channel.teamId,
      type: 'text',
      text: rawMsg.message,
      createdAt: new Date(rawMsg.date),
      state: 'recived',
    })
  }

  requestXmppRoomNickName() {
    return store.getState().users[this.teamId][this.userId].displayName
  }

  sendXmppJoinRequest(channel) {
    if (!this.xmppRoomNickName) {
      this.xmppRoomNickName = this.requestXmppRoomNickName()
    }

    const element = new Element('presence', { to: `${channel.jid}/${this.xmppRoomNickName}` })
                          .c('x', { xmlns: 'http://jabber.org/protocol/muc' })

    this.client.send(element)
  }

  history(channel) {
    const { web } = this

    this.sendXmppJoinRequest(channel)

    return new Promise((resolve, reject) => {
      if (channel.type === 'group') {
        web.history(channel.id, (err, data) => {
          if (err) {
            reject(err)
            return
          }

          const messages = data.items.filter(m => m.type === 'message').reduce((memo, rawMsg) => {
            const message = this.prepareMessage(rawMsg, channel)
            if (message) {
              memo.push(message)
            }

            return memo
          }, [])

          if (messages.length > 0) {
            store.dispatch(addMessages(messages))
          }

          resolve({ messages })
        })
      }
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
    return new Promise((resolve, reject) => {
      resolve({})
    })
  }

  fullFillUsers(rawUsers) {
    const users = rawUsers.map((user) => {
      return new UserObject({
        id: user.id,
        username: user.mention_name,
        displayName: user.name,
        teamId: this.id,
        status: (user.presence ? 'online' : 'offline'),
      })
    })

    store.dispatch(addUsers({ users, teamId: this.id }))
  }

  fullFillChannels(rawChannels) {
    const channelPromises = rawChannels.map((channel) => {
      return new Promise((resolve, reject) => {
        this.web.get_room(channel.id, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(new ChannelObject({
              id: data.id,
              jid: data.xmpp_jid,
              topic: data.topic,
              teamId: this.id,
              name: data.name,
              type: 'group',
              memberIds: [data.owner.id, ...data.participants.map(p => p.id)],
              isMember: true,
              unreadCount: 0,
              status: 'online',
            }))
          }
        })
      })
    })

    Promise.all(channelPromises).then((channels) => {
      // remember jid - to - id
      this.allChannelIdsByJid = channels.reduce((memo, ch) => {
        memo[ch.jid] = ch.id
        return memo
      }, {})

      store.dispatch(addChannels({ channels, teamId: this.id }))
      const activeChannel = channels.filter(ch => ch.isMember)[0]
      if (activeChannel) {
        store.dispatch(setActiveChannel(activeChannel))
        this.didConnect()
      }
    }).catch((reason) => {
      console.error(reason)
    })
  }

  fullFillDirectMessages(dms) {
    //
  }

  didConnect() {
    const teamObject = new TeamObject({
      ...this.serialize(),
      status: 'online',
    })
    store.dispatch(updateTeam(teamObject))
  }

  serialize() {
    const { id, name, userId, icon, accessToken, jid, password } = this
    const type = 'Hipchat'

    return {
      id,
      type,
      name,
      userId,
      icon,
      accessToken,
      jid,
      password,
    }
  }
}

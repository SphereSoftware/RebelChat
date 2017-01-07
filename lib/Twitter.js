'use babel'

import path from 'path'
import fs from 'fs-plus'
import Twit from 'twit'

import { TeamObject, UserObject, ChannelObject, MessageObject } from './objects'

import { setStatus } from './redux/modules/status'
import { updateTeam, addNewTeam } from './redux/modules/teams'
import { addUsers, addNewUser } from './redux/modules/users'
import { addNewChannel, removeChannel, updateChannel, addChannels } from './redux/modules/channels'
import { setActiveChannel } from './redux/modules/activeChannels'
import { sendMessage, receiveMessage, replaceMessage, addMessages } from './redux/modules/messages'

import store from './redux/store'

export default class Twitter {
  constructor(options) {
    this.id = options.id
    this.userId = options.id
    this.name = options.name
    this.accessToken = options.accessToken
    this.accessTokenSecret = options.accessTokenSecret
    this.consumerKey = options.consumerKey
    this.consumerSecret = options.consumerSecret

    this.client = new Twit({
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
      access_token: this.accessToken,
      access_token_secret: this.accessTokenSecret,
    })

    this.bind()
  }

  bind() {

  }

  connect() {
    // Create a team object
    const teamObject = new TeamObject({
      ...this.serialize(),
    })
    store.dispatch(addNewTeam(teamObject))
    store.dispatch(setStatus('ready'))

    this.fullFillUsers()
    this.fullFillChannels()
  }

  fullFillChannels() {
    this.client.get('users/show', { user_id: this.userId }, (error, user) => {
      if (error) {
        console.log(error)
        return
      }

      // asign team icon
      this.icon = user.profile_image_url

      // First of all you have to add Yerself
      store.dispatch(addNewUser(new UserObject({
        id: user.id,
        teamId: this.id,
        username: user.screen_name,
        displayName: user.name,
        avatar: user.profile_image_url,
        status: 'online',
      })))

      const channels = [
        new ChannelObject({
          id: 'timeline',
          teamId: this.id,
          name: 'Timeline',
          type: 'group',
          topic: 'My TimeLine',
          memberIds: [this.userId],
          isMember: true,
          status: 'online',
        }),
        new ChannelObject({
          id: 'twits',
          teamId: this.id,
          name: 'my twits',
          type: 'group',
          topic: 'My Twits',
          memberIds: [this.userId],
          isMember: true,
          status: 'online',
        }),
      ]

      store.dispatch(addChannels({ channels, teamId: this.id }))
      store.dispatch(setActiveChannel(channels.filter(ch => ch.isMember)[0]))
      this.didConnect()
    })
  }

  fullFillUsers() {
    const { client } = this
    const options = { screen_name: 'twitter', count: '200' }

    client.get('friends/list', options, (error, data, response) => {
      if (error) {
        console.log(error)
        return
      }

      const users = data.users.map((user) => {
        return new UserObject({
          id: user.id,
          teamId: this.id,
          username: user.screen_name,
          displayName: user.name,
          avatar: user.profile_image_url,
          status: (user.following ? 'online' : 'offline'),
        })
      })

      store.dispatch(addUsers({ users, teamId: this.id }))
    })
  }

  didConnect() {
    const teamObject = new TeamObject({
      ...this.serialize(),
      status: 'online',
    })
    store.dispatch(updateTeam(teamObject))
  }

  history(channel) {
    return new Promise((resolve, reject) => {
      this.client.get('statuses/home_timeline', { count: 200 }, (error, rawMessages) => {
        if (error) {
          console.log(error)
          reject(error)
          return
        }

        const ListOfUsers = {}

        const messages = rawMessages.map((msg) => {
          const { user } = msg

          ListOfUsers[user.id] = new UserObject({
            id: user.id,
            teamId: this.id,
            username: user.screen_name,
            displayName: user.name,
            avatar: user.profile_image_url,
            status: (user.following ? 'online' : 'offline'),
          })

          return new MessageObject({
            id: msg.id,
            senderId: msg.user.id,
            channelId: channel.id,
            teamId: this.id,
            text: msg.text,
            createdAt: (new Date(msg.created_at)).getTime(),
            state: 'received',
          })
        })

        if (messages.length > 0) {
          const users = Object.keys(ListOfUsers).map(k => ListOfUsers[k])
          store.dispatch(addUsers({ users, teamId: this.id }))
          store.dispatch(addMessages(messages))
        }

        resolve(messages)
      })
    })
  }

  send(message) {
    // store.dispatch(sendMessage(message))
    // this.web.sendMessage(message.channelId, message, (err, data) => {
    //   if (!data) { return }
    //
    //   const newMessage = new MessageObject({
    //     ...message.serialize(),
    //     createdAt: data.OriginalArrivalTime,
    //     state: 'sent',
    //   })
    //
    //   store.dispatch(replaceMessage(message, newMessage))
    // })
  }

  mark(channel) {
    return new Promise((resolve, reject) => {
      resolve({})
    })
  }

  join(channel, optCb) {
    // return new Promise((resolve, reject) => {
    //   resolve({})
    // })
  }

  leave(channel, optCb) {
    // if (channel.type === 'group') {
    //   this.web.channels.leave(channel.id, optCb)
    // } else {
    //   console.log('leaving channel - ', channel)
    // }
  }

  serialize() {
    const { id, name, userId, icon, accessToken, accessTokenSecret, consumerKey, consumerSecret } = this
    const type = 'Twitter'

    return {
      id,
      type,
      name,
      userId,
      icon,
      accessToken,
      accessTokenSecret,
      consumerKey,
      consumerSecret,
    }
  }
}

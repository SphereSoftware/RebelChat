'use babel'

import { select, take } from 'redux-saga/effects'

function notfifyIfNeeded({ currentUser, sender, message }) {
  message.text.split(/(<.*?>)/g).forEach((word) => {
    if (word.indexOf('<!') === 0) {
      const [id, name] = word.split(/<(.*)>/)[1].replace(/^!/, '').split('|')
      atom.notifications.addInfo(
        `User @${sender.username}: send #${name || id} message`,
        {
          description: message.text,
        }
      )
    }

    if (word.indexOf('<@') === 0) {
      const id = word.split(/<(.*)>/)[1].replace(/^@/, '').split('|')[0]
      if (id === currentUser.id) {
        atom.notifications.addInfo(
          `User @${sender.username}: mention you.`,
          {
            description: message.text,
          }
        )
      }
    }
  })
}

export default function* notifyOnMessage() {
  while (true) {
    const action = yield take('receiveMessage')

    const message = action.payload
    const currentUser = yield select(state => state.users[state.currentTeam.id][state.currentTeam.userId])
    const sender = yield select(state => state.users[state.currentTeam.id][message.senderId])
    const channel = yield select(state => state.channels[state.currentTeam.id][message.channelId])
    const currentOpenChannel = yield select(state => state.activeChannels[state.currentTeam.id])

    if (message.senderId === currentUser.id) {
      return
    }

    notfifyIfNeeded({ currentUser, sender, message, channel, currentOpenChannel })
  }
}

'use babel';

import { SelectListView } from 'atom-space-pen-views'
import _ from 'underscore-plus'
import { ChannelObject } from '../lib/objects'
import { setActiveChannel } from './redux/modules/activeChannels'
import store from './redux/store'

export default class ImChannelSelectView extends SelectListView {
  constructor(im) {
    const { teamLoader, serializedState: { imViewState } } = im
    super(imViewState)
    this.store = store
    this.im = im
    this.teamLoader = teamLoader

    this.modal = atom.workspace.addModalPanel({
      item: this,
      className: 'im-modal-channel',
      visible: false,
    })

    this.modal.onDidChangeVisible((visible) => {
      if (visible) {
        this.setItems(this.getChannels())
        this.focusFilterEditor()
      }
    })
  }

  isChannelOnline(channel, users) {
    return _.every(
      channel.memberIds.map(id => users[id]),
      (u) => { return !!u && u.status === 'online' }
    )
  }

  getChannels() {
    const { currentTeam, channels, activeChannels, users } = this.store.getState()
    return _.sortBy(
      // get channels
      _.values(channels[currentTeam.id] || {})
      .filter(ch => ch.id !== (activeChannels[currentTeam.id] || {}).id)
      .map((ch) => {
        return {
          ...ch,
          teamId: currentTeam.id,
          isChannelOnline: (ch.type === 'group' ? false : this.isChannelOnline(ch, users[currentTeam.id])),
          displayName: `${(ch.type === 'group') ? '#' : '@'}${ch.name}`,
        }
      }),
      // sort it here
      ch => -ch.unreadCount
    )
  }

  toggle() {
    // skip if not visiable
    if (!this.im.isVisible()) { return; }

    if (this.modal.isVisible()) {
      this.modal.hide()
    } else {
      this.modal.show()
    }
  }

  getModal() {
    return this.modal
  }

  svgOnline({ size = 10, color = '#fefefe' } = {}) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="M1664 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>`
  }

  svgOffline({ size = 10, color = '#fefefe' } = {}) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="M896 352q-148 0-273 73t-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273-73-273-198-198-273-73zm768 544q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>`
  }

  getSvgIcon(item) {
    return item.isChannelOnline ? this.svgOnline() : this.svgOffline()
  }

  viewForItem(item) {
    return `
    <li>
      <span class="channel-type">
      ${(item.type === 'group') ? '<span>#</span>' : this.getSvgIcon(item)}
      </span>
      <span class="channel-name">${item.name}</span>
    </li>
    `
  }

  getFilterKey() {
    return 'displayName'
  }

  confirmed(ch) {
    const channel = new ChannelObject({
      ...ch,
    })
    this.store.dispatch(setActiveChannel(channel))
    this.modal.hide()
  }

  cancelled() {
    this.modal.hide()
  }

  hide() {
    this.modal.hide()
  }

  // Tear down any state and detach
  destroy() {
    this.remove()
  }

  getElement() {
    return this
  }
}

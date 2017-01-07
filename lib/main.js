'use babel'

import { CompositeDisposable } from 'atom'
import ImView from './ImView'
import ImChannelSelectView from './ImChannelSelectView'
import StatusBarView from './StatusBarView'
import { setCurrentTeam } from './redux/modules/currentTeam'

import store from './redux/store'
import TeamLoader from './TeamLoader'

import ImAutocompleteProvider from './ImAutocompleteProvider'
import emojisProvider from './EmojisProvider';

export default {
  imView: null,
  imChannelSelectView: null,
  topPanel: null,
  subscriptions: null,

  activate(serializedState) {
    this.serializedState = serializedState
    this.store = store
    this.teamLoader = new TeamLoader(this)
    this.imChannelSelectView = new ImChannelSelectView(this)
    this.imView = new ImView(this)
    this.statusBarView = new StatusBarView(this)
    this.autocompleteEmojisProvider = emojisProvider
    emojisProvider.loadProperties();

    // setup autocomplete propvider
    this.autocompleteProvider = new ImAutocompleteProvider(this)

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'rebel-chat:toggle': () => this.toggle(),
      'rebel-chat:choose-channel': () => this.chooseChannel(),
      'rebel-chat:focus-input': () => this.focusInput(),
      'rebel-chat:team-1': () => this.changeTeam(1),
      'rebel-chat:team-2': () => this.changeTeam(2),
      'rebel-chat:team-3': () => this.changeTeam(3),
      'rebel-chat:team-4': () => this.changeTeam(4),
      'rebel-chat:team-5': () => this.changeTeam(5),
      'rebel-chat:team-6': () => this.changeTeam(6),
      'rebel-chat:team-7': () => this.changeTeam(7),
      'rebel-chat:team-8': () => this.changeTeam(8),
      'rebel-chat:team-9': () => this.changeTeam(9),
    }))

    this.imView.init()
    this.statusBarView.init()
  },

  consumeStatusBar(statusBar) {
    this.statusBarTile = statusBar.addRightTile({
      item: this.statusBarView.getElement(),
      priority: -1000,
    })
  },

  getProviders() {
    return [this.autocompleteProvider, this.autocompleteEmojisProvider]
  },

  deactivate() {
    if (this.topPanel) {
      this.topPanel.destroy()
    }

    this.subscriptions.dispose()
    this.imView.destroy()
  },

  serialize() {
    return {
      imViewState: this.imView.serialize(),
      ImChannelSelectViewState: this.imChannelSelectView.serialize(),
    }
  },

  changeTeam(index = 1) {
    if (this.isVisible()) {
      const { currentTeam, teams } = store.getState()
      const nextTeam = teams[index - 1]

      // skip if no such team
      if (nextTeam) {
        if (nextTeam.id !== currentTeam.id) {
          store.dispatch(setCurrentTeam(nextTeam))
          setTimeout(() => {
            this.imView.focusMasterInput()
          }, 0)
        }
      }
    }
  },

  focusInput() {
    if (this.isVisible()) {
      this.imView.focusMasterInput()
    }
  },

  isVisible() {
    return this.imView.isVisible()
  },

  chooseChannel() {
    this.imChannelSelectView.toggle()
  },

  toggle() {
    this.imView.toggle()
  },
}

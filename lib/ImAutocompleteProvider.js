'use babel'

import _ from 'underscore-plus'

export default class ImAutocompleteProvider {
  scopeSelector = '.source.gfm, .text.md, .text.plain, .comment, .string, .source.emojicode'
  enableCustomTextEditorSelector = true

  constructor({ store }) {
    this.store = store
  }

  getTextEditorSelector() {
    return 'atom-text-editor.im-editor'
  }

  teamUsers() {
    const { users, currentTeam } = this.store.getState()
    const teamUsers = users[currentTeam.id]
    return Object.keys(teamUsers).map(userId => teamUsers[userId])
  }

  getUsersSuggestions(name) {
    return new Promise((resolve) => {
      resolve(
        this.teamUsers()
        .filter(user => user.username.includes(name))
        .map((user) => {
          return {
            leftLabelHTML: `<img src="${user.avatar}" width="20" height="20" style="border-radius: 3px;">`,
            text: `@${user.username}`,
            replacementPrefix: `@${user.username}`,
            rightLabel: user.displayName,
          }
        })
      )
    })
  }

  getSuggestions({ editor, bufferPosition, scopeDescriptor, prefix, activatedManually }) {
    if (_.contains(scopeDescriptor.scopes, 'reference.variable.md')) {
      return this.getUsersSuggestions(prefix)
    }
  }

  onDidInsertSuggestion({ editor, triggerPosition, suggestion }) {

  }

  dispose() {

  }
}

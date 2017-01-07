'use babel';

import React from 'react'

import { Emoji } from '.'
import { getData } from '../utils'

export default class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = { emoji: null }
  }

  render() {
    const { emoji } = this.state
    const { emojiProps, title, emoji: idleEmoji } = this.props

    if (emoji) {
      const emojiData = getData(emoji)
      const { emoticons } = emojiData
      const knownEmoticons = []
      const listedEmoticons = []

      for (const emoticon of emoticons) {
        if (knownEmoticons.indexOf(emoticon.toLowerCase()) === -1) {
          knownEmoticons.push(emoticon.toLowerCase())
          listedEmoticons.push(emoticon)
        }
      }

      return (
        <div className="emoji-mart-preview">
          <div className="emoji-mart-preview-emoji">
            <Emoji
              key={emoji.id}
              emoji={emoji}
              {...emojiProps}
            />
          </div>

          <div className="emoji-mart-preview-data">
            <div className="emoji-mart-preview-name">{emoji.name}</div>
            <div className="emoji-mart-preview-shortnames">
              {emojiData.short_names.map(shortName =>
                <span key={shortName} className="emoji-mart-preview-shortname">:{shortName}:</span>
              )}
            </div>
            <div className="emoji-mart-preview-emoticons">
              {listedEmoticons.map(emoticon =>
                <span key={emoticon} className="emoji-mart-preview-emoticon">{emoticon}</span>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="emoji-mart-preview">
        <div className="emoji-mart-preview-emoji">
          <Emoji emoji={idleEmoji} {...emojiProps} />
        </div>

        <div className="emoji-mart-preview-data">
          <span className="emoji-mart-title-label">
            {title}
          </span>
        </div>
      </div>
    )
  }
}

Preview.propTypes = {
  title: React.PropTypes.string.isRequired,
  emoji: React.PropTypes.string.isRequired,
  emojiProps: React.PropTypes.object.isRequired,
}

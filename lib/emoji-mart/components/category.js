'use babel';

import React from 'react'

import frequently from '../utils/frequently'
import { Emoji } from '.'

export default class Category extends React.Component {
  componentDidMount() {
    this.parent = this.container.parentNode
    this.margin = 0
    this.minMargin = 0
    this.memoizeSize()
  }
  
  shouldComponentUpdate(nextProps) {
    const { name, perLine, hasStickyPosition, emojis, emojiProps } = this.props
    const { size } = emojiProps
    const {
      perLine: nextPerLine,
      hasStickyPosition: nextHasStickyPosition,
      emojis: nextEmojis,
      emojiProps: nextEmojiProps,
    } = nextProps
    const { size: nextSize } = nextEmojiProps
    let shouldUpdate = false

    if (name === 'Recent' && perLine !== nextPerLine) {
      shouldUpdate = true
    }

    if (name === 'Search') {
      shouldUpdate = !(emojis === nextEmojis)
    }

    if (size !== nextSize || hasStickyPosition !== nextHasStickyPosition) {
      shouldUpdate = true
    }

    return shouldUpdate
  }

  memoizeSize() {
    if (!this.container) {
      return
    }

    const { top, height } = this.container.getBoundingClientRect()
    const { top: parentTop } = this.parent.getBoundingClientRect()
    const { height: labelHeight } = this.label.getBoundingClientRect()

    this.top = (top - parentTop + this.parent.scrollTop)

    if (height === 0) {
      this.maxMargin = 0
    } else {
      this.maxMargin = height - labelHeight
    }
  }

  handleScroll(scrollTop) {
    let margin = scrollTop - this.top
    margin = margin < this.minMargin ? this.minMargin : margin
    margin = margin > this.maxMargin ? this.maxMargin : margin

    if (margin === this.margin) {
      return false
    }

    if (!this.props.hasStickyPosition) {
      this.label.style.top = `${margin}px`
    }

    this.margin = margin
    return true
  }

  getEmojis() {
    const { name, perLine } = this.props
    let emojis = this.props.emojis

    if (name === 'Recent') {
      const frequentlyUsed = frequently.get(perLine * 4)

      if (frequentlyUsed.length) {
        emojis = frequentlyUsed
      }
    }

    if (emojis) {
      emojis = emojis.slice(0)
    }

    return emojis
  }

  updateDisplay(display) {
    const emojis = this.getEmojis()

    if (!display && !emojis) {
      return
    }

    this.container.style.display = display
  }

  render() {
    const { name, hasStickyPosition, emojiProps, i18n } = this.props
    const emojis = this.getEmojis()
    const labelStyles = {}
    const labelSpanStyles = {}
    const containerStyles = {}

    if (!emojis) {
      containerStyles.display = 'none'
    }

    if (!hasStickyPosition) {
      labelStyles.height = 28
      labelSpanStyles.position = 'absolute'
    }

    return (
      <div
        ref={(c) => { this.container = c }}
        className="emoji-mart-category"
        style={containerStyles}
      >
        <div
          style={labelStyles}
          data-name={name}
          className="emoji-mart-category-label"
        >
          <span style={labelSpanStyles} ref={(c) => { this.label = c }}>
            {i18n.categories[name.toLowerCase()]}
          </span>
        </div>

        {emojis && emojis.map(emoji =>
          <Emoji
            key={emoji.id || emoji}
            emoji={emoji}
            {...emojiProps}
          />
        )}

        {emojis && !emojis.length &&
          <div className="emoji-mart-no-results">
            <Emoji
              {...emojiProps}
              size={22}
              emoji="sleuth_or_spy"
            />

            <span className="emoji-mart-no-results-label">
              No emoji found
            </span>
          </div>
        }
      </div>
    )
  }
}

Category.propTypes = {
  emojis: React.PropTypes.array,
  hasStickyPosition: React.PropTypes.bool,
  name: React.PropTypes.string.isRequired,
  perLine: React.PropTypes.number.isRequired,
  emojiProps: React.PropTypes.object.isRequired,
}

Category.defaultProps = {
  emojis: [],
  hasStickyPosition: false,
}

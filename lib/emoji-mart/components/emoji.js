'use babel';

import React from 'react'

import { emojiSvgByUnified } from '../assets'
import { getData, getSanitizedData } from '../utils'

export default class Emoji extends React.Component {
  static
  propTypes = {
    size: React.PropTypes.number,
    onOver: React.PropTypes.func,
    onLeave: React.PropTypes.func,
    onClick: React.PropTypes.func,
    emoji: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]).isRequired,
  }

  static
  defaultProps = {
    onOver: (() => {}),
    onLeave: (() => {}),
    onClick: (() => {}),
  }

  constructor(props) {
    super(props)

    const normalizeUnified = (unified) => {
      return unified && unified
      .replace(/200[dD]-/g, '')
      .replace(/[fF][eE]0[fF]-/g, '')
      .toLowerCase()
    }

    this.unified = normalizeUnified(this.getData().unified)
  }

  shouldComponentUpdate() {
    return false
  }

  getData() {
    const { emoji } = this.props
    return getData(emoji, 'emojione')
  }

  getSanitizedData() {
    const { emoji } = this.props
    return getSanitizedData(emoji, 'emojione')
  }

  handleClick(e) {
    this.props.onClick(this.getSanitizedData(), e)
  }

  handleOver(e) {
    this.props.onOver(this.getSanitizedData(), e)
  }

  handleLeave(e) {
    this.props.onLeave(this.getSanitizedData(), e)
  }

  render() {
    if (!this.unified || !emojiSvgByUnified[this.unified]) {
      return <span>{this.props.emoji}</span>
    }

    const props = {
      size: this.props.size,
    }

    const emoji = React.createElement(emojiSvgByUnified[this.unified], props, null)

    return (
      <span
        onClick={e => this.handleClick(e)}
        onMouseEnter={e => this.handleOver(e)}
        onMouseLeave={e => this.handleLeave(e)}
        className="emoji-mart-emoji"
      >
        {emoji}
      </span>
    )
  }
}

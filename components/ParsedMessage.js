'use babel'

import React, { Component, PropTypes } from 'react'
import ReactHtmlParser from 'react-html-parser';

import SlackUserTag from './SlackUserTag'
import { Emoji } from '../lib/emoji-mart'

const SlackChannelTag = (props) => {
  const id = props.id.replace(/^#/, '')
  const name = props.name || id
  const options = {
    href: props.id,
    className: 'mention',
  }

  return React.createElement('a', options, `#${name}`)
}

SlackChannelTag.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
}

const SlackAlertTag = (props) => {
  const id = props.id.replace(/^!/, '')
  const name = props.name || id
  const options = {
    href: props.id,
    className: 'mention',
  }

  return React.createElement('a', options, `${name}`)
}

SlackAlertTag.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
}

const SlackLinkTag = (props) => {
  const id = props.id
  const name = props.name || id
  const options = {
    target: '_blank',
    href: props.id,
  }

  return React.createElement('a', options, name)
}

SlackLinkTag.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
}

const SkypeSmile = (props) => {
  const { type, emoticon } = props
  return React.createElement('a', null, `${type} - ${emoticon}`)
}

SkypeSmile.propTypes = {
  type: PropTypes.string,
  emoticon: PropTypes.string,
}

export default class ParsedMessage extends Component {
  static
  propTypes = {
    text: PropTypes.string.isRequired,
    safe: PropTypes.boolean,
  }

  parseLine(text) {
    const { safe } = this.props
    // split by tags and spaces
    return text.split(/(<.*?>.*?<\/.*?>|\s)/).map((word) => {
      // Skip processing spaces
      if (/^\s+$/.test(word)) {
        return word
      }

      // replace SkypeSmile message <ss type="smile">:)</ss>
      if (word.indexOf('<ss') === 0) {
        const [type, emoticon] = word.split(/<.*type="(.*)">(.*)<\/ss>/).slice(1, 3)
        return <SkypeSmile type={type} emoticon={emoticon} />
      }

      // Replace with channel tag
      if (word.indexOf('<!') === 0) {
        const [id, name] = word.split(/<(.*)>/)[1].split('|')
        return <SlackAlertTag id={id} name={name} />
      }

      // Replace with channel tag
      if (word.indexOf('<#') === 0) {
        const [id, name] = word.split(/<(.*)>/)[1].split('|')
        return <SlackChannelTag id={id} name={name} />
      }

      // Replace with user tag
      if (word.indexOf('<@') === 0) {
        const [id, name] = word.split(/<(.*)>/)[1].split('|')
        return <SlackUserTag id={id} name={name} />
      }

      // Replace with link tag
      if (word.indexOf('<http') === 0) {
        const [id, name] = word.split(/<(.*)>/)[1].split('|')
        return <SlackLinkTag id={id} name={name} />
      }

      // Replace with emoji tag, the Emoji component will render the
      // word if no such emoji found
      if (word.slice(0, 1) === ':' && word.slice(-1) === ':') {
        return <Emoji emoji={word} size="16" />
      }

      // return by default
      if (safe) {
        return ReactHtmlParser(word)
      }

      return word
    })
  }

  render() {
    const { text } = this.props
    const lines = text.split('\n').map((line, index) => {
      return (
        <span key={index}>
          {/* <span style={{ border: '1px solid red' }}>{line}</span> */}
          {::this.parseLine(line)}<br />
        </span>
      )
    })

    return <span>{lines}</span>
  }
}

'use babel';

import React from 'react'
import emojiIndex from '../utils/emoji-index'

export default class Search extends React.Component {
  static
  propTypes = {
    onSearch: React.PropTypes.func,
  }

  static
  defaultProps = {
    onSearch: (() => {}),
  }

  handleChange() {
    this.props.onSearch(emojiIndex.search(this.input.value))
  }

  clear() {
    this.input.value = ''
  }

  render() {
    var { i18n } = this.props

    return (
      <input
        ref={(c) => { this.input = c }}
        type="text"
        onChange={() => this.handleChange()}
        placeholder={i18n.search}
        className="emoji-mart-search native-key-bindings"
      />
    )
  }
}

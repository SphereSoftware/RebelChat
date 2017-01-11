'use babel'

import React, { Component } from 'react'

export default class ChevronLeftIcon extends Component {
  render() {
    const { size } = this.props

    return (
      <svg
        viewBox="0 0 1792 1792"
        fill="currentColor"
        preserveAspectRatio="xMidYMid meet"
        height={size || 30}
        width={size || 30}
      >
        <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"/>
      </svg>
    );
  }
}

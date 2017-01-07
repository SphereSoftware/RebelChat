'use babel'

import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

// Loader with animations
const Wrap = styled.span`
  color: ${props => (props.counter === 0 ? '' : '#61AFEF')};
  margin-left: 10px;
  cursor: pointer;
`

const StatusBarElement = (props) => {
  return (
    <Wrap {...props}>
      <i className="icon icon-comment-discussion"> {props.counter} </i>
    </Wrap>
  )
}

function mapStateToProps(state) {
  const { channels, teams } = state

  const counter = teams.reduce((acc, team) => {
    return acc + (Object.keys(channels[team.id] || {})).reduce((memo, key) => {
      return memo + channels[team.id][key].unreadCount
    }, 0)
  }, 0)

  return {
    counter,
  }
}

StatusBarElement.propTypes = {
  counter: React.PropTypes.number,
}

export default connect(mapStateToProps)(StatusBarElement)

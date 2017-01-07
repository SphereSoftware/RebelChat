'use babel'

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { UserObject } from '../lib/objects'

const SlackUserTag = (props) => {
  const id = props.id.replace(/^@/, '')
  const user = (props.users[id] || {})
  const options = {
    href: props.id,
    className: 'mention',
  }

  return React.createElement('a', options, `@${user.username || id}`)
}

SlackUserTag.propTypes = {
  id: PropTypes.number,
  users: PropTypes.arrayOf(UserObject),
}

function mapStateToProps(state) {
  return {
    users: state.users[state.currentTeam.id],
  }
}

export default connect(mapStateToProps)(SlackUserTag)

'use babel'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore-plus'
import Channel from './Channel'
import { UserObject, ChannelObject } from '../lib/objects'

import * as colors from './colors'
import styled from 'styled-components'
const UsersListElement = styled.div`
  .counter {
    color: #6F6D6D;
    font-weight: lighter;
  }

  color: ${colors.textSubtle};

  .active {
    background-color: ${colors.bgHighlight};
  }

  .unread {
    color: ${colors.textSelected};
    font-weight: bold;
  }

  h3 {
    margin: 20px 16px 5px 16px;
    text-transform: uppercase;
    font-size: 14px;
    color: ${colors.textSubtle};
    small {
      font-size: 12px;
    }
  }
`


class UsersList extends Component {
  static
  propTypes = {
    channels: PropTypes.arrayOf(ChannelObject),
    users: PropTypes.arrayOf(UserObject),
  }

  render() {
    const { channels, users } = this.props

    return (
      <UsersListElement>
        <h3>
          <i className="icon icon-comment-discussion" /> Direct Messages
          <span className="counter"> ({Object.keys(users).length})</span>
        </h3>
        <div>
          {channels.map(ch => <Channel {...ch} channel={ch} />)}
        </div>
      </UsersListElement>
    )
  }
}

function mapStateToProps(state) {
  const channels = _.values(state.channels[state.currentTeam.id] || {})
  return {
    users: state.users[state.currentTeam.id],
    channels: channels.filter(ch => ch.type === 'dm').slice(0, 20),
  }
}

export default connect(mapStateToProps)(UsersList)

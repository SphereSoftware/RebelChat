'use babel'

import React, { PropTypes, Component } from 'react'
import _ from 'underscore-plus'
import { connect } from 'react-redux'
import Channel from './Channel'

import * as colors from './colors'
import styled from 'styled-components'
const ChannelsListElement = styled.div`
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

class ChannelsList extends Component {
  static
  get propTypes() {
    return {
      channels: PropTypes.array,
    }
  }

  render() {
    const { channels } = this.props

    return (
      <ChannelsListElement>
        <h3>
          <i className="icon icon-comment" />
          channels
          <span className="counter"> ({channels.length})</span>
        </h3>
        <div>
          {
            channels
            .filter(ch => ch.isMember)
            .map(ch => <Channel {...ch} channel={ch} />)
          }
        </div>
      </ChannelsListElement>
    )
  }
}

function mapStateToProps(state) {
  const channels = _.values(state.channels[state.currentTeam.id] || {})
  return {
    channels: channels.filter(ch => ch.type === 'group'),
  }
}

export default connect(mapStateToProps)(ChannelsList)

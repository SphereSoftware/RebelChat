'use babel'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { SignIn, SignOut } from './Icons'
import Loader from './Loader'
import { ChannelObject, TeamObject } from '../lib/objects'
import { updateChannel } from '../lib/redux/modules/channels'

// Style
import * as colors from './colors'
import styled from 'styled-components'

const ChannelControllElement = styled.span`
  display: flex;
  font-size: 15px;

  cursor: pointer;
  &:hover {
    color: ${colors.textHighlight};
  }

  svg {
    margin-left: 7px;
  }
`

class ChannelControll extends Component {
  static
  propTypes = {
    channel: PropTypes.instanceOf(ChannelObject),
    currentTeam: PropTypes.instanceOf(TeamObject),
    dispatch: PropTypes.func,
  }

  joinOrLeaveTheChannel() {
    const { currentTeam, channel, channel: { isMember }, dispatch } = this.props
    if (isMember) {
      currentTeam.leave(channel)
    } else {
      currentTeam.join(channel)
    }
    dispatch(updateChannel({ ...channel, status: 'leaving' }))
  }

  inProgress() {
    return (
      <Loader size={15} />
    )
  }

  controls() {
    return (
      <ChannelControllElement onClick={() => ::this.joinOrLeaveTheChannel()}>
        <span>{this.props.channel.isMember ? 'Leave' : 'Join' }</span>
        {' '}
        {this.props.channel.isMember ? <SignIn /> : <SignOut />}
      </ChannelControllElement>
    )
  }

  render() {
    const { channel: { status } } = this.props
    return (status === 'online') ? this.controls() : this.inProgress()
  }
}

function mapStateToProps(state) {
  return {
    currentTeam: state.currentTeam,
  }
}

export default connect(mapStateToProps)(ChannelControll)

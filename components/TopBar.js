'use babel'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import ChannelControll from './ChannelControll'
import { ChannelObject } from '../lib/objects'

// Style
import * as colors from './colors'
import styled from 'styled-components'
const TopBarElement = styled.div`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid ${colors.baseBorder};
  background-color: ${colors.appBackground};
  padding: 6px 11px 8px 10px;

  .title {
    flex: 4;
    display: flex;
    flex-direction: column;

    .name {
      font-size: 16px;
      font-weight: bolder;
      color: ${colors.textHighlight};
    }

    .desc {
      display: flex;
      color: ${colors.textSubtle};

      .members {
        margin-right: 10px;
      }
    }
  }

  .controls {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`

class TopBar extends Component {
  static
  propTypes = {
    currentChannel: PropTypes.instanceOf(ChannelObject),
  }

  render() {
    if (!this.props.currentChannel) {
      return <div />
    }

    const { name, type, memberIds } = this.props.currentChannel

    return (
      <TopBarElement>
        <div className="title">
          <div className="name">
            { type === 'group' ? '#' : '@'}
            { name }
          </div>
          <div className="desc">
            <div className="members">
              <small>{ memberIds.length } members</small>
            </div>
            {/* <div className="current-topic">{'topic here '}</div> */}
          </div>
        </div>
        <div className="controls">
          <ChannelControll channel={this.props.currentChannel} />
        </div>
      </TopBarElement>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentChannel: state.activeChannels[state.currentTeam.id],
  }
}

export default connect(mapStateToProps)(TopBar)

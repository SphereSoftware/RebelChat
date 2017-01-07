'use babel'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import Loader from './Loader'
import TopBar from './TopBar'
import MessagesList from './MessagesList'
import MasterInput from './MasterInput'

// Style
import * as colors from './colors'
import styled from 'styled-components'
const ImMainWrapper = styled.section`
  height: 100vh;
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: ${colors.baseBackground};
`

const LoaderWrapper = styled.section`
  height: 100vh;
  display: flex;
  min-width: 100%;
  align-items: center;
  justify-content: center;
`

class Main extends Component {
  static
  get propTypes() {
    return {
      currentTeam: PropTypes.object,
      currentChannel: PropTypes.object,
    }
  }

  renderMasterInput() {
    if (this.props.currentChannel.isMember) {
      return <MasterInput />
    }

    return null
  }

  render() {
    const { currentChannel, currentTeam } = this.props

    if (currentChannel.id === undefined) {
      return (
        <ImMainWrapper>
          <LoaderWrapper>
            <h1>There is no active channel</h1>
          </LoaderWrapper>
        </ImMainWrapper>
      )
    }

    if (currentChannel.status === 'inProgress') {
      return <LoaderWrapper><Loader /></LoaderWrapper>
    }

    if (currentTeam.status === 'new') {
      return <LoaderWrapper><Loader /></LoaderWrapper>
    }


    return (
      <ImMainWrapper>
        <TopBar />
        <MessagesList />
        {::this.renderMasterInput()}
      </ImMainWrapper>
    )
  }
}

function mapStateToProps(state) {
  const ch = state.activeChannels[state.currentTeam.id] || {}
  const channels = state.channels || {}
  return {
    currentTeam: state.currentTeam,
    currentChannel: (channels[state.currentTeam.id] || {})[ch.id] || {},
  }
}

export default connect(mapStateToProps)(Main)

'use babel'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// Components
import SwitchTeam from './SwitchTeam'
import CurrentUserInfo from './CurrentUserInfo'
import ChannelsList from './ChannelsList'
import UsersList from './UsersList'
import NewTeamButton from './NewTeamButton'
import SettingsButtom from './SettingsButtom'

import { TeamObject } from '../lib/objects'

// Style
import * as colors from './colors'
import styled from 'styled-components'
const TeamsWrapepr = styled.div`
  min-height: 100vh;
  padding: 5px;
  border-right: 1px solid ${colors.baseBorder};
  color: ${colors.textSubtle};
  text-align: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  li {
    margin: 8px 5px;

    &.active::before {
      content: '';
      width: 10px;
      margin-left: -17px;
      margin-top: 4px;
      height: 28px;
      background-color: ${colors.textHighlight};
      border-radius: 3px;
      float: left;
    }


    img {
      display: block;
      border-radius: 3px;
      width: 36px;
      height: 36px;

      &:hover {
        border: 2px solid ${colors.textHighlight};
        box-sizing: border-box;
      }
    }
  }
`

const TeamDetails = styled.div`
  background-color: ${colors.background};
  border-right: 1px solid ${colors.baseBorder};
  font-size: 14px;
  min-width: 240px;
  max-width: 240px;
  overflow-x: hidden;
  display: block;
`

const SideBarElement = styled.div`
  display: flex;
  justify-content: flex-start;
`

class SideBar extends Component {
  static
  propTypes = {
    teams: PropTypes.arrayOf(TeamObject),
    currentTeam: PropTypes.instanceOf(TeamObject),
  }

  teamsBar() {
    const { teams } = this.props

    return (
      <TeamsWrapepr>
        <div>
          {teams.map((team, index) => <SwitchTeam key={team.id} order={index} team={team} />)}
          <NewTeamButton />
        </div>
        <SettingsButtom />
      </TeamsWrapepr>
    )
  }

  currentTeamChannelsBar() {
    if (this.props.currentTeam.status === 'new') {
      return <div />
    }

    return (
      <TeamDetails>
        <CurrentUserInfo />
        <ChannelsList />
        <UsersList />
      </TeamDetails>
    )
  }

  render() {
    return (
      <SideBarElement>
        {this.teamsBar()}
        {this.currentTeamChannelsBar()}
      </SideBarElement>
    )
  }
}

function mapStateToProps(state) {
  return {
    teams: state.teams,
    currentTeam: state.currentTeam,
  }
}

export default connect(mapStateToProps)(SideBar)

'use babel'

import React, { Component } from 'react'
import styled from 'styled-components'
import TeamLoader from '../lib/TeamLoader'
import TeamLogo from './TeamLogo'
import { connect } from 'react-redux'
import { removeTeam } from '../lib/redux/modules/teams'

import {
  CheckedIcon,
  UncheckedIcon,
  CloseIcon,
  TrashIcon,
  SlackIcon,
  SkypeIcon,
  TwitterIcon,
  HipchatIcon,
  IrcIcon,
} from './Icons'

// Style Section
import * as colors from './colors'

const TeamElement = styled.div`
  margin: 8px 5px;
  display: flex;

  .name {
    text-transform: capitalize;
    font-size: 26px;
    font-weight: 300;
    margin: 0 7px;
    width: 200px;
    text-align: right;
    padding-right: 5px;
  }

  .type {
    margin-left: 10px;
  }

  .actions {
    margin-left: 6px;
    cursor: pointer;
  }

  .avatar {
    margin-left: 15px;

    img, svg {
      display: block;
      border-radius: 3px;
      width: 36px;
      height: 36px;
    }
  }
`

const Wrapper = styled.div`
  ol {
    list-style: none;

    li {
      margin: 15px;
      color: #3f444d;
    }
  }
`

class TeamsSettingsScreen extends Component {
  teamStatusRow(team) {
    return (
      <tr>
        <td>{team.id}</td>
        <td>{team.status}</td>
        <td>{team.name}</td>
        <td><CheckedIcon /></td>
      </tr>
    )
  }

  teamTypeIcon(team) {
    const size = 36
    switch (team.type) {
      case 'Slack':
        return <SlackIcon size={size} />
      case 'Hipchat':
        return <HipchatIcon size={size} />
      case 'Skype':
        return <SkypeIcon size={size} />
      case 'Twitter':
        return <TwitterIcon size={size} />
      default:
        return <div />
    }
  }

  render() {
    const { teams, dispatch } = this.props

    return (
      <Wrapper>
        {teams.map((team, i) => {
          return (
            <TeamElement key={i}>
              <div className="name">{team.name}</div>
              <div className="avatar"><TeamLogo team={team} /></div>
              <div className="type">{this.teamTypeIcon(team)}</div>
              <div className="actions" onClick={() => dispatch(removeTeam(team))}><TrashIcon size={36} /></div>
            </TeamElement>
          )
        })}
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
  return {
    teams: state.teams,
  }
}

export default connect(mapStateToProps)(TeamsSettingsScreen)

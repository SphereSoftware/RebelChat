'use babel'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

// Style
import styled from 'styled-components'
const UserInfoElement = styled.div`
  padding: 9px 16px 0 16px;
  font-size: 14px;

  .team-name {
    text-transform: capitalize;
    font-size: 16px;
    font-weight: 800;
  }

  .user-name {

  }
`

class CurrentUserInfo extends Component {
  static
  get propTypes() {
    return {
      currentUser: PropTypes.object,
      teamName: PropTypes.string,
    }
  }

  render() {
    const { teamName, currentUser } = this.props

    return (
      <UserInfoElement>
        <div className="team-name">{ teamName }</div>
        <div className="user-name">@{ currentUser.username }</div>
      </UserInfoElement>
    )
  }
}

function mapStateToProps(state) {
  return {
    teamName: state.currentTeam.name,
    currentUser: state.users[state.currentTeam.id][state.currentTeam.userId],
  }
}

export default connect(mapStateToProps)(CurrentUserInfo)

'use babel'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { setStatus } from '../lib/redux/modules/status'
import { PlusIcon } from './Icons'

// Style
import * as colors from './colors'
import styled from 'styled-components'
const AddNewTeamElement = styled.div`
  margin: 8px 5px;
  width: 32px;
  height: 32px;
  display: block;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${colors.textHighlight};
    box-sizing: border-box;
  }
`

class NewTeamButton extends Component {
  static
  get propTypes() {
    return {
      dispatch: PropTypes.function,
    }
  }

  render() {
    const { dispatch } = this.props
    return (
      <AddNewTeamElement onClick={() => dispatch(setStatus('addNewTeam'))}>
        <PlusIcon />
      </AddNewTeamElement>
    )
  }
}

export default connect()(NewTeamButton)

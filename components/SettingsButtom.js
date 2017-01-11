'use babel'

import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { setStatus } from '../lib/redux/modules/status'
import { SettingsIcon } from './Icons'

// Style
import * as colors from './colors'
import styled from 'styled-components'
const SettingsElement = styled.div`
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

class SettingsButtom extends Component {
  static
  get propTypes() {
    return {
      dispatch: PropTypes.function,
    }
  }

  render() {
    const { dispatch } = this.props
    return (
      <SettingsElement onClick={() => dispatch(setStatus('openTeamsSettings'))}>
        <SettingsIcon />
      </SettingsElement>
    )
  }
}

export default connect()(SettingsButtom)

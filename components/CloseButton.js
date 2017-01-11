'use babel'

import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { setStatus } from '../lib/redux/modules/status'

import {
  CloseIcon,
} from './Icons'

// Style Section
import * as colors from './colors'
const Wrapper = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  width: 30px;
  height: 30px;
  color: ${colors.inputBorder};

  &:hover {
    color: ${colors.buttonBgHover};
  }
`

class CloseButton extends Component {
  render() {
    const { dispatch } = this.props

    return (
      <Wrapper onClick={() => dispatch(setStatus(''))}>
        <CloseIcon />
      </Wrapper>
    )
  }
}

export default connect()(CloseButton)

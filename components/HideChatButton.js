'use babel'

import React, { Component } from 'react'
import styled from 'styled-components'

import {
  SignOut,
} from './Icons'

// Style Section
import * as colors from './colors'
const Wrapper = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  color: ${colors.inputBorder};

  &:hover {
    color: ${colors.buttonBgHover};
  }
`

export default class HideChatButton extends Component {
  hideChat() {
    atom.commands.dispatch(
      atom.views.getView(atom.workspace.getActivePane()),
      'rebel-chat:hide',
    )
  }

  render() {
    return (
      <Wrapper onClick={() => this.hideChat()}>
        <SignOut size={36} />
      </Wrapper>
    )
  }
}

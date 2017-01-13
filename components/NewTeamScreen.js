'use babel'

import React, { Component } from 'react'
import styled from 'styled-components'

import {
  SlackIcon,
  SkypeIcon,
  TwitterIcon,
  HipchatIcon,
  IrcIcon,
  ChevronLeftIcon,
} from './Icons'

import NewSkypeForm from './NewSkypeForm'
import NewSlackForm from './NewSlackForm'
import NewTwitterForm from './NewTwitterForm'
import NewHipchatForm from './NewHipchatForm'
import NewIrcForm from './NewIrcForm'

// Style Section
import * as colors from './colors'
const Wrapper = styled.div`
  font-family: 'BlinkMacSystemFont';

  svg {
    margin-right: 40px;
    cursor: pointer;
    color: ${colors.baseBorder};

    &:hover {
      color: ${colors.buttonBgHover};
    }
  }

  .back {
    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 25px;
    font-weight: bold;
  }
`

export default class NewTeamScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      client: undefined,
    }
  }

  renderForm() {
    switch (this.state.client) {
      case 'skype':
        return <NewSkypeForm />
      case 'slack':
        return <NewSlackForm />
      case 'twitter':
        return <NewTwitterForm />
      case 'hipchat':
        return <NewHipchatForm />
      case 'irc':
        return <NewIrcForm />
      default:
        return <div />
    }
  }

  renderBackButton() {
    if (this.state.client) {
      return (
        <a className="back" onClick={() => ::this.setState({ client: undefined })} >
          <ChevronLeftIcon size={30} />
        </a>
      )
    }

    return <div />
  }

  renderButtons() {
    if (this.state.client) {
      return <div />
    }

    return (
      <nav>
        <item onClick={() => ::this.setState({ client: 'slack' })} ><SlackIcon /></item>
        <item onClick={() => ::this.setState({ client: 'hipchat' })} ><HipchatIcon /></item>
        <item onClick={() => ::this.setState({ client: 'skype' })} ><SkypeIcon /></item>
        <item onClick={() => ::this.setState({ client: 'twitter' })} ><TwitterIcon /></item>
      </nav>
    )
  }

  render() {
    return (
      <Wrapper>
        {this.renderBackButton()}
        {this.renderButtons()}
        {this.renderForm()}
      </Wrapper>
    )
  }
}

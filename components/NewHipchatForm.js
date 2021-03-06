'use babel'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { setStatus } from '../lib/redux/modules/status'
import TeamLoader from '../lib/TeamLoader'
import { TeamObject } from '../lib/objects'

// Style Section
import * as colors from './colors'
import styled from 'styled-components'
const Wrapper = styled.div`
  h1 {
    text-align: center;
    font-weight: 300;
    color: #3f444d;
    font-size: 36px;
    margin-bottom: 50px;
  }

  input {
    width: 100%;
    margin-bottom: 20px;
    display: block;
    font-size: 24px;
    font-weight: lighter;
    letter-spacing: 2px;
    padding: 10px;
    padding-left: 20px;
    background-color: ${colors.appBackground};
    border: 1px solid ${colors.baseBorder};
    border-radius: 3px;

    &:focus {
      border: 1px solid;
      border-color: #528bff;
      box-shadow: 0 0 0 1px #528bff;
    }

    &::-webkit-input-placeholder {
      opacity: 0.65;
      color: ${colors.buttonBgHover};
    }
  }

  b {
    color: ${colors.textSelected};
    font-weight: 400;
  }

  section {
    width: 670px;
    display: flex;
    flex-direction: column;

    &:last-child {
      align-items: flex-end;
    }
  }

  button {
    margin: 0 5px;
    border-radius: 3px;
    color: #79818e;
    font-size: 20px;
    padding: 10px 25px;
    text-shadow: none;
    border: 1px solid #181a1f;
    background-color: #353b45;
    &:hover {
      background-color: ${colors.buttonBgHover};
      color: ${colors.text};
    }
  }

  p {
    margin-top: 115px;
    font-size: 16px;
    color: #3f444d;
    width: 100%;
  }

  a {
    color: #79818e;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
      color: ${colors.text};
    }
  }
`

class NewHipchatForm extends Component {
  static
  propTypes = {
    dispatch: PropTypes.function,
    teams: PropTypes.arrayOf(TeamObject),
  }

  saveTeam(e) {
    const { dispatch } = this.props
    const jid = e.target.elements.jid.value
    const password = e.target.elements.password.value
    const accessToken = e.target.elements.accessToken.value

    if (accessToken && jid && password) {
      dispatch(setStatus('inProgress'))
      const teamLoader = new TeamLoader()
      teamLoader.connect({ type: 'Hipchat', accessToken, jid, password })
    }

    setTimeout(() => {
      dispatch(setStatus('ready'))
    }, 300)
  }

  render() {
    return (
      <Wrapper>
        <h1>Enter your <b>HipChat</b> credentials</h1>
        <form onSubmit={e => ::this.saveTeam(e)}>
          <section>
            <input type="text" name="jid" className="native-key-bindings" placeholder="Enter your JID" />
            <input type="password" name="password" className="native-key-bindings" placeholder="Enter your password" />
            <input type="text" name="accessToken" className="native-key-bindings" placeholder="API accessToken" />
          </section>
          <section>
            <button type="submit">Connect</button>
            <p>
              If you have any questions you can read more <a tabIndex="-1" href="https://github.com/SphereSoftware/rebel-chat/wiki/HipChat">here </a>.
            </p>
          </section>
        </form>
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
  return {
    teams: state.teams,
  }
}

export default connect(mapStateToProps)(NewHipchatForm)

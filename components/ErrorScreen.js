'use babel'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// Style Section
import * as colors from './colors'
import styled from 'styled-components'
const Wrapper = styled.div`
font-family: 'BlinkMacSystemFont', 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, sans-serif;
margin-top: -70px;

  h1 {
    text-align: center;
    font-weight: 300;
    color: rgba(157, 165, 180, 0.2);
    font-size: 36px;
    margin-bottom: 40px;
  }

  p {
    font-size: 18px;
    font-weight: 300;
  }

  a {
    color: rgb(121, 129, 142);
    text-decoration: underline;
    &:hover {
      text-decoration: none;
      color: ${colors.text};
    }
  }
`

class ErrorScreen extends Component {
  static
  get propTypes() {
    return {
      message: PropTypes.string,
    }
  }

  render() {
    return (
      <Wrapper>
        <h1>something went wrong :(</h1>
        <p>{this.props.message || 'Check The console.log.'}</p>
      </Wrapper>
    )
  }
}

export default connect()(ErrorScreen)

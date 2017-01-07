'use babel'

import React, { PropTypes, Component } from 'react'
import classNames from 'classnames'
import { messageTs } from '../lib/utils'
import ParsedMessage from './ParsedMessage'
import { MessageObject, UserObject } from '../lib/objects'

// Style
import * as colors from './colors'
import styled from 'styled-components'
const SlackMessageElement = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: flex-start;

  .gutter {
    min-width: 65px;
    margin-right: 10px;
    display: flex;
    justify-content: flex-end;

    .avatar {
      display: none;
      img {
        width: 36px;
        height: 36px;
        opacity: 0.7;
        border: 1px solid #545454;
        border-radius: 3px;
      }
    }

    .ts {
      display: none;
      color: #696e77;
    }
  }

  &:hover {
    &:not(.first) .gutter {
      .ts {
        display: inline-block;
      }
    }
  }

  &.first {
    .gutter {
      .avatar {
        margin-top: 4px;
        display: inline;
      }
    }

    .content {
      .username, .ts {
        display: inline;
      }
    }
  }

  .content {
    .username, .ts {
      display: none;
      margin-right: 4px;
      color: #696e77;
    }

    .username:hover, .ts:hover {
      color: ${colors.textSubtle};
      text-decoration: underline;
    }

    .body {
      display: block;
    }
  }
`

export default class SlackMessage extends Component {
  static
  defaultProps = {
    user: {},
  }

  static
  propTypes = {
    first: PropTypes.boolean,
    odd: PropTypes.boolean,
    user: React.PropTypes.instanceOf(UserObject),
    message: React.PropTypes.instanceOf(MessageObject),
  }

  render() {
    const { message, user, odd, first } = this.props

    return (
      <SlackMessageElement className={classNames({ first, odd, even: !odd })}>
        <div className="gutter">
          <span className="avatar">
            <img role="presentation" src={user.avatar} />
          </span>
          <span className="ts">{messageTs(message.createdAt)}</span>
        </div>
        <div className="content">
          <span className="username">@{user.username}</span>
          <span className="ts">{messageTs(message.createdAt)}</span>
          <span className="body">
            <ParsedMessage text={message.text} />
          </span>
        </div>
      </SlackMessageElement>
    )
  }
}

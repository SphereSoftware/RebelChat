'use babel'

import React, { PropTypes, Component } from 'react'
import FileReaderInput from 'react-file-reader-input'
import { FileIcon } from './Icons'
import { TeamObject, ChannelObject, UserObject, MessageObject } from '../lib/objects'
import { connect } from 'react-redux'

// Style
import styled from 'styled-components'
const FileUploadElement = styled.form`
  display: flex;
  border: none;
  padding: 10px;
  border-radius: 0px 3px 3px 0px;
  cursor: pointer;

  .file-icon {
    display: flex;
    align-items: center;
  }
`

class FileUpload extends Component {
  static
  propTypes = {
    currentTeam: PropTypes.instanceOf(TeamObject),
    currentChannel: PropTypes.instanceOf(ChannelObject),
    currentUser: PropTypes.instanceOf(UserObject),
  }

  sendFile(e, results) {
    const { currentTeam, currentChannel, currentUser } = this.props

    results.forEach((result) => {
      const file = result[1]
      const message = new MessageObject({
        senderId: currentUser.id,
        teamId: currentTeam.id,
        channelId: currentChannel.id,
        text: file.path,
        type: 'file',
        createdAt: (new Date()).getTime(),
        state: 'new',
      })

      currentTeam.send(message)
    })
  }

  render() {
    return (
      <FileUploadElement>
        <FileReaderInput as="binary" onChange={(e, results) => ::this.sendFile(e, results)} >
          <div className="file-icon">
            <FileIcon />
          </div>
        </FileReaderInput>
      </FileUploadElement>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentTeam: state.currentTeam,
    currentChannel: state.activeChannels[state.currentTeam.id],
    currentUser: state.users[state.currentTeam.id][state.currentTeam.userId],
  }
}

export default connect(mapStateToProps)(FileUpload)

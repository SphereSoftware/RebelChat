'use babel'

import React, { PropTypes, Component } from 'react'
import { SmileIcon } from './Icons'
import FileUpload from './FileUpload'
import { CompositeDisposable } from 'atom'
import { connect } from 'react-redux'
import TeamLoader from '../lib/TeamLoader'
import Sounds from '../lib/Sounds'
import { MessageObject, TeamObject, ChannelObject, UserObject } from '../lib/objects'

import { Picker } from '../lib/emoji-mart'

// Style
import * as colors from './colors'
import styled from 'styled-components'
const PickerElement = styled.div`
position: absolute;
bottom: 70px;
right: 20px;
`

const MasterInputElement = styled.div`
  border-top: 1px solid ${colors.baseBorder};
  background-color: ${colors.baseBackground};

  bottom: 0;
  right: 0;

  .container {
    border: 1px solid ${colors.baseBorder};
    background-color: ${colors.appBackground};
    margin: 9px;
    padding-right: 7px;
    display: flex;
  }

  .smile-icon {
    display: flex;
    align-items: center;
  }

  .input-container {
    flex: 1;
    padding: 5px 0;
    margin: auto;
  }

  atom-text-editor {
    background-color: ${colors.appBackground};
  }

  atom-text-editor.im-editor, atom-text-editor.im-editor::shadow {
    .cursor-line {
      background-color: ${colors.appBackground};
    }

    .gutter {
      display: none;
    }
  }
`

class MasterInput extends Component {
  static
  propTypes = {
    currentTeam: PropTypes.instanceOf(TeamObject),
    currentChannel: PropTypes.instanceOf(ChannelObject),
    currentUser: PropTypes.instanceOf(UserObject),
  }

  constructor(props) {
    super(props)
    this.teamFactory = new TeamLoader()
    this.subscriptions = new CompositeDisposable()

    this.editor = atom.workspace.buildTextEditor()
    const disposable = atom.textEditors.add(this.editor)
    this.editor.onDidDestroy(() => {
      disposable.dispose()
    })

    this.editor.setGrammar(atom.grammars.selectGrammar('text.md'))
    this.editor.setPlaceholderText('Hi there ...')
    this.editor.getElement().classList.add('im-editor')

    this.state = { showEmojiPicker: false }
  }

  componentDidMount() {
    this.editorContainer.appendChild(this.editor.getElement())
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'rebel-chat:hide-emoji-picker': () => this.hideEmojiPicker(),
        'rebel-chat:send': () => this.sendMessage(),
        'rebel-chat:focus-msg-editor': () => {
          this.editor.getElement().focus()
        },
      })
    )
  }

// TODO: verify if commenting this didn't break anything
// TODO: remove if so
//  shouldComponentUpdate() {
//    return false;
//  }

  componentWillUnmount() {
    this.subscriptions.dispose()
  }

  currentTeamProvider() {
    return this.teamFactory.getAllTeams().find(
      client => client.getId() === this.props.currentTeam
    )
  }

  sendMessage() {
    this.setState({ showEmojiPicker: false })

    if (this.editor.getText().trim().length === 0) {
      return
    }

    const { currentTeam, currentChannel, currentUser } = this.props
    const message = new MessageObject({
      senderId: currentUser.id,
      teamId: currentTeam.id,
      channelId: currentChannel.id,
      text: this.editor.getText().trim(),
      createdAt: (new Date()).getTime(),
      state: 'new',
    })


    setTimeout(() => {
      this.editor.setText('')
    }, 0)

    currentTeam.send(message)
    Sounds.beep()
  }

  insertEmoji(emoji) {
    atom.commands.dispatch(
      atom.views.getView(this.editor),
      'rebel-chat:focus-msg-editor',
    )
    this.editor.insertText(`${emoji.colons} `)
    this.hideEmojiPicker()
    this.editor.getElement().focus()
  }

  hideEmojiPicker() {
    this.setState({
      showEmojiPicker: false,
    })
  }

  toggleEmojiPicker() {
    this.setState({
      showEmojiPicker: !this.state.showEmojiPicker,
    })

    atom.commands.dispatch(
      atom.views.getView(this.editor),
      'rebel-chat:focus-msg-editor'
    )
  }

  renderEmojiPicker() {
    if (this.state.showEmojiPicker) {
      return (
        <PickerElement>
          <Picker onClick={emoji => ::this.insertEmoji(emoji)} />
        </PickerElement>
      )
    }

    return <div />
  }


  render() {
    return (
      <MasterInputElement>
        <div className="container">
          <FileUpload />
          <div
            className="input-container"
            ref={(node) => { this.editorContainer = node }}
          >
            {/* EditorElement here it has 'im-editor' class */}
          </div>
          {this.renderEmojiPicker()}
          <div
            className="smile-icon"
            onClick={() => ::this.toggleEmojiPicker()}
          >
            <SmileIcon />
          </div>
        </div>
      </MasterInputElement>
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

export default connect(mapStateToProps)(MasterInput)

'use babel'

import React, { PropTypes, Component } from 'react'
import { TeamObject } from '../lib/objects'
import Loader from './Loader'
import { IrcIcon } from './Icons'

export default class TeamLogo extends Component {
  static propTypes = {
    team: PropTypes.instanceOf(TeamObject),
  }

  render() {
    const { team: { icon, name } } = this.props
    if (icon === 'IrcIcon') {
      return <IrcIcon width={32} height={32} />
    }

    if (icon) {
      return <img src={icon} alt={name} />
    }

    return <Loader size={32} />
  }
}

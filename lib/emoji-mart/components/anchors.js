'use babel';

import React from 'react'
import { CategoriesPics } from '../svgs'

export default class Anchors extends React.Component {
  constructor(props) {
    super(props)

    var defaultCategory = props.categories[0]
    if (defaultCategory.anchor) {
      defaultCategory = defaultCategory.anchor
    }

    this.state = {
      selected: defaultCategory.name
    }
  }

  render() {
    var { categories, onAnchorClick, color, i18n } = this.props,
        { selected } = this.state

    return <div className='emoji-mart-anchors'>
      {categories.map((category, i) => {
        var { name, anchor } = category,
            isSelected = name == selected

        if (anchor) {
          return null
        }

        const pic = CategoriesPics[name]()

        return (
          <span
            key={name}
            title={i18n.categories[name.toLowerCase()]}
            onClick={() => onAnchorClick(category, i)}
            className={`emoji-mart-anchor ${isSelected ? 'emoji-mart-anchor-selected' : ''}`}
            style={{ color: isSelected ? color : null }}
          >
            {pic}
            <span className='emoji-mart-anchor-bar' style={{ backgroundColor: color }}></span>
          </span>
        )
      })}
    </div>
  }
}

Anchors.propTypes = {
  categories: React.PropTypes.array,
  onAnchorClick: React.PropTypes.func,
}

Anchors.defaultProps = {
  categories: [],
  onAnchorClick: (() => {}),
}

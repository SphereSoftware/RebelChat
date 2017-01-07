'use babel';

import '../vendor/raf-polyfill'

import React from 'react'
import data from '../data'

import frequently from '../utils/frequently'
import { deepMerge } from '../utils'

import { Anchors, Category, Preview, Search } from '.'

const RECENT_CATEGORY = { name: 'Recent', emojis: null }
const SEARCH_CATEGORY = { name: 'Search', emojis: null, anchor: RECENT_CATEGORY }

const CATEGORIES = [
  SEARCH_CATEGORY,
  RECENT_CATEGORY,
].concat(data.categories)

const I18N = {
  search: 'Search',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
  },
}

export default class Picker extends React.Component {
  static
  propTypes = {
    onClick: React.PropTypes.func,
    perLine: React.PropTypes.number,
    emojiSize: React.PropTypes.number,
    i18n: React.PropTypes.object,
    style: React.PropTypes.object,
    title: React.PropTypes.string,
    emoji: React.PropTypes.string,
    color: React.PropTypes.string,
  }

  static
  defaultProps = {
    onClick: (() => {}),
    emojiSize: 24,
    perLine: 9,
    i18n: {},
    style: {},
    title: 'EmojiMart',
    emoji: 'department_store',
    color: '#ae65c5',
  }

  constructor(props) {
    super(props)
    this.i18n = deepMerge(I18N, props.i18n)
    this.state = {
      firstRender: true,
    }
  }

  componentDidMount() {
    if (this.state.firstRender) {
      this.firstRenderTimeout = setTimeout(() => {
        this.setState({ firstRender: false })
      }, 60)
    }
  }

  componentDidUpdate() {
    this.updateCategoriesSize()
    this.handleScroll()
  }

  componentWillUnmount() {
    SEARCH_CATEGORY.emojis = null

    clearTimeout(this.leaveTimeout)
    clearTimeout(this.firstRenderTimeout)
  }

  handleEmojiOver(emoji) {
    this.preview.setState({  emoji })
    clearTimeout(this.leaveTimeout)
  }

  handleEmojiLeave() {
    this.leaveTimeout = setTimeout(() => {
      this.preview.setState({ emoji: null })
    }, 16)
  }

  handleEmojiClick(emoji, e) {
    this.props.onClick(emoji, e)
    frequently.add(emoji)

    const component = this['category-1']
    if (component) {
      const maxMargin = component.maxMargin
      component.forceUpdate()

      window.requestAnimationFrame(() => {
        component.memoizeSize()
        if (maxMargin === component.maxMargin) return

        this.updateCategoriesSize()
        this.handleScrollPaint()

        if (SEARCH_CATEGORY.emojis) {
          component.updateDisplay('none')
        }
      })
    }
  }

  handleScroll() {
    if (!this.waitingForPaint) {
      this.waitingForPaint = true
      window.requestAnimationFrame(this.handleScrollPaint.bind(this))
    }
  }

  handleScrollPaint() {
    this.waitingForPaint = false

    if (!this.scroll) {
      return
    }

    const target = this.scroll
    const scrollTop = target.scrollTop
    const scrollingDown = scrollTop > (this.scrollTop || 0)
    let activeCategory = null
    let minTop = 0

    for (let i = 0, l = CATEGORIES.length; i < l; i++) {
      const ii = scrollingDown ? (CATEGORIES.length - 1 - i) : i
      let category = CATEGORIES[ii]
      const component = this[`category-${ii}`]

      if (component) {
        const active = component.handleScroll(scrollTop)

        if (!minTop || component.top < minTop) {
          if (component.top > 0) {
            minTop = component.top
          }
        }

        if (active && !activeCategory) {
          if (category.anchor) category = category.anchor
          activeCategory = category
        }
      }
    }

    if (scrollTop < minTop) {
      activeCategory = RECENT_CATEGORY
    }

    if (activeCategory) {
      const { name: categoryName } = activeCategory

      if (this.anchors.state.selected !== categoryName) {
        this.anchors.setState({ selected: categoryName })
      }
    }

    this.scrollTop = scrollTop
  }

  handleSearch(emojis) {
    SEARCH_CATEGORY.emojis = emojis

    for (let i = 0, l = CATEGORIES.length; i < l; i++) {
      const component = this[`category-${i}`]

      if (component && component.props.name !== 'Search') {
        const display = emojis ? 'none' : null
        component.updateDisplay(display)
      }
    }

    this.forceUpdate()
  }

  handleAnchorClick(category, i) {
    const component = this[`category-${i}`]
    const { scroll } = this

    const scrollToComponent = () => {
      if (component) {
        let { top } = component

        if (category.name === 'Recent') {
          top = 0
        } else {
          top += 1
        }

        scroll.scrollTop = top
      }
    }

    if (SEARCH_CATEGORY.emojis) {
      this.handleSearch(null)
      this.search.clear()

      window.requestAnimationFrame(scrollToComponent)
    } else {
      scrollToComponent()
    }
  }

  updateCategoriesSize() {
    for (let i = 0, l = CATEGORIES.length; i < l; i++) {
      const component = this[`category-${i}`]
      if (component) {
        component.memoizeSize()
      }
    }
  }

  getCategories() {
    const categories = CATEGORIES
    return this.state.firstRender ? categories.slice(0, 3) : categories
  }

  render() {
    const { perLine, emojiSize, style, title, emoji, color } = this.props
    const width = 380

    return (
      <div style={{ ...style, width }} className="emoji-mart">
        <div className="emoji-mart-bar">
          <Anchors
            ref={(c) => { this.anchors = c; }}
            i18n={this.i18n}
            color={color}
            categories={CATEGORIES}
            onAnchorClick={this.handleAnchorClick.bind(this)}
          />
        </div>

        <div
          ref={(c) => { this.scroll = c; }}
          className="emoji-mart-scroll" onScroll={this.handleScroll.bind(this)}>
          <Search
            ref={(c) => { this.search = c; }}
            onSearch={this.handleSearch.bind(this)}
            i18n={this.i18n}
          />

          {this.getCategories().map((category, i) => {
            return <Category
              ref={(c) => { this[`category-${i}`] = c; }}
              key={category.name}
              name={category.name}
              emojis={category.emojis}
              perLine={perLine}
              i18n={this.i18n}
              emojiProps={{
                size: emojiSize,
                onOver: this.handleEmojiOver.bind(this),
                onLeave: this.handleEmojiLeave.bind(this),
                onClick: this.handleEmojiClick.bind(this),
              }}
            />
          })}
        </div>

        <div className="emoji-mart-bar">
          <Preview
            ref={(c) => { this.preview = c; }}
            title={title}
            emoji={emoji}
            emojiProps={{
              size: 38,
            }}
          />
        </div>
      </div>
    )
  }
}

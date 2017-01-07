'use babel';

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'

import StatusBarElement from '../components/StatusBarElement'

export default class StatusBarView {
  constructor({ store, imView }) {
    this.activated = false
    this.element = document.createElement('span')
    this.imView = imView
    this.store = store
    this.element.addEventListener('click', this.handleClick);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  init() {
    // render app in a background
    setTimeout(() => {
      ReactDOM.render(
        <Provider store={this.store}>
          <IntlProvider locale="en">
            <StatusBarElement />
          </IntlProvider>
        </Provider>, this.element)
    }, 1)
  }

  // Tear down any state and detach
  destroy() {
    this.element.removeEventListener('click', this.handleClick);
    this.element.remove();
  }

  handleClick() {
    atom.commands.dispatch(this, 'rebel-chat:toggle')
  }

  getElement() {
    return this.element;
  }
}

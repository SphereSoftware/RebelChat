'use babel';

import {
  UserObject,
  TeamObject,
  ChannelObject,
  MessageObject,
} from '../../../lib/objects'

import isVisible, { setVisiable } from '../../../lib/redux/modules/isVisible'

describe('status reducer', () => {
  it('is empty string by default (not set)', () => {
    expect(isVisible(undefined, { type: 'wrongType' })).toEqual(false)
  })

  it('set current tam if no team before and you add new', () => {
    expect(isVisible(undefined, setVisiable(false))).toEqual(false)
    expect(isVisible(false, setVisiable(false))).toEqual(false)
    expect(isVisible(true, setVisiable(false))).toEqual(false)
    expect(isVisible(true, setVisiable(false))).toEqual(false)
    expect(isVisible(false, setVisiable(true))).toEqual(true)
  })
})

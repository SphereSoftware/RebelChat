'use babel';

import {
  UserObject,
  TeamObject,
  ChannelObject,
  MessageObject,
} from '../../../lib/objects'

import status, { setStatus } from '../../../lib/redux/modules/status'

describe('status reducer', () => {
  it('is empty string by default (not set)', () => {
    expect(status(undefined, { type: 'wrongType' })).toEqual('')
  })

  it('set current tam if no team before and you add new', () => {
    expect(status(undefined, setStatus('ready'))).toEqual('ready')
  })
})

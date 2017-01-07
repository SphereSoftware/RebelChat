'use babel';

import { ChannelObject } from '../lib/objects';

describe('ChannelObject', () => {
  const obj = {
    name: 'Some Channel name',
  }
  const [c1, c2] = [new ChannelObject(obj), new ChannelObject(obj)]

  it('has unique id for each new team', () => {
    expect(c1.id).not.toEqual(c2.id)
    expect(c1.id).toEqual(c1.id)
  })
})

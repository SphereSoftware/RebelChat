'use babel';

import { MessageObject } from '../lib/objects';

describe('MessageObject', () => {
  const obj = {
    teamId: 'T04PLFYUL',
    senderId: 'U1NQC8JLD',
    channelId: 'D25QFV5ED',
    text: 'here is <https://github.com/github/github/pull/111>\n\n link.',
  }

  const [m1, m2] = [new MessageObject({ id: 1, ...obj }), new MessageObject({ id: 2, ...obj })]

  it('has unique id for each new team', () => {
    expect(m1.id).not.toEqual(m2.id)
    expect(m1.id).toEqual(m1.id)
  })

  it(' is new by default', () => {
    const m = new MessageObject({})
    expect(m.state).toBe('new')
  });
})

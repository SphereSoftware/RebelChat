'use babel';

import { UserObject } from '../lib/objects';

describe('UserObject', () => {
  const obj = {
    username: 'shemerey',
  }
  const [u1, u2] = [new UserObject(obj), new UserObject(obj)]

  it('has unique id for each new team', () => {
    expect(u1.id).not.toEqual(u2.id)
    expect(u1.id).toEqual(u1.id)
  })

  it('has to have icon by default', () => {
    const user = new UserObject({ ...obj, avatar: 'xxx' })
    expect(user.avatar).toBe('xxx')
  })
})

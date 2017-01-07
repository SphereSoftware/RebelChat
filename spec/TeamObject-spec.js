'use babel';

import { TeamObject } from '../lib/objects';

describe('TeamObject', () => {
  const obj = {
    name: 'Some name',
    username: 'shemerey',
  }
  const [t1, t2] = [new TeamObject(obj), new TeamObject(obj)]

  it('has unique id for each new team', () => {
    expect(t1.id).not.toEqual(t2.id)
    expect(t1.id).toEqual(t1.id)
  })

  it('has to have icon by default', () => {
    const teamObj = new TeamObject({ ...obj, icon: 'xxx' })
    expect(teamObj.icon).toBe('xxx')
  })
})

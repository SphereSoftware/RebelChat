'use babel';

import {
  UserObject,
  TeamObject,
  ChannelObject,
  MessageObject,
} from '../../../lib/objects'

import teams, { addNewTeam, updateTeam } from '../../../lib/redux/modules/teams'

describe('status reducer', () => {
  const t1 = new TeamObject({
    id: 'test-id-for-teams',
  })

  const t2 = new TeamObject({
    id: 'test-id-for-teams-2',
  })

  it('is empty array by default (not set)', () => {
    expect(teams(undefined, { type: 'wrongType' })).toEqual([])
  })

  it('adds team to the list', () => {
    expect(teams(undefined, addNewTeam(t1))).toEqual([t1])
    expect(teams([t1], addNewTeam(t2))).toEqual([t1, t2])
  })

  it('updates the team with the same id', () => {
    const newTeam = new TeamObject({
      ...t1,
      name: 'New name',
    })
    expect(teams([t1], updateTeam(newTeam))).toEqual([newTeam])
  });
})

'use babel';

import {
  UserObject,
  TeamObject,
  ChannelObject,
  MessageObject,
} from '../../../lib/objects'

import { addNewTeam, updateTeam } from '../../../lib/redux/modules/teams'
import currentTeam, { setCurrentTeam } from '../../../lib/redux/modules/currentTeam'


describe('status reducer', () => {
  const t1 = new TeamObject({
    id: 'test-id-for-teams',
  })

  const t2 = new TeamObject({
    id: 'test-id-for-teams-2',
  })

  it('is empty array by default (not set)', () => {
    expect(currentTeam(undefined, { type: 'wrongType' })).toEqual(null)
  })

  it('adds team to the list', () => {
    expect(currentTeam(undefined, addNewTeam(t1))).toEqual(t1)
    expect(currentTeam(t1, addNewTeam(t2))).toEqual(t1)
  })

  it('adds team to the list', () => {
    expect(currentTeam(undefined, updateTeam(t1))).toEqual(null)
    expect(currentTeam(t1, updateTeam(t2))).toEqual(t1)
  })

  it('updates the team with the same id', () => {
    expect(currentTeam(t1, setCurrentTeam(t2))).toEqual(t2)
  });
})

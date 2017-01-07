'use babel';

import {
  UserObject,
} from '../../../lib/objects'

import users, { addNewUser } from '../../../lib/redux/modules/users'

describe('status reducer', () => {
  const u1 = new UserObject({
    id: 'test-id-user',
    teamId: 'some-team-id',
  })

  const u2 = new UserObject({
    id: 'test-id-user-2',
    teamId: 'some-team-id',
  })

  it('is empty array by default (not set)', () => {
    expect(users(undefined, { type: 'wrongType' })).toEqual({})
  })

  it('adds team to the list', () => {
    expect(users(undefined, addNewUser(u1))).toEqual({
      [u1.teamId]: {
        [u1.id]: u1,
      },
    })

    expect(users({
      [u1.teamId]: {
        [u1.id]: u1,
      },
    }, addNewUser(u2))).toEqual({
      [u1.teamId]: {
        [u1.id]: u1,
        [u2.id]: u2,
      },
    })
  })

  it('adds user to the proper team', () => {
    const userFromAnotherTeam = new UserObject({
      id: 'test-id-user-2',
      teamId: 'some-OTHER-team-id',
    })

    expect(users({
      [u1.teamId]: {
        [u1.id]: u1,
      },
    }, addNewUser(userFromAnotherTeam))).toEqual({
      [u1.teamId]: {
        [u1.id]: u1,
      },
      [userFromAnotherTeam.teamId]: {
        [userFromAnotherTeam.id]: userFromAnotherTeam,
      },
    })
  })

  it('updates the team with the same id', () => {
    const newUser1 = new UserObject({
      ...u1,
      username: 'next',
    })

    expect(users({
      [u1.teamId]: {
        [u1.id]: u1,
      },
    }, addNewUser(newUser1))).toEqual({
      [u1.teamId]: {
        [u1.id]: newUser1,
      },
    })
  });
})

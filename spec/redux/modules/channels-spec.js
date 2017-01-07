'use babel';

import {
  ChannelObject,
} from '../../../lib/objects'

import channels, {
  setAllChannels,
  addChannels,
  addNewChannel,
  removeChannel,
  updateChannel,
  setActiveChannel,
} from '../../../lib/redux/modules/channels'


describe('channels reducer', () => {
  const ch1 = new ChannelObject({
    id: 'test-id-user',
    teamId: 'some-team-id',
  })

  const ch2 = new ChannelObject({
    id: 'test-id-user-2',
    teamId: 'some-team-id',
  })

  it('is empty array by default (not set)', () => {
    expect(channels(undefined, { type: 'wrongType' })).toEqual({})
  })

  it('adds team to the list', () => {
    expect(channels(undefined, addNewChannel(ch1))).toEqual({
      [ch1.teamId]: {
        [ch1.id]: ch1,
      },
    })

    expect(channels({
      [ch1.teamId]: {
        [ch1.id]: ch1,
      },
    }, addNewChannel(ch2))).toEqual({
      [ch1.teamId]: {
        [ch1.id]: ch1,
        [ch2.id]: ch2,
      },
    })
  })

  it('adds channel to the proper team', () => {
    const otheTeamChannal = new ChannelObject({
      id: 'test-id-user-2',
      teamId: 'some-OTHER-team-id',
    })

    expect(channels({
      [ch1.teamId]: {
        [ch1.id]: ch1,
      },
    }, addNewChannel(otheTeamChannal))).toEqual({
      [ch1.teamId]: {
        [ch1.id]: ch1,
      },
      [otheTeamChannal.teamId]: {
        [otheTeamChannal.id]: otheTeamChannal,
      },
    })
  })

  it('updates the team with the same id', () => {
    const nextCh1 = new ChannelObject({
      ...ch1,
      name: 'next',
    })

    expect(channels({
      [ch1.teamId]: {
        [ch1.id]: ch1,
      },
    }, addNewChannel(nextCh1))).toEqual({
      [ch1.teamId]: {
        [ch1.id]: nextCh1,
      },
    })
  });
})

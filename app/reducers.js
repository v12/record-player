'use strict'

const actionTypes = require('./constants')

const stations = (state = {}, { type, payload }) => {
  if (type === actionTypes.LOAD_STATIONS) {
    return Object.keys(payload).map(stationCode => {
      const links = {
        hq: `http://air.radiorecord.ru:805/${stationCode}_320`,
        lq: `http://air.radiorecord.ru:805/${stationCode}_64`,
        meta: `https://www.radiorecord.ru/xml/${stationCode}_online_v8.txt`
      }

      return Object.assign({}, payload[stationCode], { links })
    })
  }

  return state
}

const nowPlaying = (state = null, { type, payload }) => {
  return state
}

const source = (state = null, { type, payload }) => {
  if (type === actionTypes.SET_SOURCE) return payload

  return state
}

const isPlaying = (state = false, { type, payload }) => {
  switch (type) {
    case 'player/e/PLAY':
    case 'player/e/PLAYING':
      return true
    case 'player/e/PAUSE':
    case 'player/e/WAITING':
    case 'player/e/STALLED':
      return false

    default:
      return state
  }
}

module.exports = {
  nowPlaying,
  isPlaying,
  source,
  stations
}

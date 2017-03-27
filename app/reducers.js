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

const activeStation = (state = null, { type, payload }) => {
  if (type === actionTypes.SET_ACTIVE_STATION) return payload

  return state
}

const source = (state = null, { type, payload }) => {
  if (type === actionTypes.SET_SOURCE) return payload

  return state
}

const isPlaying = (state = false, { type }) => {
  switch (type) {
    case actionTypes.PLAYER_EVENT_PLAY:
    case actionTypes.PLAYER_EVENT_PLAYING:
      return true
    case actionTypes.PLAYER_EVENT_PAUSE:
    case actionTypes.PLAYER_EVENT_WAITING:
    case actionTypes.PLAYER_EVENT_STALLED:
    case actionTypes.PLAYER_EVENT_ERROR:
      return false

    default:
      return state
  }
}

const playbackError = (state = null, { type, payload }) => {
  if (type === actionTypes.RESET_PLAYBACK_ERROR) return null

  if (type === actionTypes.SET_PLAYBACK_ERROR) return payload

  return state
}

const getActiveStation = state => state.activeStation
const getIsPlaying = state => state.isPlaying
const getSource = state => state.source
const getStations = state => state.stations
const getPlaybackError = state => state.playbackError

module.exports = {
  activeStation,
  isPlaying,
  source,
  stations,
  playbackError,
  getActiveStation,
  getIsPlaying,
  getSource,
  getStations,
  getPlaybackError
}

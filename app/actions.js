'use strict'

const path = require('path')
const fs = require('fs')

const {
  LOAD_STATIONS,
  SET_ACTIVE_STATION,
  SET_SOURCE,
  PLAY,
  PAUSE,
  PLAY_PAUSE
} = require('./constants')

const loadStations = () => {
  let stations

  try {
    stations = fs.readFileSync(path.join(__dirname, '..', 'stations.json'))
  } catch (e) {
    console.error('Unable to read stations file')
  }

  try {
    stations = JSON.parse(stations.toString())
  } catch (e) {
    console.error('Unable to parse stations file')
  }

  return {
    type: LOAD_STATIONS,
    payload: stations
  }
}

const setActiveStation = (shortName) => ({ type: SET_ACTIVE_STATION, payload: shortName })
const setSource = (srcUrl) => ({ type: SET_SOURCE, payload: srcUrl })

const playPause = (srcUrl) => ({ type: PLAY_PAUSE, payload: srcUrl })
const play = (srcUrl) => ({ type: PLAY, payload: srcUrl })
const pause = (srcUrl) => ({ type: PAUSE })

module.exports = {
  loadStations,
  setActiveStation,
  setSource,
  playPause,
  play,
  pause
}

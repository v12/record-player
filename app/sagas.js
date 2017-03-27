'use strict'

const { ipcRenderer } = require('electron')

const { takeEvery, select, put } = require('redux-saga/effects')
const actionTypes = require('./constants')
const { getIsPlaying, getSource, getStations, getPlaybackError } = require('./reducers')
const { playPause, setSource, setPlaybackError, resetPlaybackError } = require('./actions')

const mediaErrors = {
  0: {
    code: 'MEDIA_ERR_UNKNOWN',
    message: 'Unknown error occurred'
  },
  1: {
    code: 'MEDIA_ERR_ABORTED',
    message: 'The fetching of the associated resource was aborted by the user\'s request'
  },
  2: {
    code: 'MEDIA_ERR_NETWORK',
    message: 'Some kind of network error occurred which prevented the media from being successfully fetched, despite having previously been available'
  },
  3: {
    code: 'MEDIA_ERR_DECODE',
    message: 'Despite having previously been determined to be usable, an error occurred while trying to decode the media resource, resulting in an error'
  },
  4: {
    code: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
    message: 'The associated resource or media provider object has been found to be unsuitable'
  }
}

function * onPlayPause (audioPlayer, { payload: srcUrl }) {
  const isPlaying = yield select(getIsPlaying)
  const currentSrcUrl = yield select(getSource)

  if (!srcUrl && !currentSrcUrl) {
    const stations = yield select(getStations)
    if (stations && stations.length > 0) {
      const [{ links }] = stations

      if (links.hq) srcUrl = links.hq
      else if (links.lq) srcUrl = links.lq
    }

    if (srcUrl) yield put(setSource(srcUrl))
  }

  if (srcUrl && currentSrcUrl !== srcUrl) {
    audioPlayer.src = srcUrl
    yield put(setSource(srcUrl))
    audioPlayer.play()
  } else {
    if (yield select(getPlaybackError)) {
      audioPlayer.load()
    }

    audioPlayer[isPlaying ? 'pause' : 'play']()
  }
}

function * onKeyPress ({ payload: key }) {
  if (key === 'play-pause') yield put(playPause())
}

function * onPlaybackError (audioPlayer) {
  let code = 0
  if (audioPlayer.error && audioPlayer.error.code) code = audioPlayer.error.code

  yield put(setPlaybackError(mediaErrors[code] || mediaErrors[0]))
}

function * onResetPlaybackError () {
  if (yield select(getPlaybackError)) {
    yield put(resetPlaybackError())
  }
}

function attachMediaEvents (store, audioPlayer) {
  const actionPrefix = actionTypes.PREFIX_ACTION_PLAYER_EVENT

  const events = Object.keys(actionTypes)
    .filter(name => name.startsWith(actionPrefix))
    .map(name => name.substr(actionPrefix.length))

  events.forEach(eventName =>
    audioPlayer.addEventListener(eventName.toLowerCase(), () =>
      store.dispatch({ type: actionTypes[actionPrefix + eventName] })
    )
  )
}

function attachMediaKeyPressHandlers (store) {
  ipcRenderer.on('media-key', (e, key) => store.dispatch({ type: actionTypes.KEY_PRESS, payload: key }))
}

module.exports = function * mySaga (store) {
  const audioPlayer = new Audio()

  attachMediaEvents(store, audioPlayer)
  attachMediaKeyPressHandlers(store)

  yield [
    takeEvery(actionTypes.PLAY_PAUSE, onPlayPause, audioPlayer),
    takeEvery(actionTypes.KEY_PRESS, onKeyPress),
    takeEvery(actionTypes.PLAYER_EVENT_ERROR, onPlaybackError, audioPlayer),
    takeEvery(
      ({ type }) => type.startsWith(actionTypes.PREFIX_PLAYER_EVENT) && type !== actionTypes.PLAYER_EVENT_ERROR,
      onResetPlaybackError
    )
  ]
}

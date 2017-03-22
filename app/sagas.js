'use strict'

const { ipcRenderer } = require('electron')

const { takeEvery, select, put } = require('redux-saga/effects')
const actionTypes = require('./constants')
const { playPause, setSource } = require('./actions')

function * onPlayPause (audioPlayer, { payload: srcUrl }) {
  const isPlaying = yield select((state) => state.isPlaying)
  const currentSrcUrl = yield select((state) => state.source)

  if (!srcUrl && !currentSrcUrl) {
    const stations = yield select((state) => state.stations)
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
    audioPlayer[isPlaying ? 'pause' : 'play']()
  }
}

function * onKeyPress ({ payload: key }) {
  if (key === 'play-pause') yield put(playPause())
}

function attachMediaEvents (store, audioPlayer) {
  const eventsMap = {
    play: 'player/e/PLAY',
    playing: 'player/e/PLAYING',
    pause: 'player/e/PAUSE',
    waiting: 'player/e/WAITING',
    stalled: 'player/e/STALLED',
    error: 'player/e/ERROR'
  }

  Object.keys(eventsMap).forEach(eventName =>
    audioPlayer.addEventListener(eventName, () =>
      store.dispatch({ type: eventsMap[eventName] })
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
    takeEvery(actionTypes.KEY_PRESS, onKeyPress)
  ]
}

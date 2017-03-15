'use strict'

const { takeEvery, select, put } = require('redux-saga/effects')
const actionTypes = require('./constants')
const { setSource } = require('./actions')

function * playPause (audioPlayer, { payload: srcUrl }) {
  const isPlaying = yield select((state) => state.isPlaying)
  const source = yield select((state) => state.source)

  if (source !== srcUrl) {
    audioPlayer.src = srcUrl
    yield put(setSource(srcUrl))
    audioPlayer.play()
  } else {
    audioPlayer[isPlaying ? 'pause' : 'play']()
  }
}

function attachMediaEvents (store, audioPlayer) {
  const eventsMap = {
    play: 'player/e/PLAY',
    playing: 'player/e/PLAYING',
    pause: 'player/e/PAUSE',
    waiting: 'player/e/WAITING',
    stalled: 'player/e/STALLED'
  }

  Object.keys(eventsMap).forEach(eventName =>
    audioPlayer.addEventListener(eventName, () =>
      store.dispatch({ type: eventsMap[eventName] })
    )
  )
}

module.exports = function * mySaga (store) {
  const audioPlayer = new Audio()

  attachMediaEvents(store, audioPlayer)

  yield takeEvery(actionTypes.PLAY_PAUSE, playPause, audioPlayer)
}

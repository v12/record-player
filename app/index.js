'use strict'

const $ = require('jquery')

const { loadStations, setActiveStation, playPause } = require('./actions')
const { getStations, getIsPlaying, getSource, getPlaybackError } = require('./reducers')
const store = require('./store')()

const tpl = station => `
<div class="station">
  <div class="play-wrapper">
    <a class="play" href="#" />
  </div>
  <div class="title">
    ${station.name}
  </div>
</div>
`

const $root = $('#stations')

const $player = $('#player')

$player.find('.play-pause').on('click', (e) => {
  e.preventDefault()

  store.dispatch(playPause())
})

let prevState = {}
store.subscribe(() => {
  const state = store.getState()

  if (getStations(prevState) !== getStations(state)) {
    console.log('Stations list updated - rendering')

    $root.empty()

    getStations(state).forEach(station => {
      const $station = $(tpl(station))

      $station.css({
        color: station.colors.text,
        'background-color': station.colors.bg,
        'border-color': station.colors.border
      })

      $station.attr('data-station-id', station.short)

      $station.on('click', function (e) {
        e.preventDefault()

        store.dispatch(setActiveStation(station.short))
        store.dispatch(playPause(station.links.hq))
      })

      $root.append($station)
    })
  }

  if (getIsPlaying(prevState) !== getIsPlaying(state)) {
    if (!getIsPlaying(state)) {
      $root.find('.station.active').removeClass('active')
    } else {
      $root.find(`.station[data-station-id='${state.activeStation}']`).addClass('active')
    }

    $player.find('.play-pause').html(state.isPlaying ? '&#10074;&#10074;' : '&#9658;')
  }

  if (getSource(prevState) !== getSource(state)) {
    $player.find('.current-source').text(getSource(state))
  }

  if (getPlaybackError(prevState) !== getPlaybackError(state)) {
    const $error = $('#playback-error')

    const error = getPlaybackError(state)
    if (!error) {
      $error.hide()
    } else {
      const { code, message } = error
      $error.find('.code').text(code)
      $error.find('.message').text(message)
      $error.show()
    }
  }

  prevState = state
})

store.dispatch(loadStations())

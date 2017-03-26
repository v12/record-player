'use strict'

const $ = require('jquery')

const { loadStations, setActiveStation, playPause } = require('./actions')
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

  const { stations, source, isPlaying } = state

  if (prevState.stations !== stations) {
    console.log('Stations list updated - rendering')

    $root.empty()

    stations.forEach(station => {
      const $station = $(tpl(station))

      $station.css({
        color: station.colors.text,
        'background-color': station.colors.bg,
        'border-color': station.colors.border,
        'border-bottom': '3px solid'
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

  if (prevState.isPlaying !== isPlaying) {
    if (!isPlaying) {
      $root.find('.station.active').removeClass('active')
    } else {
      $root.find(`.station[data-station-id='${state.activeStation}']`).addClass('active')
    }

    $player.find('.play-pause').html(state.isPlaying ? '&#10074;&#10074;' : '&#9658;')
  }

  if (prevState.source !== source) {
    $player.find('.current-source').text(source)
  }

  prevState = state
})

store.dispatch(loadStations())

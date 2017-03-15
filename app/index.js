'use strict'

const $ = require('jquery')

const { loadStations, playPause } = require('./actions')
const store = require('./store')()

const tpl = station => `
<div class="station">
  <div class="play-wrapper">
    <button class="play" />
  </div>
  <div class="title">
    ${station.name}
  </div>
</div>
`

const $root = $('#stations')

let stations
store.subscribe(() => {
  let prevStations = stations
  stations = store.getState().stations

  if (prevStations !== stations) {
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

      $station.find('.play').on('click', function (e) {
        e.preventDefault()

        $('#stations').find(' .play').removeClass('active')
        const $el = $(this)
        $el.addClass('active')

        store.dispatch(playPause(station.links.hq))
      })

      $root.append($station)
    })
  }
})

store.dispatch(loadStations())

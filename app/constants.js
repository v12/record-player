const PREFIX_PLAYER_EVENT = 'player/e/'
const PREFIX_ACTION_PLAYER_EVENT = 'PLAYER_EVENT_'

const playerEvents = {};

['play', 'playing', 'pause', 'waiting', 'stalled', 'error']
  .forEach(eventName =>
    (playerEvents[PREFIX_ACTION_PLAYER_EVENT + eventName.toUpperCase()] = PREFIX_PLAYER_EVENT + eventName)
  )

module.exports = Object.assign({
  LOAD_STATIONS: 'LOAD_STATIONS',
  SET_ACTIVE_STATION: 'SET_ACTIVE_STATION',
  SET_SOURCE: 'SET_SOURCE',
  SET_PLAYBACK_ERROR: 'SET_PLAYBACK_ERROR',
  RESET_PLAYBACK_ERROR: 'RESET_PLAYBACK_ERROR',
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  PLAY_PAUSE: 'PLAY_PAUSE',
  KEY_PRESS: 'KEY_PRESS',

  PREFIX_PLAYER_EVENT,
  PREFIX_ACTION_PLAYER_EVENT
}, playerEvents)

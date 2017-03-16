'use strict'

const path = require('path')
const menubar = require('menubar')

const mb = menubar({
  dir: path.join(__dirname, 'app'),
  icon: path.join('assets', 'icon.ico'), // todo load PNG version on OS X
  tooltip: 'Radio Record',
  preloadWindow: true
})

mb.on('ready', function ready () {
  console.log('app is ready')
})

mb.on('after-create-window', () => {
  mb.window.openDevTools({ detach: true })
})

'use strict'

const { ipcMain } = require('electron')
const path = require('path')
const menubar = require('menubar')

const mb = menubar({
  dir: path.join(__dirname, 'app'),
  icon: path.join('assets', 'icon.ico'), // todo load PNG version on OS X
  tooltip: 'Readio Record',
  preloadWindow: true
})

mb.on('ready', function ready () {
  console.log('app is ready')
})

mb.on('after-create-window', () => {
  mb.window.openDevTools({ detach: true })
  ipcMain.on('get-stations', (event) => {
    event.sender.send('stations', { test: { obj: true } })
  })
})

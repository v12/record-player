'use strict'

const { globalShortcut } = require('electron')
const path = require('path')
const menubar = require('menubar')

const mb = menubar({
  dir: path.join(__dirname, 'app'),
  icon: path.join(__dirname, 'assets', `icon.${process.platform !== 'darwin' ? 'ico' : 'png'}`),
  tooltip: 'Radio Record',
  preloadWindow: true
})

mb.on('ready', function ready () {
  console.log('app is ready')
})

mb.on('after-create-window', () => {
  mb.window.openDevTools({ detach: true })

  globalShortcut.register(
    'MediaPlayPause',
    () => mb.window.webContents.send('media-key', 'play-pause')
  )
})

mb.app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

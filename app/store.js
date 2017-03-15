'use strict'

const {combineReducers, applyMiddleware, createStore} = require('redux')
const createLogger = require('redux-logger')
const {'default': createSagaMiddleware} = require('redux-saga')
const mySaga = require('./sagas')

module.exports = () => {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    combineReducers(require('./reducers')),
    undefined,
    applyMiddleware(
      createLogger({collapsed: true}),
      sagaMiddleware
    )
  )

  sagaMiddleware.run(mySaga, store)

  return store
}

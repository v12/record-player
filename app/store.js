'use strict'

const { combineReducers, applyMiddleware, createStore } = require('redux')
const createLogger = require('redux-logger')
const { 'default': createSagaMiddleware } = require('redux-saga')
const mySaga = require('./sagas')

module.exports = () => {
  const sagaMiddleware = createSagaMiddleware()

  const reducers = require('./reducers')
  const reduxReducers = {}

  Object.keys(reducers).forEach(name => {
    if (!name.startsWith('get')) {
      reduxReducers[name] = reducers[name]
    }
  })

  const store = createStore(
    combineReducers(reduxReducers),
    undefined,
    applyMiddleware(
      createLogger({ collapsed: true }),
      sagaMiddleware
    )
  )

  sagaMiddleware.run(mySaga, store)

  return store
}

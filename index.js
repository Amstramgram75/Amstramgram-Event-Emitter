export default class AmstramgramEventEmitter {
  #events = {}

  #getEventListByName(eventName) {
    if (typeof this.#events[eventName] === 'undefined') {
      this.#events[eventName] = new Set()
    }
    return this.#events[eventName]
  }

  constructor() {}

  on(eventsNames, fn) {
    eventsNames.split(' ').forEach(eventName => {
      if (!this.#getEventListByName(eventName).has(fn)) {
        this.#getEventListByName(eventName).add(fn)
      }
    })
    return this
  }

  once(eventsNames, fn) {
    eventsNames.split(' ').forEach(eventName => {
      const onceFn = function (...args) {
        this.off(eventName, onceFn)
        fn.apply(this, args)
      }
      this.on(eventName, onceFn)
    })
  }

  off(eventsNames = '', fn = undefined) {
    if (eventsNames == '') {
      Object.keys(this.#events).forEach(event => this.#events[event].clear())
    } else {
      eventsNames.split(' ').forEach(eventName => {
        if (fn == undefined) {
          this.#getEventListByName(eventName).clear()
        } else {
          this.#getEventListByName(eventName).delete(fn)
        }
      })
    }
  }

  emit(eventName, ...args) {
    this.#getEventListByName(eventName).forEach(function (fn) {
      fn.apply(this, args)
    }.bind(this))
    return this
  }
}
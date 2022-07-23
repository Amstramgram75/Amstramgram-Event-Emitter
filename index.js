export default class AmstramgramEventEmitter {
  #events = {}

  #getEventListByName(eventName) {
    if (typeof this.#events[eventName] === 'undefined') {
      this.#events[eventName] = new Set()
    }
    return this.#events[eventName]
  }

  on(eventsNames, fn) {
    const self = this
    eventsNames.split(' ').forEach(eventName => {
      if (!self.#getEventListByName(eventName).has(fn)) {
        self.#getEventListByName(eventName).add(fn)
      }
    })
    return this
  }

  once(eventsNames, fn) {
    const self = this
    eventsNames.split(' ').forEach(eventName => {
      const onceFn = function (...args) {
        self.off(eventName, onceFn)
        fn.apply(self, args)
      }
      this.on(eventName, onceFn)
    })
  }

  off(eventName, fn) {
    this.#getEventListByName(eventName).delete(fn)
  }

  emit(eventName, ...args) {
    this.#getEventListByName(eventName).forEach(function (fn) {
      fn.apply(this, args)
    }.bind(this))
    return this
  }
}
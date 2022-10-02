export default class AmstramgramEventEmitterLight {
  /***********************************
   *             PRIVATE             *
   ***********************************/
  #events = {}


  /***********************************
   *           CONSTRUCTOR           *
   ***********************************/
  constructor() {}


  /***********************************
   *              METHODS            *
   ***********************************/
  /**
   * @param {String} eventsNames : list of events names separated by a space
   * @param {Function} callback : callback to be registered for the given events
   * @returns this so methods can be chained
   */
  on(eventsNames, callback) {
    eventsNames.split(' ').forEach(eventName => {
      this.#events[eventName] = this.#events[eventName] || new Set()
      this.#events[eventName].add(callback)
    })
    return this
  }

  /**
   * @param {String} eventsNames @default {''} : list of events names separated by a space
   * If empty string, all the callbacks for all the events are unregistered
   * @param {function} callback @default {undefined} : callback to be unregistered for the given events
   * If undefined, all the callbacks for all the given events are unregistered
   * @returns this so methods can be chained
   */
  off(eventsNames = '', callback = undefined) {
    if (eventsNames == '') {
      this.#events = {}
    } else {
      eventsNames.split(' ').forEach(eventName => {
        if (typeof this.#events[eventName] !== 'undefined') {
          if (callback == undefined) {
            delete this.#events[eventName]
          } else {
            this.#events[eventName].delete(callback)
            if (this.#events[eventName].size == 0) delete this.#events[eventName]
          }
        }
      })
    }
    return this
  }

  /**
   * @param {String} eventName 
   * @param  {...any} args applied to the callbacks
   * @returns this so methods can be chained
   */
  emit(eventName, ...args) {
    if (this.#events[eventName] !== 'undefined') {
      this.#events[eventName].forEach(function (callback) {
        callback.apply(this, args)
      }.bind(this))
    }
    return this
  }
}
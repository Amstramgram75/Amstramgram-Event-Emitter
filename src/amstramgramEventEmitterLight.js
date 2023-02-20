export default class AmstramgramEventEmitterLight {
  /***********************************
   *             PRIVATE             *
   ***********************************/

  /**
   * @description Associates eventNames and their callbacks
   * @property eventName
   * @value {Set} set of callbacks
   */
  #events = {}

  //Stores all the registered eventNames
  #eventsNames = new Set()

  /***********************************
   *        PRIVATE METHODS          *
   ***********************************/
  /**
   * Utility function to register events/callbacks set with the on() and once() methods
   * @param {String} eventsNames 
   * @param {Function} callback 
   */
  #registerEvents(eventsNames, callback) {
    eventsNames.split(' ').forEach(eventName => {
      //Build a new set of all the registered callbacks for eventName
      const callbacks = (this.#events[eventName] || new Set())
      if (!callbacks.has(callback)) {//If the callback is not yet registered
        const set = this.#events[eventName] || (this.#events[eventName] = new Set())
        set.add(callback)
        this.#updateEvents()
      }
    })
  }

  /**
   * Update #eventsNames
   * each time an event/callback is added or removed
   */
  #updateEvents() {
    this.#eventsNames = new Set([...Object.keys(this.#events)])
  }

  /**
   * Utility function to remove all the events and their callbacks
   */
  #unregisterAll() {
    Object.keys(this.#events).forEach(eventName => this.#unregisterEvent(eventName))
  }

  /**
   * Utility function to remove all the callbacks of a given event
   * @param {String} eventName : event to be cleaned
   */
  #unregisterEvent(eventName) {
    if (typeof this.#events[eventName] !== "undefined") {
      this.#events[eventName].forEach(callback => {
        this.#unregisterCallback(eventName, callback, true)
      })
    }
  }

  /**
   * Utility function to remove a specific callback of a given event
   * @param {String} eventName 
   * @param {Function} callback : callback to be removed for the given event
   * @param {Boolean} internal : true if called from the internal private function #unregisterEvent
   */
  #unregisterCallback(eventName, callback, internal = false) {
    if (internal || typeof this.#events[eventName] !== "undefined") {
      this.#events[eventName].delete(callback)
      if (this.#events[eventName].size == 0) delete this.#events[eventName]
      this.#updateEvents()
    }
  }


  /***********************************
   *           CONSTRUCTOR           *
   ***********************************/
  constructor() { }


  /***********************************
   *              GETTERS            *
   ***********************************/
  /**
   * @return {Object}
   * Returns an object which contains all the registered events and their callbacks
   * {
   *  eventName01 :  set listing the registered callbacks,
   *  ......
   *  eventName0n : set listing the registered callbacks
   * }
   */
  get eventsAndCallbacks() {
    return this.#events
  }

  /**
   * @return {Set}
   * Return a Set of all the registered events names
   */
  get events() {
    return this.#eventsNames
  }


  /***********************************
   *              METHODS            *
   ***********************************/
  /**
   * @param {String} eventsNames : list of events names separated by a space
   * @param {Function} callback : callback to be registered for the given events
   * @returns this so methods can be chained
   */
  on(eventsNames, callback) {
    this.#registerEvents(eventsNames, callback)
    return this
  }

  /**
   * @param {String | function} [eventsNames = ''] : list of events names separated by a space
   * If empty string, all the callbacks for all the events are unregistered
   * If it's a function, it's treated as a callback. This callback is removed for all registered events.
   * @param {Function} [callback = undefined] - callback to be unregistered for the given events
   * If undefined, all the callbacks for all the given events are unregistered
   * @returns this so methods can be chained
   */
  off(eventsNames = '', callback = undefined) {
    if (typeof eventsNames === 'string') {
      if (eventsNames == '') {
        this.#unregisterAll()
      } else {
        eventsNames.split(' ').forEach(eventName => {
          if (callback == undefined) {
            this.#unregisterEvent(eventName)
          } else {
            this.#unregisterCallback(eventName, callback)
          }
        })
      }
    } else if (typeof eventsNames === 'function') {
      this.#eventsNames.forEach(eventName => this.#unregisterCallback(eventName, eventsNames))
    }
    return this
  }

  /**
   * @param {String} eventName 
   * @param  {...any} args applied to the callbacks
   * @returns this so methods can be chained
   */
  emit(eventName, ...args) {
    if (typeof this.#events[eventName] !== "undefined") {
      //https://underscorejs.org/docs/modules/isObject.html
      function isObject(obj) {
        const type = typeof obj
        return type === 'function' || (type === 'object' && !!obj)
      }
      this.#events[eventName].forEach(function (callback) {
        //If there is only one argument and if it's an object
        if (args.length == 1 && isObject(args[0])) {
          //Add a eventName property holding the event name
          args[0].eventName = eventName
        } else {
          //Add the event name to the list of argument
          args.push(eventName)
        }
        callback.apply(this, args)
      }.bind(this))
    }
    return this
  }
}
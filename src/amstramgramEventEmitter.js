export default class AmstramgramEventEmitter {
  /***********************************
   *             PRIVATE             *
   ***********************************/

  /**
   * @description Associates eventNames and their callbacks
   * @property eventName
   * @value {Set} set of callbacks
   */
  #events = {}

  /**
   * @description Associates eventNames and their 'once' callbacks
   * @property eventName
   * @value {Set} set of 'once' callbacks
   */
  #eventsOnce = {}

  //Stores all the registered eventNames
  #eventsNames = new Set()

  /**
   * @description Associates eventNames and their callbacks
   * @property eventName
   * @value {Object}
   *    @property callbacks
   *    @value {Set} set of callbacks
   *    @property callbacksOnce
   *    @value {Set} set of 'once' callbacks
   */
  #eventsAndCallbacks = {}

  /**
   * {String} name of the event to emit when a new pair event/callback is added
   * the event is emitted with an information object
   *  @property {String} event - name of the event
   *  @property {Function} callback
   *  @property {Boolean} success
   *  @property {Object} list - eventsAndCallbacks
   */
  #eventAdded

  /**
   * {String} name of the event to emit when a callback is removed
   * the event is emitted with an information object
   *  @property {String} event - name of the event
   *  @property {Function} callback
   *  @property {Boolean} success
   *  @property {Object} list - eventsAndCallbacks
   */
  #eventRemoved


  /***********************************
   *        PRIVATE METHODS          *
   ***********************************/
  /**
   * Utility function to register events/callbacks set with the on() and once() methods
   * @param {String} eventsNames 
   * @param {Function} callback 
   * @param {Boolean} [once = false]
   */
  #registerEvents(eventsNames, callback, once = false) {
    eventsNames.split(' ').forEach(eventName => {
      let added = false
      //Build a new set of all the registered callbacks for eventName
      const union = new Set([...(this.#events[eventName] || new Set()), ...(this.#eventsOnce[eventName] || new Set())])
      if (!union.has(callback)) {//If the callback is not yet registered
        added = true
        //Get a reference to the events object in accordance with the once parameter
        const eventsCollection = once ? this.#eventsOnce : this.#events,
          set = eventsCollection[eventName] || (eventsCollection[eventName] = new Set())
        set.add(callback)
        this.#updateEventsAndCallbacksList()
      }
      //Emit the eventadded event
      if (this.#eventAdded) this.emit(this.#eventAdded, { event: eventName, callback: callback, success: added, list: this.#eventsAndCallbacks })
    })
  }

  /**
   * Update #eventsNames Set and #eventsAndCallbacks Object
   * each time an event/callback is added or removed
   */
  #updateEventsAndCallbacksList() {
    this.#eventsAndCallbacks = {}
    this.#eventsNames = new Set([...Object.keys(this.#events), ...Object.keys(this.#eventsOnce)])
    this.#eventsNames.forEach(eventName => {
      const o = {}
      o.callbacks = this.#events[eventName] || new Set()
      o.callbacksOnce = this.#eventsOnce[eventName] || new Set()
      if (o.callbacks.size > 0 || o.callbacksOnce.size > 0) this.#eventsAndCallbacks[eventName] = o
    })
  }

  /**
   * Utility function to remove all the events and their callbacks
   */
  #unregisterAll() {
    //Build a list of all the registered events except eventRemoved
    //This way, eventRemoved can be emitted during events deletion
    const allEventsExceptRemoved = [...this.#eventsNames].filter(eventName => eventName != this.#eventRemoved)
    allEventsExceptRemoved.forEach(eventName => this.#unregisterEvent(eventName))
    //Finish the cleaning by removing eventRemoved
    this.#unregisterEvent(this.#eventRemoved)
  }

  /**
   * Utility function to remove all the callbacks of a given event
   * @param {String} eventName : event to be cleaned
   */
  #unregisterEvent(eventName) {
    if (this.#eventsNames.has(eventName)) {
      [this.#events, this.#eventsOnce].forEach(eventsCollection => {
        if (typeof eventsCollection[eventName] !== "undefined") {
          eventsCollection[eventName].forEach(callback => {
            this.#unregisterCallback(eventName, callback, true, eventsCollection)
          })
        }
      })
    } else {
      if (this.#eventRemoved) this.emit(this.#eventRemoved, { event: eventName, callback: '', success: false, list: this.#eventsAndCallbacks })
    }
  }

  /**
   * Utility function to remove a specific callback of a given event
   * @param {String} eventName 
   * @param {Function} callback : callback to be removed for the given event
   * @param {Boolean} internal : true if called from the internal private function #unregisterEvent
   * @param {Object} eventsCollection : this.#events or this.#eventsOnce
   */
  #unregisterCallback(eventName, callback, internal = false, eventsCollection = undefined) {
    let removed = false
    if (internal || this.#eventsNames.has(eventName)) {
      if (eventsCollection == undefined) {
        //Is it a 'once' callback ?
        //We can't use this.#events[eventName].has(callback) simply because
        //this.#events[eventName] can be undefined
        eventsCollection = (this.#eventsAndCallbacks[eventName].callbacks.has(callback)) ? this.#events : this.#eventsOnce
      }
      if (internal || typeof eventsCollection[eventName] !== "undefined") {
        removed = eventsCollection[eventName].delete(callback)
        if (eventsCollection[eventName].size == 0) delete eventsCollection[eventName]
        this.#updateEventsAndCallbacksList()
        if (this.#eventRemoved) this.emit(this.#eventRemoved, { event: eventName, callback: callback, success: true, list: this.#eventsAndCallbacks })
      }
    }
    if (!removed && this.#eventRemoved) this.emit(this.#eventRemoved, { event: eventName, callback: callback, success: false, list: this.#eventsAndCallbacks })
  }




  /***********************************
   *           CONSTRUCTOR           *
   ***********************************/
  /**
   * @param {String} [eventAdded = "eventadded"] name of the event emitted when a new event/callback is added.
   * If it's an empty string or not a string, no event will be dispatched when a event/callback is registered.
   * @param {String} [eventRemoved = "eventremoved"] name of the event emitted when a new event/callback is removed.
   * If it's an empty string or not a string, no event will be dispatched when a event/callback is unregistered.
   */
  constructor(eventAdded = 'eventadded', eventRemoved = 'eventremoved') {
    //check if the parameters are string without spaces
    this.#eventAdded = typeof eventAdded === 'string' && !/\s/g.test(eventAdded) ? eventAdded : ''
    this.#eventRemoved = typeof eventRemoved === 'string' && !/\s/g.test(eventRemoved) ? eventRemoved : ''
  }


  /***********************************
   *              GETTERS            *
   ***********************************/
  /**
   * @return {Object}
   * Returns an object which contains all the registered events and their callbacks
   * {
   *  eventName01 : {
   *    callbacks : set listing the registered callbacks
   *    callbacksOnce : set listing the registered callbacks once
   *  },
   *  ......
   *  eventName0n : {
   *    callbacks : set listing the registered callbacks
   *    callbacksOnce : set listing the registered callbacks once
   *  }
   * }
   */
  get eventsAndCallbacks() {
    return this.#eventsAndCallbacks
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
   * @param {String} eventsNames - list of events names separated by a space 
   * @param {Function} callback - callback to be registered once for the given events
   * @returns this so methods can be chained
   */
  once(eventsNames, callback) {
    this.#registerEvents(eventsNames, callback, true)
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
    if (this.#eventsNames.has(eventName)) {
      //https://underscorejs.org/docs/modules/isObject.html
      function isObject(obj) {
        const type = typeof obj
        return type === 'function' || (type === 'object' && !!obj)
      }
      [this.#eventsOnce[eventName], this.#events[eventName]].forEach((set, id) => {
        if (typeof set !== "undefined") {
          set.forEach(function (callback) {
            if (id == 0) {//Once
              this.#unregisterCallback(eventName, callback, true, this.#eventsOnce)
            }
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
      })
    }
    return this
  }
}
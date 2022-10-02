export default class AmstramgramEventEmitter {
  /***********************************
   *             PRIVATE             *
   ***********************************/
  #events = {}
  #eventsOnce = {}
  #eventAdded
  #eventRemoved

  


  /***********************************
   *        PRIVATE METHODS          *
   ***********************************/
  /**
   * Utility function to register events/callbacks set with the on() and once() methods
   * @param {*} eventsNames 
   * @param {*} callback 
   * @param {*} once 
   */
  #registerEvents(eventsNames, callback, once = false) {
    eventsNames.split(' ').forEach(eventName => {
      let added = false
      const
        //Collect the registered callbacks for the given eventName. If none, define a new Set
        events = this.#events[eventName] || new Set(),
        //Collect the registered once callbacks for the given eventName. If none, define a new Set
        eventsOnce = this.#eventsOnce[eventName] || new Set(),
        //union is a new set of the all the registered callbacks
        union = new Set([...eventsOnce, ...events]),
        //Get a reference to the events object in accordance with the once parameter
        eventsCollection = once ? this.#eventsOnce : this.#events,
        //Get a reference to the set. If it not yet exists, instantiate a new one
        set =  eventsCollection[eventName] || (eventsCollection[eventName] = new Set())
      if (!union.has(callback)) {//If the callback is not yet registered
        added = true
        set.add(callback)
      }
      //Emit the eventadded event
      if (this.#eventAdded) this.emit(this.#eventAdded, {event: eventName, callback: callback, success: added, list: this.eventsAndCallbacksList})
    })
  }

  /**
   * Utility function to remove all the events and their callbacks
   */
  #unregisterAll() {
    [this.#events, this.#eventsOnce].forEach(eventCollection => {
      Object.keys(eventCollection).forEach(eventName => {
        eventCollection[eventName].forEach(callback => {
          eventCollection[eventName].delete(callback)
          if (this.#eventRemoved) this.emit(this.#eventRemoved, {event: eventName, callback: callback, success: true, list: this.eventsAndCallbacksList})
        })
        delete eventCollection[eventName]
      })
    })
  }

  /**
   * Utility function to remove all the callbacks of a given event
   * @param {String} eventName : event to be cleaned
   */
  #unregisterEvent(eventName) {
    let removed = false
    [this.#events, this.#eventsOnce].forEach(eventsCollection => {
      if (typeof eventsCollection[eventName] !== 'undefined') {
        eventsCollection[eventName].forEach(callback => {
          eventsCollection[eventName].delete(callback)
          removed = true
          if (this.#eventRemoved) this.emit(this.#eventRemoved, {event: eventName, callback: callback, success: true, list: this.eventsAndCallbacksList})
        })
        delete eventsCollection[eventName]
      }
    })
    if (!removed && this.#eventRemoved) this.emit(this.#eventRemoved, {event: eventName, callback: '', success: false, list: this.eventsAndCallbacksList})
  }

  /**
   * Utility function to remove a specific callback of a given event
   * @param {String} eventName 
   * @param {Function} callback : callback to be removed for the given event
   */
  #unregisterCallback(eventName, callback) {
    let removed = false;
    [this.#events, this.#eventsOnce].forEach(eventsCollection => {
     if (typeof eventsCollection[eventName] !== 'undefined') {
        eventsCollection[eventName].delete(callback)
        if (eventsCollection[eventName].size == 0) delete eventsCollection[eventName]
        removed = true
        if (this.#eventRemoved) this.emit(this.#eventRemoved, {event: eventName, callback: callback, success: removed, list: this.eventsAndCallbacksList})
      }
    })
    if (!removed && this.#eventRemoved) this.emit(this.#eventRemoved, {event: eventName, callback: callback, success: removed, list: this.eventsAndCallbacksList})
  }




  /***********************************
   *           CONSTRUCTOR           *
   ***********************************/
  /**
   * @param {String} eventAdded : name of the event emitted when a new event/callback is added
   * If it's an empty string or not a string, no event will be dispatched
   * @param {String} eventRemoved: name of the event emitted when a new event/callback is removed 
   * If it's an empty string or not a string, no event will be dispatched
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
  get eventsAndCallbacksList() {
    let list = {},
      eventNamesArrays = [Object.keys(this.#events), Object.keys(this.#eventsOnce).filter(eventName => !Object.keys(this.#events).includes(eventName))]
    eventNamesArrays.forEach(array => array.forEach(eventName => {
      let o = {}
      o.callbacks = this.#events[eventName] || new Set()
      o.callbacksOnce = this.#eventsOnce[eventName] || new Set()
      if (o.callbacks.size > 0 || o.callbacksOnce.size > 0) list[eventName] = o
    }))
    return list
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
   * @param {String} eventsNames : list of events names separated by a space 
   * @param {*} callback : callback to be registered once for the given events
   * @returns this so methods can be chained
   */
  once(eventsNames, callback) {
    this.#registerEvents(eventsNames, callback, true)
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
    return this
  }

  /**
   * @param {String} eventName 
   * @param  {...any} args applied to the callbacks
   * @returns this so methods can be chained
   */
  emit(eventName, ...args) {
    [this.#eventsOnce[eventName], this.#events[eventName]].forEach((set, id) => {
      if (typeof set !== 'undefined') {
        set.forEach(function (callback) {
          callback.apply(this, args)
          if (id == 0) {//Once
            set.delete(callback)
            if (set.size == 0) delete this.#eventsOnce[eventName]
          }
        }.bind(this))
      }
    })
    return this
  }
}
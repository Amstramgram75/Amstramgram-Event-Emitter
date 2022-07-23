**A very simple EventEmitter in pure JavaScript with ES6 class implementation.**

Inspiration is taken from [https://gist.github.com/mudge/5830382#gistcomment-2691957](https://gist.github.com/mudge/5830382#gistcomment-2691957)

# USAGE

```
import { default as EventEmitter } from "AmstramgramEventEmitter";

class MyEventEmitter extends EventEmitter {
  constructor() {
    //some code...

    super()

    //your code...
  }
}
```
# METHODS
___
:black_medium_small_square: __on(eventsNames, fn)__&ensp;&ensp;{string, function}

Sets up a function that will be called whenever one of the specified events is emitted.

_eventsNames_ can be either a single event name or several events names separated by a space.

Example :
```
myEventEmitter.on('click', _ => console.log('CLICK)))
myEventEmitter.on('mouseup mousedown', _ => console.log('Mouse Up or Down')))
```
___
:black_medium_small_square: __once(eventsNames, fn)__&ensp;&ensp;{string, function}

Sets up a function that will be called only once for each event name provided.

_eventsNames_ can be either a single event name or several events names separated by a space.

Example :
```
myEventEmitter.once('mouseup mousedown', _ => console.log('Mouse Up or Down')))
```
___
:black_medium_small_square: __off(eventsNames, fn)__&ensp;&ensp;{string, function}

Removes an event listener previously registered

_eventsNames_ can be either a single event name or several events names separated by a space.

Example :
```
myEventEmitter.once('mouseup mousedown', _ => console.log('Mouse Up or Down')))
```
___

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
:black_medium_small_square: __on(eventsNames, fn)&ensp;&ensp;{String, function}  
___

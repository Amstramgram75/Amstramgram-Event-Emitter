
import { default as EventEmitter } from '../../index.js'

const 
	finalInitCounterValue = 1,
	w = window
let initCounter = 0

w.addEventListener('load', _ => {
	init('Window load event dispatched')
})

function init (str) {
	console.log(str)
	initCounter ++
  if (initCounter < finalInitCounterValue) return
	console.log('init function start')
}
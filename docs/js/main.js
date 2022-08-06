
import { default as EventEmitter } from '../../index.js'
import Button from './import/button.js'
import Dot from './import/dot.js'

const
	finalInitCounterValue = 1,
	w = window,
	html = document.querySelector('html'),
	canvas = document.querySelector('.content canvas'),
	ctx = canvas.getContext('2d'),
	buttonsContainer = document.querySelector('.buttons-container')
let initCounter = 0, canvasX, canvasY


let events = {
	move: {
		name: 'mousemove',
		id: 'move',
		description: 'Mouse is moving',
		radius: 20,
		duration: 5000,
		strokeColor: '#a10304'
	},
	move2: {
		name: 'mousemove',
		id: 'move',
		description: 'Mouse is moving 2',
		radius: 10,
		duration: 5000,
		strokeColor: 'white'
	},
	down: {
		name: 'mousedown',
		id: 'down',
		description: 'Mouse is down',
		radius: 60,
		duration: 1000,
		strokeColor: '#57a64a'
	},
	up: {
		name: 'mouseup',
		id: 'up',
		description: 'Mouse is up',
		radius: 60,
		duration: 1000,
		strokeColor: '#569cd6',
		grow: true
	},
	click: {
		name: 'click',
		id: 'click',
		description: 'Mouse click',
		radius: 30,
		duration: 1000,
		strokeColor: 'transparent',
		fillColor: '#dd8614'
	},
	enter: {
		name: 'mouseenter',
		id: 'enter',
		description: 'Mouse enter',
		radius: 40,
		duration: 1000,
		strokeColor: '#f9e239',
		grow: true
	},
	leave: {
		name: 'mouseleave',
		id: 'leave',
		description: 'Mouse leave',
		radius: 40,
		duration: 1000,
		strokeColor: '#1e5099',
		grow: true
	},
}

w.addEventListener('load', _ => {
	init('Window load event dispatched')
})

function init(str) {
	console.log(str)
	initCounter++
	if (initCounter < finalInitCounterValue) return
	console.log('init function start')
	Button.container = document.querySelector('.buttons-container')
	Button.emitter = new EventEmitter()
	Button.callback = createDot

	new Button([events.move], 'move')
	new Button([events.move2], 'move2')
	new Button([events.down, events.up, events.click], 'downupclick')
	new Button([events.enter, events.leave], 'enterleave')
	const unwatchHTML = `<div class="button-wrapper unwatch-all"><div class="button"><span>Unwatch All</span></div></div>`
	Button.container.insertAdjacentHTML('beforeend', unwatchHTML)
	Button.container.querySelector('.unwatch-all span').addEventListener('click', _ => {
		Button.emitter.off()
		Button.reset()
	})
	w.addEventListener('resize', resize)
	w.addEventListener('scroll', getCanvasPosition)
	Dot.ctx = ctx
	resize()

	html.addEventListener('transitionend', function clean() {
		html.classList.remove('loading')
		html.classList.remove('loaded')
		html.removeEventListener('transitionend', clean)
	})
	html.classList.add('loaded')

}

function createDot(event, e) {
	new Dot(e.clientX - canvasX, e.clientY - canvasY, event.radius, event.duration, event.strokeColor, event.fillColor, event.grow)
	if (Dot.dots.size == 1) requestAnimationFrame(anim)
}

function anim() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	Dot.draw()
	if (Dot.dots.size > 0) requestAnimationFrame(anim)
}

function resize() {
	canvas.width = Math.min(1400, (0.9 * w.innerWidth)) - 440
	getCanvasPosition()
}

function getCanvasPosition() {
	let canvasRect = canvas.getBoundingClientRect()
	canvasX = canvasRect.x
	canvasY = canvasRect.y
}
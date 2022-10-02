
import { default as EventEmitter } from '../../index-min.js'
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

const buttons = {
	//First move watcher
	Move: [//Id of the button-wrapper : it must be unique. Used as id of the button-wrapper
		{
			eventName: 'mousemove',//MouseEvent name used for the canvas event listener
			id: 'move',//only necessary if there are several events. Used as id for the sub button. Must be unique.
			text: 'move with red',//text used for the button label. 
			eventDescription: 'Mouse is moving',//Description for log
			radius: 20,//radius of the circle in the canvas
			strokeColor: '#a10304',//strokeColor of the circle in the canvas
			//fillColor: '#a10304',//fillColor of the circle in the canvas. Default is transparent
			//grow: true,//The circle radius grows during animation. Default is false
			duration: 5000//Animation duration
		}
	],
	//Second move watcher
	Move2: [
		{
			eventName: 'mousemove',
			id: 'move2',
			text: 'move with white',
			eventDescription: 'Mouse is moving 2',
			radius: 10,
			strokeColor: 'white',
			duration: 5000
		}
	],
	//Down, Up, Click watcher
	DownUpClick: [
		{
			eventName: 'mousedown',
			id: 'down',
			text: 'down',
			eventDescription: 'Mouse is down',
			radius: 60,
			strokeColor: '#57a64a',
			duration: 1000
		},
		{
			eventName: 'mouseup',
			id: 'up',
			text: 'up',
			eventDescription: 'Mouse is up',
			radius: 60,
			strokeColor: '#569cd6',
			grow: true,
			duration: 1000
		},
		{
			eventName: 'click',
			id: 'click',
			text: 'click',
			eventDescription: 'Mouse click',
			radius: 30,
			strokeColor: 'transparent',
			fillColor: '#dd8614',
			duration: 1000,
		}
	],
	//Enter, Leave watcher
	EnterLeave: [
		{
			eventName: 'mouseenter',
			id: 'enter',
			text: 'enter',
			eventDescription: 'Mouse enter',
			radius: 40,
			strokeColor: '#f9e239',
			grow: true,
			duration: 1000
		},
		{
			eventName: 'mouseleave',
			id: 'leave',
			text: 'leave',
			eventDescription: 'Mouse leave',
			radius: 40,
			strokeColor: '#1e5099',
			grow: true,
			duration: 1000,
		},
	]
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

	const emitter = new EventEmitter('onEventAdded', 'onEventRemoved')

	Object.keys(buttons).forEach(wrapperId => {
		let buttonWrapper = new Button(buttons[wrapperId], wrapperId)
		buttons[wrapperId].forEach(button => {
			document.querySelector('canvas').addEventListener(button.eventName, e => {
				emitter.emit(button.eventName + '-' + wrapperId, button, e)
			})
		})
		buttonWrapper.on('click', props => {
			const
				on = props[0].on,
				once = props[0].once
			let events = []
			props.forEach(prop => events.push(prop.eventName + '-' + wrapperId))
			events = events.join(' ')
			if (on) {
				if (once) {
					emitter.once(events, createDot)
				} else {
					emitter.on(events, createDot)
				}
			} else {
				emitter.off(events, createDot)
			}
		})
		buttonWrapper.on('subclick', prop => {
			if (prop.on) {
				if (prop.once) {
					emitter.once(prop.eventName + '-' + wrapperId, createDot)
				} else {
					emitter.on(prop.eventName + '-' + wrapperId, createDot)
				}
			} else {
				emitter.off(prop.eventName + '-' + wrapperId, createDot)
			}
		})
	})



	const unwatchHTML = `<div class="button-wrapper unwatch-all"><div class="button"><span>Unwatch All</span></div></div>`
	Button.container.insertAdjacentHTML('beforeend', unwatchHTML)
	Button.container.querySelector('.unwatch-all span').addEventListener('click', _ => {
		emitter.off()
		Button.reset()
		emitterInit()
	})
	function onEventAdded(eventInfo) {
		console.log('Event added :', eventInfo)
		Button.container.classList.toggle('show-unwatch-all', Object.keys(eventInfo.list).length > 2)
	}

	function onEventRemoved(eventInfo) {
		console.log('Event removed :', eventInfo)
		Button.container.classList.toggle('show-unwatch-all', Object.keys(eventInfo.list).length > 2)
	}

	function emitterInit(){
		emitter
			.on('onEventAdded', onEventAdded)
			.on('onEventRemoved', onEventRemoved)
	}
	emitterInit()


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
	if (event.once) event.owner.active = false
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
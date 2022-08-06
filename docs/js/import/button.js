import Dot from './dot.js'


export default class Button {
	static #buttons = []
	static emitter
	static container
	static callback
	static reset(){
		Button.#buttons.forEach(b => {
			if (b.#active) b.#toggle()
		})
	}
	#active = false
	#events
	#name
	#actions
	#actionsOn
	#buttonWrapper
	#button
	#buttonInner
	#input
	#callback = (event, e) => {
		console.log(event.description, e)
		Button.callback.call(this, event, e)
	}
	#callbackOnce = (event, e) => {
		console.log(event.description, e)
		Button.callback.call(this, event, e)
		this.#actionsOn.delete(event.id)
		if (this.#actionsOn.size == 0) {
			this.#toggle()
		} else if (this.#buttonWrapper.querySelector(`.subs>span.${event.id}`)) {
			this.#buttonWrapper.querySelector(`.subs>span.${event.id}`).classList.remove('active')
		}
	}
	#getLabel() {
		let label = ``,
			currentActions = this.#actions.filter(action => this.#actionsOn.has(action))
		currentActions.forEach((action, id) => {
			if (id == 0) {
				label = action
			} else if (id < currentActions.length - 1) {
				label += ', ' + action
			} else {
				label += (' and ' + action)
			}
		})
		return label
	}
	#toggle() {
		this.#active = !this.#active
		this.#buttonWrapper.classList.toggle('active', this.#active)
		this.#buttonWrapper.classList.remove('hide-input')
		if (this.#active) {
			if (this.#input) this.#input.disabled = true
			if (this.#input && this.#input.checked) {
				this.#input.disabled = true
				this.#events.forEach(event => {
					Button.emitter.once(event.name + this.#name, this.#callbackOnce)
				})
			} else {
				this.#buttonWrapper.classList.add('hide-input')
				this.#events.forEach(event => {
					Button.emitter.on(event.name + this.#name, this.#callback)
				})
			}
			this.#buttonInner.innerHTML = 'Unwatch mouse ' + this.#getLabel()
			this.#buttonWrapper.querySelectorAll('.subs>span').forEach((b, id) => {
				b.innerHTML = `Unwatch<br>${this.#actions[id]}`
				b.classList.add('active')
			})
		} else {
			if (this.#input) this.#input.disabled = false
			const callback = (this.#input && this.#input.checked) ? this.#callbackOnce : this.#callback
			this.#events.forEach(event => {
				Button.emitter.off(event.name + this.#name, callback)
			})
			this.#actionsOn = new Set(this.#actions)
			this.#buttonInner.innerHTML = 'Watch mouse ' + this.#getLabel()
		}
		const activeButtons = Button.#buttons.filter(b => b.#active)
		Button.container.classList.toggle('show-unwatch-all', activeButtons.length > 1)
	}
	#toggleSub(button, event) {
		const eventName = event.name,
			action = event.id
		if (this.#actionsOn.has(action)) {
			this.#actionsOn.delete(action)
			button.innerHTML = `Watch<br>${action}`
			button.classList.remove('active')
			Button.emitter.off(eventName + this.#name)
		} else {
			this.#actionsOn.add(action)
			button.innerHTML = `Unwatch<br>${action}`
			button.classList.add('active')
			const callback = (this.#input && this.#input.checked) ? this.#callbackOnce : this.#callback
			Button.emitter.on(eventName + this.#name, callback)
		}
		if (this.#actionsOn.size == 0) {
			this.#toggle()
		} else {
			this.#buttonInner.innerHTML = 'Unwatch mouse ' + this.#getLabel()
		}
	}
	constructor(events, name) {
		Button.#buttons.push(this)
		this.#events = events
		this.#name = name
		this.#actions = []
		events.forEach(e => this.#actions.push(e.id))
		this.#actionsOn = new Set(this.#actions)
		/**
		 * <div class="button-wrapper multi mousedownupclick">//this.#buttonWrapper
		 * 	<div class="button">//this.#button
		 * 		<span>//this.#buttonInner
		 * 			Watch mouse down, up and click
		 * 		</span>
		 * 		<label for="mousedownupclick">ONCE</label>
		 * 		<input type="checkbox" id="mousedownupclick" name="mousedownupclick">//this.#input
		 * 	</div>
		 * 	<div class="subs">
		 * 		<span>
		 * 			Unwatch<br>
		 * 			down
		 * 		</span>
		 * 		<span>
		 * 			Unwatch<br>
		 * 			up
		 * 		</span>
		 * 		<span>
		 * 			Unwatch<br>
		 * 			click
		 * 		</span>
		 * 	</div>
		 * </div>
		 */
		const buttonWrapperClass = this.#actions.length > 1 ? `button-wrapper multi ${name}` : `button-wrapper ${name}`
		let str = `<div class="${buttonWrapperClass}"><div class="button"><span>Watch mouse ${this.#getLabel(this.#actions)}</span><label for="${name}">ONCE</label><input type="checkbox" id="${name}" name="${name}"></div>`
		if (this.#actions.length > 1) {
			str += `<div class="subs">`
			this.#actions.forEach(action => {
				str += `<span class="${action}">Unwatch<br>${action}</span>`
			})
			str += `</div>`
		}
		str += `</div>`
		Button.container.insertAdjacentHTML('beforeend', str)
		this.#buttonWrapper = Button.container.querySelector(`.${name}`)
		this.#button = this.#buttonWrapper.querySelector(`.button`)
		this.#buttonInner = this.#buttonWrapper.querySelector(`.button>span`)
		this.#input = this.#buttonWrapper.querySelector(`.button>input`)
		this.#buttonInner.addEventListener('click', _ => this.#toggle())
		this.#buttonWrapper.querySelectorAll('.subs>span').forEach((b, id) => {
			b.addEventListener('click', _ => {
				this.#toggleSub(b, this.#events[id])
			})
		})
		this.#events.forEach((event) => {
			document.querySelector('canvas').addEventListener(event.name, e => {
				Button.emitter.emit(event.name + name, event, e)
			})
		})
	}
}

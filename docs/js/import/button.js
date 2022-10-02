import { default as EventEmitter } from './amstramgramEventEmitterLight-min.js'
import SubButton from './subButton.js'


export default class Button extends EventEmitter {
	static #buttons = []
	static container
	static reset() {
		Button.#buttons.forEach(b => {
			b.active = false
			b.#subButtons.forEach(sub => sub.active = false)
		})
	}
	#subButtons = []
	#active = false
	#disabled = false
	#props
	#buttonWrapper
	#buttonContainer
	#button
	#input
	#getLabel() {
		let label = this.#active ? `Unwatch mouse ` : `Watch mouse `,
			eventsToList = this.#active ? this.#props.filter(prop => prop.on) : this.#props
		eventsToList.forEach((ev, id) => {
			if (id == 0) {
				label += ev.text
			} else if (id < eventsToList.length - 1) {
				label += ', ' + ev.text
			} else {
				label += (' and ' + ev.text)
			}
		})
		return label
	}
	constructor(props, id) {
		super()
		props.forEach(prop => {
			prop.on = false
			prop.once = false
		})
		Button.#buttons.push(this)
		this.#props = props
		/**
		 * <div id="downUpClick" class="button-wrapper multi">//this.#buttonWrapper
		 * 	<div class="button">//this.#buttonContainer
		 * 		<span>//this.#button
		 * 			Watch mouse down, up and click
		 * 		</span>
		 * 		<label>
		 * 			ONCE
		 * 			<input type="checkbox">//this.#input
		 * 		</label>
		 * 	</div>
		 * 	<div class="subs">
		 * 		<div id="down">
		 * 			<span>
		 * 				<span>Unwatch</span>
		 *					<br>
		 * 				down
		 * 			</span>
     *    	<input type="checkbox" id="input-down">
     *    	<label for="input-down">ONCE</label>
		 * 		</div>
		 * 		<div id="up">
		 * 			<span>
		 * 				<span>Unwatch</span>
		 *					<br>
		 * 				up
		 * 			</span>
     *    	<input type="checkbox" id="input-up">
     *    	<label for="input-up">ONCE</label>
		 * 		</div>
		 * 		<div id="click">
		 * 			<span>
		 * 				<span>Unwatch</span>
		 *					<br>
		 * 				click
		 * 			</span>
     *    	<input type="checkbox" id="input-click">
     *    	<label for="input-click">ONCE</label>
		 * 		</div>
		 * 	</div>
		 * </div>
		 */
		const
			buttonWrapperClass = props.length > 1 ? `button-wrapper multi` : `button-wrapper`,
			subsButtonContainer = props.length > 1 ? `<div class="subs"></div>` : ``
		let str = `<div id="${id}" class="${buttonWrapperClass}"><div class="button"><span>${this.#getLabel()}</span><label>ONCE<input type="checkbox"></label></div>${subsButtonContainer}</div>`
		Button.container.insertAdjacentHTML('beforeend', str)
		this.#buttonWrapper = Button.container.querySelector(`#${id}`)
		this.#buttonContainer = this.#buttonWrapper.querySelector(`.button`)
		this.#button = this.#buttonContainer.querySelector(`span`)
		this.#input = this.#buttonWrapper.querySelector(`.button input`)
		this.#input.addEventListener('input', _ => {
			props.forEach(prop => prop.once = this.#input.checked)
			if (props.length > 1) {//If there are subButtons
				this.#buttonWrapper.classList.toggle('once', this.#input.checked)
			}
		})
		this.#button.addEventListener('click', _ => {
			if (this.disabled) return false
			this.active = !this.#active
			this.#subButtons.forEach(b => b.active = this.#active)
			this.emit('click', props)
		})
		if (props.length > 1) {//We need to build subButtons
			for (let id = 0; id < props.length; id++) {
				const subButton = new SubButton(props[id], this.#buttonWrapper.querySelector('.subs'))
				this.#subButtons.push(subButton)
				props[id].owner = subButton
				subButton.on('click', _ => {
					this.emit('subclick', props[id])
				})
				subButton.on('change', _ => {
					this.disabled = (!this.active && this.#subButtons.filter(b => b.active || b.onceChecked).length > 0)
					this.#button.innerHTML = this.#getLabel()
					if (!this.disabled) this.#buttonWrapper.classList.toggle('hide-once', props.filter(prop => prop.on).length > 0)
					if (!this.disabled && props.filter(prop => prop.on).length == 0) this.active = false
				})
			}
		} else {
			props[0].owner = this
		}
	}

	set disabled(disabled) {
		this.#disabled = disabled
		this.#input.disabled = disabled
		this.#buttonContainer.classList.toggle('disabled', disabled)
		this.#buttonWrapper.classList.toggle('hide-once', disabled)
	}

	get disabled() {
		return this.#disabled
	}

	set active(act) {
		this.#active = act
		this.#props.forEach(prop => prop.on = act)
		this.#button.innerHTML = this.#getLabel()
		this.#buttonWrapper.classList.toggle('active', act)
		if(!this.disabled) this.#buttonWrapper.classList.toggle('hide-once', act)
	}

	get active(){
		return this.#active
	}
}

// import { default as EventEmitter } from '../../../index.js'
import { default as EventEmitter } from './amstramgramEventEmitterLight-min.js'


export default class SubButton extends EventEmitter {
  #event
  #buttonContainer
  #button
  #input
  #active = false
  constructor(event, container) {
    super()
    this.#event = event
    /*
     *<div class="subs">
		 *  <div id="down">//this.#buttonContainer
		 *    <span>//this.#button
		 *      <span>Unwatch</span>
		 *			<br>
		 * 			down
		 * 		</span>
     *    <input type="checkbox" id="input-down">
     *    <label for="input-down">ONCE</label>
		 * 	</div>
		 * 	<div id="up">
		 * 		<span>
		 * 			<span>Unwatch</span>
		 *			<br>
		 * 			up
		 * 		</span>
     *    <input type="checkbox" id="input-up">
     *    <label for="input-up">ONCE</label>
		 * 	</div>
		 * 	<div id="click">
		 * 		<span>
		 * 			<span>Unwatch</span>
		 *			<br>
		 * 			click
		 * 		</span>
     *    <input type="checkbox" id="input-click">
     *    <label for="input-click">ONCE</label>
		 * 	</div>
		 * </div>
    */
    container.insertAdjacentHTML('beforeend', `<div id="${event.id}"><span><span>Watch</span><br>${event.text}</span><input type="checkbox" id="input-${event.id}"><label for="input-${event.id}">ONCE</label></div>`)
    this.#buttonContainer = container.querySelector(`#${event.id}`)
    this.#button = this.#buttonContainer.querySelector(`span`)
    this.#input = container.querySelector(`#input-${event.id}`)
    this.#input.addEventListener('input', _ => {
      event.once = this.#input.checked
      this.emit('change')
    })
    this.#button.addEventListener('click', _ => {
      this.active = !this.#active
      this.emit('click')
    })
  }

  get onceChecked() {//Called from main Button
    return this.#input.checked
  }

  set active(act) {
    this.#active = act
    this.#event.on = act
    this.#button.querySelector('span').innerHTML = act ? `Unwatch` : `Watch`
    this.#buttonContainer.classList.toggle('active', act)
    this.emit('change')
  }

  get active() {
    return this.#active
  }
}

import main from './common/main'
import aside from './common/aside'
import code from './common/code'
import BrickWallGame from './common/brickWallGameLight'
import Dot from './common/dot'
import EventEmitter from '../../src/amstramgramEventEmitterLight'
// import EventEmitter from 'Amstramgram-Event-Emitter/Light'
import Prism from 'prismjs'

//Redirect to error.html if the browser does not understand our code...
window.addEventListener('error', e => {
  const nameModule = window.location.origin + '/js/index.js',
    nameNoModule = window.location.origin + '/js/noModule/index.js'
  if (e.filename == nameModule || e.filename == nameNoModule) window.location.href = './error.html'
})

//Set all the used variables names as custom keywords for Prism
//This has to be done before DOM load
  const myVars = ['emitter', 'EventEmitter']
  Prism.languages.insertBefore('javascript', 'constant', {
    'my-vars': {
      pattern: new RegExp("\\b(?:" + myVars.join("|") + ")\\b(?=}?)(?!:)"),
    }
  });


const
  w = window,
  d = document,
  dotCanvas = d.querySelector('.dot'),
  dotCtx = Dot.ctx = dotCanvas.getContext('2d')

let game, removeButton, autoButton, playingIcon


w.addEventListener("load", function () {
  main()
  aside()
  code()
  init()
}, false)

function init() {
  //Basic demo
  //Instanciation
  const emitter = new EventEmitter()

  //Same sillyCallback for two events
  emitter.on('firstevent secondevent', sillyCallback)

  //stupidCallback
  emitter.on('firstevent', stupidCallback)

  function sillyCallback(e, eventName) {
    console.log(e.text, "My nickname is " + eventName, e.plus ? "." : "and I'm called by a sillyCallback...")
    if (e.plus) console.log(e.plus)
  }

  function stupidCallback(e, eventName) {
    console.log(e.text, "My nickname is " + eventName, "and I'm called by a stupidCallback...")
  }

  emitter.emit('firstevent', { text: "Hello, I'm the FirstEvent!!!" })
  emitter.emit('secondevent', { text: "Hello, I'm the SecondEvent!!!", plus: "Have a nice day !" })

  emitter.off('firstevent')
  emitter.emit('firstevent', { text: "Hello, I'm the FirstEvent but you'll never see me !!!" })


  //Initialize the variables
  removeButton = d.querySelector('.controls .button.remove')
  autoButton = d.querySelector('.controls .button.auto')
  playingIcon = d.querySelector('.controls img')

  //Initialize the game
  game = new BrickWallGame('game', document.querySelector('.game-container'))
  game.on('initialization-end', _ => {
    game.off('initialization-end')
    console.log("Brickwall is ready !")
  })

  //associate callback and eventName
  const callbacks = {
    'playing': playing,
    'hitleft': _ => hit('left'),
    'hittop': _ => hit('top'),
    'hitright': _ => hit('right'),
    'hitbottom': _ => hit('bottom'),
    'hitpaddle': hitpaddle,
    'hitbrick': hitbrick
  }

  Array.from(d.querySelectorAll('input[type=radio]')).forEach(radio => {
    radio.addEventListener('change', e => {
      if (e.target.value == 'on') {
        game.on(e.target.name, callbacks[e.target.name])
      } else {
        game.off(e.target.name)
      }
      //Enabled/Disabled the playingIcon
      //Opacity is 0.5 id disabled, 1 if enabled
      if (e.target.name == 'playing') {
        playingIcon.classList.toggle('enabled', e.target.value == 'on')
      }
      //Enabled/Disabled the removeButton
      removeButton.classList.toggle('enabled', checkIfActiveListeners())
    })
  })

  removeButton.addEventListener('click', function () {
    if (this.classList.contains('enabled')) {
      //Remove all the events and their listeners
      game.off()
      //Update the radio buttons state
      Object.keys(callbacks).forEach(key => updateRadios(key))
    }
  })

  autoButton.addEventListener('click', _ => {
    game.auto = !game.auto
    if (game.auto && game.pause) {
      game.pause = false
      game.draw()
    }
  })

  //Control + Click on one radio label set all checked
  d.querySelectorAll('.listeners label').forEach(label => {
    label.addEventListener('click', e => {
      if (e.ctrlKey) {
        const
          id = e.target.getAttribute('for'),
          value = d.querySelector(`#${id}`).value
        Array.from(d.querySelectorAll(`.listeners label[data-value=${value}]`)).forEach(label => {
          let event
          if(typeof(MouseEvent) === 'function') {
              event = new MouseEvent('click')
          }else{
              event = document.createEvent('MouseEvent')
              event.initEvent('click', true, true)
          }
          label.dispatchEvent(event)
        })
      }
    })
  })

  //Update the autoButton state according to the auto mode
  checkGameIsInAutoMode()
}

//Update the autoButton state according to the auto mode
function checkGameIsInAutoMode() {
  autoButton.classList.toggle('active', game.auto)
  requestAnimationFrame(checkGameIsInAutoMode)
}

//Playing callback
//Apply rotation to playingIcon during play
let rotate = 0
function playing() {
  rotate += 5
  playingIcon.style.transform = `rotate(${rotate}deg)`
  updateRadios('playing')
}

/**
 * @description : Hit the wall callbacks
 * @param {String} theClass 'left' | 'top' | 'right' | 'bottom'
 * The canvas game is surrounded by 4 div 
 * Add the show class to the corresponding div : its opacity is passed from 0 to 1
 * The class is removed in the next frame.
 * The opacity is transitioned to 0 with a 1 second delay
 */
function hit(theClass) {
  d.querySelector(`.${theClass}`).classList.add('show')
  requestAnimationFrame(_ => d.querySelector(`.${theClass}`).classList.remove('show'))
  updateRadios('hit' + theClass)
}

//Hit paddle callback
//The event is emitted with an object holding the collision coordinates
function hitpaddle(e) {
  new Dot(e.x, e.y, 10, 1000, 'transparent', '#a10304', true)
  if (Dot.size == 1) requestAnimationFrame(anim)
  updateRadios('hitpaddle')
}

//Hit brick callback
function hitbrick(e) {
  new Dot(e.x, e.y, 20, 1000, 'transparent', '#308325', true)
  if (Dot.size == 1) requestAnimationFrame(anim)
  updateRadios('hitbrick')
}

function updateRadios(theClass) {
  if (!game.events.has(theClass)) {
    d.querySelector(`#${theClass}-off`).checked = true
    if (theClass == 'playing') playingIcon.classList.remove('enabled')
  }
  removeButton.classList.toggle('enabled', checkIfActiveListeners())
}

//Dots animations
function anim() {
  dotCtx.clearRect(0, 0, dotCanvas.width, dotCanvas.height)
  Dot.draw()
  if (Dot.size > 0) requestAnimationFrame(anim)
}

function checkIfActiveListeners() {
  return game.events.size > 2
}

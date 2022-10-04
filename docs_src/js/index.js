import main from './common/main'
import aside from './common/aside'
import code from './common/code'
import BrickWallGame from './common/brickWallGame'
import Prism from 'prismjs'
import eventEmitter from '../../src/amstramgramEventEmitter'

//Redirect to error.html if the browser does not understand our code...
// window.addEventListener('error', e => {
//   console.log(e)
//   const nameModule = window.location.origin + '/js/index.js',
//     nameNoModule = window.location.origin + '/js/noModule/index.js'
//   if (e.filename == nameModule || e.filename == nameNoModule) window.location.href = './error.html'
// })


window.addEventListener("load", function () {
  main()
  aside()
  code()
  init()
}, false)

function init() {
  const game = new BrickWallGame('game')
  // setTimeout(() => {
  //   game.play()
  // }, 2000);
  game.play()
}
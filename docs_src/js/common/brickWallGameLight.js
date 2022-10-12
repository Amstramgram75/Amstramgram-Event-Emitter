import EventEmitter from '../../../src/amstramgramEventEmitterLight'
// import EventEmitter from 'Amstramgram-Event-Emitter/Light'
//https://github.com/end3r/Gamedev-Canvas-workshop/blob/gh-pages/lesson10.html
const
  d = document,
  ballRadius = 10,
  paddleHeight = 10,
  paddleWidth = 75,
  brickRowCount = 5,
  brickColumnCount = 3,
  brickWidth = 75,
  brickHeight = 20,
  brickPadding = 10,
  brickOffsetTop = 30,
  brickOffsetLeft = 30,
  orange = '#cb852a'

export default class BrickWallGame extends EventEmitter {

  #canvas
  #canvasLeft
  #ctx
  #x
  #y
  #dx
  #dy
  #paddleX
  #speed = 2
  #rightPressed = false
  #leftPressed = false
  #score = 0
  #lives = 3
  #games = 0
  #lost = 0
  #win = 0
  #init = false
  #bricks = []
  #info = ["Click or hit space bar to play !!!", "Use your mouse or left and right arrows to move...", "Adjust the speed with up and down arrows."]

  #reset() {
    this.#x = this.#canvas.width / 2
    this.#y = this.#canvas.height / 2
    let rand = Math.random() - 0.5
    rand = rand < 0 ? -1 : 1
    this.#dx = rand * this.#speed
    this.#dy = -1 * this.#speed
    this.#paddleX = (this.#canvas.width - paddleWidth) / 2
  }

  #resetAll() {
    this.#reset()
    this.#score = 0
    this.#lives = 3
    this.#games++
    this.pause = true
    for (let c = 0; c < brickColumnCount; c++) {
      this.#bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        this.#bricks[c][r] = { x: 0, y: 0, status: 1 }
      }
    }
    this.draw()
  }

  #drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (this.#bricks[c][r].status == 1) {
          const
            brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft,
            brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop
          this.#bricks[c][r].x = brickX
          this.#bricks[c][r].y = brickY
          this.#ctx.beginPath()
          this.#ctx.rect(brickX, brickY, brickWidth, brickHeight)
          this.#ctx.fillStyle = orange
          this.#ctx.fill()
          this.#ctx.closePath()
        }
      }
    }
  }

  #drawBall() {
    this.#ctx.beginPath()
    this.#ctx.arc(this.#x, this.#y, ballRadius, 0, Math.PI * 2)
    this.#ctx.fillStyle = orange
    this.#ctx.fill()
    this.#ctx.closePath()
  }

  #drawPaddle() {
    this.#ctx.beginPath()
    this.#ctx.rect(this.#paddleX, this.#canvas.height - paddleHeight, paddleWidth, paddleHeight)
    this.#ctx.fillStyle = orange
    this.#ctx.fill()
    this.#ctx.closePath()
  }

  #drawText() {
    this.#ctx.font = "16px Arial";
    this.#ctx.textAlign = "left"
    this.#ctx.fillStyle = orange;
  }

  #drawScore() {
    this.#drawText()
    this.#ctx.fillText("Score: " + this.#score, 8, 20);
  }

  #drawSpeed() {
    this.#drawText()
    const
      text = "Speed: " + this.#speed,
      textWidth = this.#ctx.measureText(text).width
    this.#ctx.fillText(text, 0.5 * (this.#canvas.width - textWidth), 20);
  }

  #drawLives() {
    this.#drawText()
    this.#ctx.fillText("Lives: " + this.#lives, this.#canvas.width - 65, 20);
  }

  #drawBanner() {
    this.#ctx.fillStyle = "#111111ee"
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
    this.#ctx.font = "20px Arial"
    this.#ctx.textAlign = "center"
    this.#ctx.fillStyle = "#c9be9f"
    if (typeof this.#info === 'string') {
      this.#info = [this.#info]
    }
    const top = (this.#info.length == 3) ? (this.#canvas.height / 2) - 30 : this.#canvas.height / 2
    this.#ctx.fillText(this.#info[0], this.#canvas.width / 2, top)
    if (this.#info.length > 1) {
      const
        metrics = this.#ctx.measureText(this.#info[0]),
        h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 10
      for (let i = 1; i < this.#info.length; i++) {
        this.#ctx.fillText(this.#info[i], this.#canvas.width / 2, (h * i) + top)
      }
    }
  }

  #collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = this.#bricks[c][r]
        if (b.status == 1) {
          if (this.#x > b.x && this.#x < b.x + brickWidth && this.#y > b.y && this.#y < b.y + brickHeight) {
            this.#dy = -this.#dy
            b.status = 0
            this.#score++
            this.emit('hitbrick', {x: this.#x, y: this.#y})
            if (this.#score == brickRowCount * brickColumnCount) {
              this.#win++
              const game = this.#win > 1 ? 'games' : 'game'
              this.#info = ["Congratulations !", `You won ${this.#win} ${game} out of ${this.#games} !`]
              this.#resetAll()
              if (this.auto) this.pause = false
            }
          }
        }
      }
    }
  }

  /***********************************
   *           CONSTRUCTOR           *
   ***********************************/
  constructor(id, parentElement = d.body, width = 480, height = 320) {
    super()
    parentElement.insertAdjacentHTML('beforeEnd', `<canvas id="${id}" width="${width}" height="${height}"></canvas>`)
    this.#canvas = parentElement.querySelector(`#${id}`)
    this.#ctx = this.#canvas.getContext("2d")
    this.#resetAll()
    const self = this
    window.addEventListener('resize', getCanvasPosition)
    window.addEventListener('scroll', getCanvasPosition)
    function getCanvasPosition() {
      self.#canvasLeft = self.#canvas.getBoundingClientRect().left
    }
    getCanvasPosition()
    this.pause = true
    this.auto = false;

    d.addEventListener("keydown", e => {
      if (e.code == "ArrowRight") {
        this.auto = false;
        this.#rightPressed = true
      } else if (e.code == 'ArrowLeft') {
        this.auto = false;
        this.#leftPressed = true
      } else if (e.code == 'ArrowUp') {
        e.preventDefault()
        this.speed += 0.25
      } else if (e.code == 'ArrowDown') {
        e.preventDefault()
        this.speed -= 0.25
      } else if (e.code == 'Space') {
        e.preventDefault()
        this.auto = false;
        this.toggle()
      }
    }, false)
    d.addEventListener("keyup", e => {
      if (e.code == 'ArrowRight') {
        this.#rightPressed = false
      } else if (e.code == 'ArrowLeft') {
        this.#leftPressed = false
      }
    })
    this.#canvas.addEventListener("mousemove", e => {
      const relativeX = e.clientX - this.#canvasLeft
      if (relativeX > 0 && relativeX < width) {
        this.auto = false;
        this.#paddleX = relativeX - paddleWidth / 2;
      }
    }, false)
    this.#canvas.addEventListener("click", _ => this.toggle(), false)
    this.#init = true
    setTimeout(() => {
      this.emit('initialization-end')
    }, 1)
  }
  /***********************************
   *         END CONSTRUCTOR         *
   ***********************************/


  toggle() {
    this.auto = false
    this.pause = !(this.pause)
    if (this.#init && this.pause) this.#info = "Paused..."
    if (!this.pause) this.draw()
  }

  draw() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    this.#drawBricks()
    this.#drawBall()
    this.#drawPaddle()
    this.#drawScore()
    this.#drawSpeed()
    this.#drawLives()
    this.#collisionDetection()
    if (this.pause) {
      this.#drawBanner()
    } else {
      this.emit('playing')
    }

    if (this.auto) {
      this.#paddleX = this.#x - 0.5 * paddleWidth
    }

    if (this.#x + this.#dx > this.#canvas.width - ballRadius || this.#x + this.#dx < ballRadius) {
      if (this.#x + this.#dx > this.#canvas.width - ballRadius) {
        this.emit('hitright')
      } else {
        this.emit('hitleft')
      }
      this.#dx = -this.#dx;
    }
    if (this.#y + this.#dy < ballRadius) {
      this.#dy = -this.#dy;
      this.emit('hittop')
    } else if (this.#y + this.#dy > this.#canvas.height - ballRadius) {
      if (this.#x > this.#paddleX && this.#x < this.#paddleX + paddleWidth) {
        this.emit('hitpaddle', {x: this.#x, y: this.#y})
        this.#dy = - this.#dy
      }
      else {
        this.emit('hitbottom')
        this.#lives--
        if (!this.#lives) {
          this.#lost++
          const game = this.#lost > 1 ? 'games' : 'game'
          this.#info = ["So sorry !!!", `You lost ${this.#lost} ${game} out of ${this.#games} !`]
          this.#resetAll()
        }
        else {
          const live = this.#lives > 1 ? 'lives' : 'live'
          this.#info = ["Oups !!!", `You have ${this.#lives} ${live} left !`]
          this.#reset()
          this.pause = true
          this.draw()
        }
      }
    }

    if (this.#rightPressed && this.#paddleX < this.#canvas.width - paddleWidth) {
      this.#paddleX += 7;
    }
    else if (this.#leftPressed && this.#paddleX > 0) {
      this.#paddleX -= 7;
    }

    this.#x += this.#dx
    this.#y += this.#dy
    if (!this.pause) {
      //Keep "this" reference
      requestAnimationFrame(_ => this.draw())
      this.#canvas.style.cursor = 'crosshair'
    } else {
      this.#canvas.style.cursor = 'pointer'
    }
  }

  get score() {
    return this.#score
  }
  get lives() {
    return this.#lives
  }

  set speed(theSpeed) {
    this.#speed = Math.max(0.5, Math.min(theSpeed, 20))
    this.#dx = this.#dx < 0 ? -1 * theSpeed : theSpeed
    this.#dy = this.#dy < 0 ? -1 * theSpeed : theSpeed
  }

  get speed() {
    return this.#speed
  }
}
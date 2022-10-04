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
  brickOffsetLeft = 30


export default class BrickWallGame {


  #canvas
  #ctx
  #x
  #y
  #dx = 2
  #dy = -2
  #paddleX
  #rightPressed = false
  #leftPressed = false
  #score = 0
  #lives = 3
  #pause = false
  #bricks = []

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
          this.#ctx.fillStyle = "#0095DD"
          this.#ctx.fill()
          this.#ctx.closePath()
        }
      }
    }
  }


  #drawBall() {
    this.#ctx.beginPath()
    this.#ctx.arc(this.#x, this.#y, ballRadius, 0, Math.PI * 2)
    this.#ctx.fillStyle = "#0095DD"
    this.#ctx.fill()
    this.#ctx.closePath()
  }

  #drawPaddle() {
    this.#ctx.beginPath()
    this.#ctx.rect(this.#paddleX, this.#canvas.height - paddleHeight, paddleWidth, paddleHeight)
    this.#ctx.fillStyle = "#0095DD"
    this.#ctx.fill()
    this.#ctx.closePath()
  }
  #drawScore() {
    this.#ctx.font = "16px Arial";
    this.#ctx.fillStyle = "#0095DD";
    this.#ctx.fillText("Score: " + this.#score, 8, 20);
  }
  #drawLives() {
    this.#ctx.font = "16px Arial";
    this.#ctx.fillStyle = "#0095DD";
    this.#ctx.fillText("Lives: " + this.#lives, this.#canvas.width - 65, 20);
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
            if (this.#score == brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATS!")
            }
          }
        }
      }
    }
  }




  /***********************************
   *           CONSTRUCTOR           *
   ***********************************/
  constructor(id, width = 480, height = 320, parentElement = d.body) {
    parentElement.insertAdjacentHTML('beforeEnd', `<canvas id="${id}" width="${width}" height="${height}"></canvas>`)
    this.#canvas = parentElement.querySelector(`#${id}`);
    this.#ctx = this.#canvas.getContext("2d")
    console.log(this.#ctx)
    this.#x = this.#canvas.width / 2
    this.#y = this.#canvas.height / 2
    this.#paddleX = (width - paddleWidth) / 2
    for (let c = 0; c < brickColumnCount; c++) {
      this.#bricks[c] = [];
      for (var r = 0; r < brickRowCount; r++) {
        this.#bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    d.addEventListener("keydown", e => {
      if (e.code == "ArrowRight") {
        this.#rightPressed = true
      }
      else if (e.code == 'ArrowLeft') {
        this.leftPressed = true
      }
    }, false)
    d.addEventListener("keyup", e => {
      if (e.code == 'ArrowRight') {
        this.#rightPressed = false
      }
      else if (e.code == 'ArrowLeft') {
        this.#leftPressed = false
      } else if (e.code == 'Space') {
        this.toggle()
      }
    }, false)
    d.addEventListener("mousemove", e => {
      const relativeX = e.clientX - this.#canvas.offsetLeft;
      if (relativeX > 0 && relativeX < width) {
        this.#paddleX = relativeX - paddleWidth / 2;
      }

    }, false)
    d.addEventListener("click", this.toggle)

  }
  /***********************************
   *         END CONSTRUCTOR         *
   ***********************************/


  toggle() {
    // console.log('OK')
    this.#pause = !(this.#pause)
    if (!this.#pause) this.play()
  }

  play() {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
      this.#drawBricks()
      this.#drawBall()
      this.#drawPaddle()
      this.#drawScore()
      this.#drawLives()
      this.#collisionDetection()

      if (this.#x + this.#dx > this.#canvas.width - ballRadius || this.#x + this.#dx < ballRadius) {
        this.#dx = -this.#dx;
      }
      if (this.#y + this.#dy < ballRadius) {
        this.#dy = -this.#dy;
      }
      else if (this.#y + this.#dy > this.#canvas.height - ballRadius) {
        if (this.#x > this.#paddleX && this.#x < this.#paddleX + paddleWidth) {
          this.#dy = -this.#dy;
        }
        else {
          this.#lives--;
          if (!this.#lives) {
            alert("GAME OVER");
          }
          else {
            this.#x = this.#canvas.width / 2;
            this.#y = this.#canvas.height - 30;
            this.#dx = 2;
            this.#dy = -2;
            this.#paddleX = (this.#canvas.width - paddleWidth) / 2;
          }
        }
      }

      if (this.#rightPressed && this.#paddleX < this.#canvas.width - paddleWidth) {
        this.#paddleX += 7;
      }
      else if (this.#leftPressed && this.#paddleX > 0) {
        this.#paddleX -= 7;
      }

      this.#x += this.#dx;
      this.#y += this.#dy;
      if (!this.#pause) requestAnimationFrame(this.play.bind(this))
  }
}
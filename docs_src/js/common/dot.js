export default class Dot {
	static #dots = new Set()
	static ctx
	static get size() {
		return Dot.#dots.size
	}
	static draw() {
		Dot.#dots.forEach(dot => {
			let a = 1 - ((Date.now() - dot.t) / dot.duration)
			if (a > 0) {
				const r = dot.grow ? dot.radius / a : dot.radius * a
				Dot.ctx.lineWidth = dot.grow ? dot.radius / 10 / a : a * dot.radius / 20
				Dot.ctx.strokeStyle = dot.strokeColor
				Dot.ctx.fillStyle = dot.fillColor
				Dot.ctx.globalAlpha = a
				Dot.ctx.beginPath()
				Dot.ctx.arc(dot.x, dot.y, r, 0, 2 * Math.PI)
				Dot.ctx.stroke()
				Dot.ctx.fill()
			} else {
				Dot.#dots.delete(dot)
			}
		})
	}
	constructor(x, y, radius, duration, strokeColor, fillColor = 'transparent', grow = false) {
		if (typeof fillColor === "boolean" && fillColor === true) {
			fillColor = 'transparent'
			grow = true
		}
		this.x = x
		this.y = y
		this.radius = radius
		this.duration = duration
		this.strokeColor = strokeColor
		this.fillColor = fillColor
		this.grow = grow
		this.t = Date.now()
		Dot.#dots.add(this)
	}

	// get size() {
	// 	return this.#dots.size
	// }
}
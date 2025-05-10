import type { WaterGlimmerOptions } from './water-glimmer'
import WaterGlimmer from './water-glimmer'

class WaterLightRays extends WaterGlimmer {
  public constructor(options: WaterGlimmerOptions) {
    super(options)
    window.addEventListener('resize', this.canvasSetup)
  }

  protected addGlimmer(initial: boolean) {
    /* All sizes are as a percentage of the container width */
    const startPosition = this.randomNumber(-20, 90)
    const distance = this.randomNumber(5, 50)
    const duration = this.randomNumber(50, 150) * distance
    const glimmer = {
      startSize: this.randomNumber(3, 8),
      endSize: this.randomNumber(3, 8),
      startPosition,
      endPosition: startPosition + distance,
      duration,
      time: initial ? this.randomNumber(0, duration) : 0,
    }
    this.glimmers.push(glimmer)
  }

  protected draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    while (this.glimmers.length < this.totalGlimmers) {
      this.addGlimmer(false)
    }

    for (let i = this.glimmers.length - 1; i >= 0; i--) {
      const glimmer = this.glimmers[i]
      const glimmerSize =
        (glimmer.startSize +
          ((glimmer.endSize - glimmer.startSize) / glimmer.duration) * glimmer.time) /
        100
      const glimmerPosition =
        (glimmer.startPosition +
          ((glimmer.endPosition - glimmer.startPosition) / glimmer.duration) * glimmer.time) /
        100
      let alpha = 0
      if (glimmer.time < glimmer.duration / 2) {
        alpha = glimmer.time / (glimmer.duration / 2)
      } else {
        alpha = 1 - (glimmer.time - glimmer.duration / 2) / (glimmer.duration / 2)
      }

      const grd = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
      grd.addColorStop(0, 'rgba(255, 255, 255, ' + this.alphaTop * alpha + ')')
      grd.addColorStop(1, 'rgba(255, 255, 255, ' + this.alphaBottom * alpha + ')')

      this.ctx.beginPath()
      this.ctx.moveTo(this.canvas.width * glimmerPosition - this.canvas.height / 2, 0)
      this.ctx.lineTo(
        this.canvas.width * glimmerPosition +
          this.canvas.width * glimmerSize -
          this.canvas.height / 2,
        0,
      )
      this.ctx.lineTo(
        this.canvas.width * glimmerPosition +
          this.canvas.width * glimmerSize +
          this.canvas.height / 2,
        this.canvas.height,
      )
      this.ctx.lineTo(
        this.canvas.width * glimmerPosition + this.canvas.height / 2,
        this.canvas.height,
      )
      this.ctx.fillStyle = grd
      this.ctx.fill()

      glimmer.time++
      if (glimmer.time > glimmer.duration) {
        this.glimmers.splice(i, 1)
      }
    }

    this.currentAnimationFrameRequestID = window.requestAnimationFrame(this.draw)
  }

  public destroy() {
    window.removeEventListener('resize', this.canvasSetup)
    super.destroy()
  }
}

export default WaterLightRays

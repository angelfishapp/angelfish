/**
 * Class Options
 */

export type WaterGlimmerOptions = {
  containerId?: string
  totalGlimmers?: number
  alphaTop?: number
  alphaBottom?: number
}

/**
 * Adds Water Light Rays to background
 */

class WaterGlimmer {
  protected container: HTMLElement | null
  protected canvas: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D
  protected glimmers: any[] = []
  protected currentAnimationFrameRequestID: number
  protected totalGlimmers: number
  protected alphaTop: number
  protected alphaBottom: number

  public constructor(options: WaterGlimmerOptions) {
    const { containerId = '', totalGlimmers = 50, alphaTop = 0.6, alphaBottom = 0.1 } = options

    this.alphaTop = alphaTop
    this.alphaBottom = alphaBottom

    this.container = document.getElementById(containerId)
    if (!this.container) {
      throw Error('No Div elements found for ' + containerId)
    }

    this.canvas = this.container.appendChild(document.createElement('canvas'))
    this.canvas.className = 'water-shimmer'
    this.canvas.style.mixBlendMode = 'lighten'
    this.canvas.style.position = 'absolute'
    this.canvas.style.height = '75%'
    this.canvas.style.width = '100%'
    this.canvasSetup()
    const context = this.canvas.getContext('2d')
    if (!context) {
      throw Error('Failed to get 2D Context for Canvas')
    }

    this.ctx = context
    this.ctx.fillStyle = 'white'

    this.totalGlimmers = totalGlimmers
    while (this.glimmers.length < this.totalGlimmers) {
      this.addGlimmer(true)
    }
    this.currentAnimationFrameRequestID = window.requestAnimationFrame(this.draw)
  }

  protected canvasSetup = () => {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
  }

  protected addGlimmer(initial: boolean) {
    /* Positions are as a percentage of the container width. Sizes are pixels */
    const duration = this.randomNumber(100, 150)
    const y = this.randomNumber(0, 100)
    const glimmer = {
      size: this.randomNumber(5, 10),
      x: this.randomNumber(0, 100),
      y,
      duration,
      time: initial ? this.randomNumber(0, duration) : 0,
    }
    this.glimmers.push(glimmer)
  }

  protected randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  protected draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    while (this.glimmers.length < this.totalGlimmers) {
      this.addGlimmer(false)
    }

    for (let i = this.glimmers.length - 1; i >= 0; i--) {
      const glimmer = this.glimmers[i]
      const glimmerX = (glimmer.x * this.canvas.width) / 100
      const glimmerY = (glimmer.y * this.canvas.height) / 100
      let alpha = 0
      if (glimmer.time < glimmer.duration / 2) {
        alpha = glimmer.time / (glimmer.duration / 2)
      } else {
        alpha = 1 - (glimmer.time - glimmer.duration / 2) / (glimmer.duration / 2)
      }

      const size = (alpha * glimmer.size) / 2
      this.ctx.globalAlpha = alpha

      this.ctx.beginPath()
      this.ctx.moveTo(glimmerX, glimmerY - size)
      this.ctx.lineTo(glimmerX + size, glimmerY)
      this.ctx.lineTo(glimmerX, glimmerY + size)
      this.ctx.lineTo(glimmerX - size, glimmerY)

      this.ctx.fill()

      glimmer.time++
      if (glimmer.time > glimmer.duration) {
        this.glimmers.splice(i, 1)
      }
    }

    this.currentAnimationFrameRequestID = window.requestAnimationFrame(this.draw)
  }

  public destroy() {
    cancelAnimationFrame(this.currentAnimationFrameRequestID)
    this.canvas.remove()
  }
}

export default WaterGlimmer

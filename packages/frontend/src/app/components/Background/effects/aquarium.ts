/**
 * Class Options
 */

export type aquariumOptions = {
  containerId?: string
  speed?: number
  fishGroupCount?: number // The quantity of groups of fish
  fishGroupMax?: number // The max fish in a group
  constantMovement?: number // The max fish in a group
  fishSize?: number[] // An array of min and max values for the size of fish
  fishDeviation?: number[] // An array of min and max values for the distance of fish from the master position in a group
  pauseTime?: number[] // An array of min and max values for the time a fish will pause (in frames)
  swimTime?: number[] // An array of min and max values for the time a fish will swim (in frames)
  fishDelay?: number[] // An array of min and max values for the delay a fish in a group can have from the master fish
  swimDistanceX?: number[] // An array of min and max values for the horizonal distance a fish will swim
  swimDistanceY?: number[] // An array of min and max values for the vertical distance a fish will swim
  fishHue?: number[] // An array of a range of values for the hue of the colour of the fish
  fishSat?: number[] // An array of a range of values for the saturation of the colour of the fish
  fishLightness?: number[] // An array of a range of values for the lightness of the colour of the fish
}

type status = {
  swimDuration: number
  pauseDuration: number
  time: number
  startPosition: number[]
  endPosition: number[]
}

type fish = {
  delay: number
  size: number
  deviationStart: number[]
  deviationEnd: number[]
  color: string
}

type fishGroup = {
  status: status
  previousStatus: status
  direction: string
  fish: fish[]
  firstCycle: boolean
}

/**
 * Adds fish that swim around
 */

class Aquarium {
  protected container: HTMLElement | null
  protected canvas: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D
  protected currentAnimationFrameRequestID: number
  protected fishGroups: any[] = []
  protected fishGroupCount: number
  protected fishGroupMax: number
  protected speed: number
  protected constantMovement: number
  protected fishDeviation: number[]

  protected pauseTime: number[]
  protected swimTime: number[]
  protected swimDistanceX: number[]
  protected swimDistanceY: number[]
  protected fishDelay: number[]
  protected fishSize: number[]
  protected fishHue: number[]
  protected fishSat: number[]
  protected fishLightness: number[]

  public constructor(options: aquariumOptions) {
    const {
      containerId = '',
      speed = 0.2,
      fishGroupCount = 4,
      fishGroupMax = 3,
      constantMovement = 2,
      fishSize = [50, 80],
      fishDeviation = [50, 100],
      pauseTime = [0, 0],
      swimTime = [500, 700],
      fishDelay = [100, 300],
      swimDistanceX = [300, 500],
      swimDistanceY = [-50, 50],
      fishHue = [201, 203],
      fishSat = [63, 63],
      fishLightness = [30, 60],
    } = options

    this.speed = speed
    this.constantMovement = constantMovement
    this.fishGroupCount = fishGroupCount
    this.fishGroupMax = fishGroupMax
    this.pauseTime = pauseTime
    this.swimTime = swimTime
    this.swimDistanceX = swimDistanceX
    this.swimDistanceY = swimDistanceY
    this.fishDelay = fishDelay
    this.fishSize = fishSize
    this.fishDeviation = fishDeviation
    this.fishHue = fishHue
    this.fishSat = fishSat
    this.fishLightness = fishLightness

    this.container = document.getElementById(containerId)
    if (!this.container) {
      throw Error('No Div elements found for ' + containerId)
    }
    this.canvas = this.container.appendChild(document.createElement('canvas'))
    this.canvas.className = 'aquarium'
    this.canvasSetup()
    const context = this.canvas.getContext('2d')
    if (!context) {
      throw Error('Failed to get 2D Context for Canvas')
    }
    this.ctx = context
    this.fishGroups = []
    this.addFish(true)
    this.currentAnimationFrameRequestID = window.requestAnimationFrame(this.loop)
    window.addEventListener(
      'resize',
      () => {
        this.canvasSetup()
      },
      true,
    )
  }

  protected canvasSetup = () => {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
  }

  protected loop = () => {
    this.addFish(false)
    this.progressFish()
    this.draw()
    this.currentAnimationFrameRequestID = window.requestAnimationFrame(this.loop)
  }

  protected draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < this.fishGroups.length; i++) {
      let anyFishOnScreen = false
      for (let f = 0; f < this.fishGroups[i].fish.length; f++) {
        const position: number[] = this.getFishPosition(
          this.fishGroups[i],
          this.fishGroups[i].fish[f],
        )
        const fishOnScreen: boolean = this.drawFish(
          position,
          this.fishGroups[i].fish[f].size,
          this.fishGroups[i].direction,
          this.fishGroups[i].fish[f].color,
        )
        if (fishOnScreen) {
          anyFishOnScreen = true
        }
      }
      if (!anyFishOnScreen && !this.fishGroups[i].firstCycle) {
        for (let f = 0; f < this.fishGroups[i].fish.length; f++) {
          this.getFishPosition(this.fishGroups[i], this.fishGroups[i].fish[f])
        }
        this.fishGroups.splice(i, 1)
        i = i - 1
      }
    }
  }

  protected drawFish = (pos: number[], size: number, direction: string, color: string) => {
    const p = new Path2D(
      'M43.7-3.8l-65.3-45.4c-0.8-0.5-1.6-0.8-2.4-0.8c-2.5-0.1-4.8,1.8-4.8,4.6v40.8l-14.5-10.1c-0.9-0.6-2.2,0-2.2,1.1V0v13.7c0,1.1,1.3,1.8,2.2,1.1l14.5-10.1v40.6c0,2.8,2.4,4.7,4.8,4.6c0.8,0,1.7-0.3,2.4-0.8L43.7,3.8c1.3-0.9,2-2.4,2-3.8C45.6-1.4,45-2.9,43.7-3.8z',
    )
    this.ctx.setTransform(
      (size * (direction == 'left' ? 1 : -1)) / 100,
      0,
      0,
      size / 100,
      pos[0],
      pos[1],
    )
    this.ctx.fillStyle = color
    this.ctx.fill(p)
    this.ctx.resetTransform()
    if (
      pos[0] + size / 2 < 0 ||
      pos[0] - size / 2 > this.canvas.width ||
      pos[1] + size / 2 < 0 ||
      pos[1] - size / 2 > this.canvas.height
    ) {
      return false
    }
    return true
  }

  protected progressFish = () => {
    for (let i = 0; i < this.fishGroups.length; i++) {
      this.fishGroups[i].status.time += this.speed
      this.fishGroups[i].previousStatus.startPosition = [
        this.fishGroups[i].previousStatus.startPosition[0] + this.constantMovement * this.speed,
        this.fishGroups[i].previousStatus.startPosition[1],
      ]
      this.fishGroups[i].previousStatus.endPosition = [
        this.fishGroups[i].previousStatus.endPosition[0] + this.constantMovement * this.speed,
        this.fishGroups[i].previousStatus.endPosition[1],
      ]
      this.fishGroups[i].status.startPosition = [
        this.fishGroups[i].status.startPosition[0] + this.constantMovement * this.speed,
        this.fishGroups[i].status.startPosition[1],
      ]
      this.fishGroups[i].status.endPosition = [
        this.fishGroups[i].status.endPosition[0] + this.constantMovement * this.speed,
        this.fishGroups[i].status.endPosition[1],
      ]
      if (
        this.fishGroups[i].status.time >
        this.fishGroups[i].status.swimDuration + this.fishGroups[i].status.pauseDuration
      ) {
        this.fishGroups[i].previousStatus = this.fishGroups[i].status
        this.fishGroups[i].status = this.newStatus(this.fishGroups[i].previousStatus.endPosition)
        this.fishGroups[i].firstCycle = false
        for (let f = 0; f < this.fishGroups[i].fish.length; f++) {
          this.fishGroups[i].fish[f].deviationStart = this.fishGroups[i].fish[f].deviationEnd
          this.fishGroups[i].fish[f].deviationEnd = this.newDeviation()
        }
      }
    }
  }

  // Add fish groups to return to our max fish group count
  protected addFish = (firstTime: boolean) => {
    while (this.fishGroups.length < this.fishGroupCount) {
      let startPos: number[]
      if (firstTime) {
        startPos = [
          this.randomNumber(0, this.canvas.width),
          this.randomNumber(0, this.canvas.height),
        ]
      } else {
        startPos = [
          -this.fishDeviation[1] - this.fishSize[1] / 2,
          this.randomNumber(0, this.canvas.height),
        ]
      }
      const fishGroup: fishGroup = {
        status: this.newStatus(startPos),
        previousStatus: this.newStatus(startPos),
        direction: Math.random() > 0.5 ? 'left' : 'right',
        fish: [],
        firstCycle: true,
      }
      fishGroup.previousStatus.endPosition = fishGroup.status.startPosition
      const fish: fish[] = []
      const fishAmount: number = this.randomNumber(1, this.fishGroupMax, true)
      for (let f = 0; f < fishAmount; f++) {
        fish.push({
          delay: this.randomNumber(this.fishDelay[0], this.fishDelay[1]),
          size: this.randomNumber(this.fishSize[0], this.fishSize[1]),
          deviationStart: this.newDeviation(),
          deviationEnd: this.newDeviation(),
          color: this.newColor(),
        })
      }
      fishGroup.fish = fish
      if (firstTime) {
        fishGroup.status.time = this.randomNumber(
          this.fishDelay[1],
          fishGroup.status.swimDuration + fishGroup.status.pauseDuration - 1,
        )
      }
      this.fishGroups.push(fishGroup)
    }
  }

  protected newStatus = (startPosition: number[]) => {
    const status: status = {
      swimDuration: this.randomNumber(this.swimTime[0], this.swimTime[1]),
      pauseDuration: this.randomNumber(this.pauseTime[0], this.pauseTime[1]),
      time: 0,
      startPosition,
      endPosition: [
        startPosition[0] + this.randomNumber(this.swimDistanceX[0], this.swimDistanceX[1]),
        startPosition[1] + this.randomNumber(this.swimDistanceY[0], this.swimDistanceY[1]),
      ],
    }
    return status
  }

  protected getFishPosition = (fishGroup: fishGroup, fish: fish) => {
    const delay: number = fish.delay
    let status: status = fishGroup.status
    let time: number = status.time
    let calculatedPos: number[]

    let timeRatio: number = time / (status.swimDuration + status.pauseDuration)
    timeRatio = this.ease(timeRatio)

    const deviation: number[] = [
      fish.deviationStart[0] + (fish.deviationEnd[0] - fish.deviationStart[0]) * timeRatio,
      fish.deviationStart[1] + (fish.deviationEnd[1] - fish.deviationStart[1]) * timeRatio,
    ]

    time = status.time - delay

    if (time < 0) {
      status = fishGroup.previousStatus
      time = fishGroup.previousStatus.swimDuration + fishGroup.previousStatus.pauseDuration + time
    }

    if (time > status.swimDuration) {
      calculatedPos = status.endPosition
    } else {
      timeRatio = time / status.swimDuration

      timeRatio = this.ease(timeRatio)

      calculatedPos = [
        status.startPosition[0] + (status.endPosition[0] - status.startPosition[0]) * timeRatio,
        status.startPosition[1] + (status.endPosition[1] - status.startPosition[1]) * timeRatio,
      ]
    }

    if (fishGroup.direction == 'left') {
      return [calculatedPos[0] + deviation[0], calculatedPos[1] + deviation[1]]
    }
    return [this.canvas.width - calculatedPos[0] + deviation[0], calculatedPos[1] + deviation[1]]
  }

  protected newDeviation(): number[] {
    const deviationDistance: number = this.randomNumber(
      this.fishDeviation[0],
      this.fishDeviation[1],
    )
    const deviationAngle: number = (this.randomNumber(0, 360) * Math.PI) / 180
    const newDeviation: number[] = [
      deviationDistance * Math.sin(deviationAngle),
      deviationDistance * Math.cos(deviationAngle),
    ]
    return newDeviation
  }

  protected newColor(): string {
    let h: number = this.randomNumber(this.fishHue[0], this.fishHue[1])
    let s: number = this.randomNumber(this.fishSat[0], this.fishSat[1])
    let l: number = this.randomNumber(this.fishLightness[0], this.fishLightness[1])
    h /= 360
    s /= 100
    l /= 100
    let r, g, b
    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  protected randomNumber(min: number, max: number, round = false) {
    if (round) {
      return Math.round(Math.random() * (max - min) + min)
    }
    return Math.random() * (max - min) + min
  }
  protected ease(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2
  }

  public destroy() {
    window.removeEventListener('resize', this.canvasSetup)
    this.canvas.remove()
  }
}

export default Aquarium

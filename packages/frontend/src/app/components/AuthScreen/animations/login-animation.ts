import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'

import { default as splashData } from './data/login-transition-splash.json'
import { default as animationData } from './data/login-transition.json'

/**
 * Class Options
 */

type LoginAnimationOptiones = {
  /**
   * Optional Div Element ID to render Logo Animation (Default: 'login-logo-animation')
   */
  containerId?: string
  /**
   * Optional Div Element ID to render Splash Animation (Default: 'login-logo-animation-splash-target')
   */
  waterTargetId?: string
  /**
   * Optional class to be given to the svg element (Default: none)
   */
  className?: string
  /**
   * This should be a callback function for when the fish starts to move downward. Used to transition the screen onto the next screen
   */
  onFishJump?: () => void
  /**
   * A callback function for when the fish hit the water
   */
  onSplash?: () => void
  /**
   * A callback function for when the animation has ended. Could be used to remove the login markup from the page
   */
  onEnd?: () => void
}

/**
 * Adds login animations to Login Page
 */

class AngelfishLoginAnimation {
  private container: HTMLElement | null
  private animationWrapper: HTMLElement
  private waterTarget: HTMLElement | null
  private splashWrapper: HTMLElement
  private animation: AnimationItem
  private splash: AnimationItem
  private state = 'logo'
  private fishTravel = 0

  private onFishJump?: () => void
  private onSplash?: () => void
  private onEnd?: () => void

  public constructor(options: LoginAnimationOptiones) {
    const {
      containerId = 'login-logo-animation',
      waterTargetId = 'login-logo-animation-splash-target',
      className = '',
      onFishJump,
      onSplash,
      onEnd,
    } = options
    this.container = document.getElementById(containerId)
    this.waterTarget = document.getElementById(waterTargetId)

    if (!this.container || !this.waterTarget) {
      throw Error('No Div elements found for ' + containerId + ' & ' + waterTargetId)
    }

    this.onFishJump = onFishJump
    this.onSplash = onSplash
    this.onEnd = onEnd

    this.animationWrapper = this.container.appendChild(document.createElement('div'))
    this.splashWrapper = this.waterTarget.appendChild(document.createElement('div'))

    // Set the container properties
    this.container.style.height = '50px'
    this.container.style.position = 'relative'
    this.animationWrapper.style.width = '240px'
    this.animationWrapper.style.height = '320px'
    this.animationWrapper.style.position = 'absolute'
    this.animationWrapper.style.top = '50%'
    this.animationWrapper.style.left = '50%'
    this.animationWrapper.style.margin = '-160px -120px'
    this.animationWrapper.style.transition = 'opacity .3s ease'
    this.animationWrapper.style.opacity = '0'
    if (className) {
      this.animationWrapper.className = className
    }

    this.splashWrapper.style.width = '240px'
    this.splashWrapper.style.height = '320px'
    this.splashWrapper.style.position = 'absolute'
    this.splashWrapper.style.top = '50%'
    this.splashWrapper.style.left = '50%'
    this.splashWrapper.style.margin = '-160px -120px'

    // Initialise Animations
    this.animation = lottie.loadAnimation({
      container: this.animationWrapper,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData,
    })
    this.splash = lottie.loadAnimation({
      container: this.splashWrapper,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: splashData,
    })
    this.animation.addEventListener('DOMLoaded', () => {
      this.animation.goToAndStop(25, true)
      this.state = 'logo'
      this.animationWrapper.style.opacity = '1'
    })
  }

  /**
   * Start loading fish animation
   */
  public loading() {
    this.animation.loop = true
    this.animation.playSegments(
      [
        [26, 50],
        [51, 75],
      ],
      true,
    )
    this.state = 'loading'
  }

  /**
   * Stop loading fish animation
   */
  public stop() {
    this.animation.loop = false
    this.animation.playSegments([[0, 25]], false)
    this.state = 'logo'
  }

  /**
   * Start fish jump animation
   */
  public jump() {
    const moveFish = (e: any) => {
      const time = e.currentTime
      if (time > 21 && time < 41) {
        const fishMoveTransition = (time - 21) / 20
        this.animationWrapper.style.transform =
          'translateY(' + Math.pow(fishMoveTransition, 3) * this.fishTravel + 'px)'
      } else if (time > 41) {
        if (this.state != 'swimming') {
          this.state = 'swimming'
          // This is where the fish hits the water
          this.splash.play()

          this.splashWrapper.appendChild(this.animationWrapper)
          this.animationWrapper.style.transform = 'translateY(0)'
          this.animationWrapper.style.top = '50%'
          this.animationWrapper.style.left = '50%'
          this.animationWrapper.style.position = 'absolute'

          if (this.onSplash) {
            this.onSplash()
          }
        }
        // fish has another 50 time to go! Let's swim down
        const fishMoveTransition = (time - 41) / 50
        this.animationWrapper.style.transform =
          'translateY(' + fishMoveTransition * (window.innerHeight / 2) + 'px)'
      }
    }

    const destroy = () => {
      this.animation.removeEventListener('enterFrame', moveFish)
      this.animation.destroy()
      this.splash.destroy()
      if (this.onEnd) {
        this.onEnd()
      }
    }

    const jumpSegmentStart = () => {
      const wrapperRect = this.animationWrapper.getBoundingClientRect()
      this.animationWrapper.style.position = 'fixed'
      this.animationWrapper.style.zIndex = '999'
      this.animationWrapper.style.top = wrapperRect.top + 160 + 'px'
      this.animationWrapper.style.left = wrapperRect.left + 120 + 'px'
      document.body.appendChild(this.animationWrapper)

      this.animation.removeEventListener('segmentStart', jumpSegmentStart)
      this.animationWrapper.style.zIndex = '99'
      const animationWrapperPosition = this.animationWrapper.getBoundingClientRect()
      const waterTargetPosition = this.waterTarget?.getBoundingClientRect()
      // this is how much the fish need to move to align with the water splash target
      if (waterTargetPosition) {
        this.fishTravel =
          waterTargetPosition.y - animationWrapperPosition.y - animationWrapperPosition.height / 2
      }
      this.animation.addEventListener('enterFrame', moveFish)
      this.animation.addEventListener('complete', destroy)
      if (this.onFishJump) {
        this.onFishJump()
      }
    }

    this.animation.loop = false
    this.animation.playSegments([[76, 167]], false)
    this.state = 'jumping'
    this.animation.addEventListener('segmentStart', jumpSegmentStart)
  }

  /**
   * Destroy animations
   */
  public destroy() {
    this.animation.destroy()
    this.splash.destroy()
  }
}

export default AngelfishLoginAnimation

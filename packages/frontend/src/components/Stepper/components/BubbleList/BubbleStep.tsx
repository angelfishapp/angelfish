import clsx from 'clsx'
import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'
import React from 'react'

import { default as animationData } from './animations/bubble.json'
import type { BubbleStepProps } from './BubbleStep.interface'
import { useStyles } from './BubbleStep.styles'

/**
 * Displays animated Bubble with number inside it to show
 * user which step they're on
 */

export default function BubbleStep({
  label,
  stepNumber,
  isActive = false,
  isComplete = false,
  showDelay = 1.5,
}: BubbleStepProps) {
  const classes = useStyles()
  const bubbleLi = React.useRef<HTMLLIElement>(null)
  const animationDiv = React.useRef<HTMLDivElement>(null)
  const [animation, setAnimation] = React.useState<AnimationItem>()

  /**
   * Load & initialise animation
   */
  React.useEffect(() => {
    if (animationDiv.current) {
      setAnimation(
        lottie.loadAnimation({
          container: animationDiv.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData,
        }),
      )
    }
  }, [])

  /**
   * Start CSS Animation to display bubble on initial render
   */
  React.useEffect(() => {
    setTimeout(() => {
      if (bubbleLi.current) bubbleLi.current.style.transform = 'scale(1)'
    }, showDelay * 1000)
  }, [showDelay])

  /**
   * Play animation based on state
   */
  React.useEffect(() => {
    // Play animation if complete
    if (animation && isComplete) {
      animation.play()
      const audio = new Audio('assets/sounds/pop.mp3')
      audio.play()
    } else if (animation && !isComplete) {
      // Reset animation if not complete
      animation.goToAndStop(0)
    }
  }, [animation, isActive, isComplete])

  // Render
  return (
    <li
      // className={classes.step}
      ref={bubbleLi}
      className={clsx(
        classes.bubble,
        isActive ? classes.active : undefined,
        isComplete ? classes.done : undefined,
      )}
    >
      <div ref={animationDiv} className={`${classes.animationWrapper}`}>
        <div className={classes.number}>{stepNumber}</div>
      </div>
      <div className={classes.label}>{label}</div>
    </li>
  )
}

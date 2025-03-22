import clsx from 'clsx'
import React from 'react'

import type { BackgroundProps } from './Background.interface'
import { useStyles } from './Background.styles'
import { getCurrentPhase } from './Background.utils'
import Aquarium from './effects/aquarium'
import WaterGlimmer from './effects/water-glimmer'
import WaterLightRays from './effects/water-light-rays'

/**
 * Main Component
 */

export default function Background({
  disableAnimations = false,
  view = 'land',
  phase,
  updateFrequency = 15,
  onTransitionEnd,
}: BackgroundProps) {
  // Component State
  const [currentPhase, setCurrentPhase] = React.useState<'day' | 'morning' | 'evening' | 'night'>(
    phase ? phase : getCurrentPhase(),
  )
  const [glimmerEffect, setGlimmerEffect] = React.useState<WaterGlimmer | null>(null)
  const [waterlightEffect, setWaterlightEffect] = React.useState<WaterLightRays | null>(null)
  const [aquariumEffect, setAquariumEffect] = React.useState<Aquarium | null>(null)

  // Component Styles
  const classes = useStyles({ view, phase: currentPhase, viewTransitionTime: '2s' })

  /**
   * Turn on/off login view animations
   */
  const enableLoginAnimations = React.useCallback(
    (enabled: boolean) => {
      if (enabled) {
        // Add Glimmer to Water
        if (!glimmerEffect) {
          setGlimmerEffect(
            new WaterGlimmer({
              containerId: 'login-water',
            }),
          )
        }
      } else {
        // Remove Glimmer from Water
        glimmerEffect?.destroy()
        setGlimmerEffect(null)
      }
    },
    [glimmerEffect],
  )

  /**
   * Enable login animations when view is changed to 'land'
   */
  React.useEffect(() => {
    if (view == 'land') {
      enableLoginAnimations(true)
    }
  }, [view, enableLoginAnimations])

  /**
   * Update Current Phase if phase prop changes
   */
  React.useEffect(() => {
    if (phase) {
      setCurrentPhase(phase)
    }
  }, [phase])

  /**
   * Change Component state
   */
  React.useEffect(() => {
    if (disableAnimations) {
      waterlightEffect?.destroy()
      setWaterlightEffect(null)
      aquariumEffect?.destroy()
      setAquariumEffect(null)
    } else {
      // Add Light Rays to Underwater
      if (!waterlightEffect) {
        setWaterlightEffect(
          new WaterLightRays({
            containerId: 'app-bg', // this is the container for water shimmer animation
            alphaTop: 0.3, // This is the alpha value at the top of the shimmer
            alphaBottom: 0, // This is the alpha value at the bottom of the shimmer
            totalGlimmers: 10,
          }),
        )
      }

      // Add background Fish Underwater
      if (!aquariumEffect) {
        setAquariumEffect(
          new Aquarium({
            containerId: 'aquarium',
          }),
        )
      }
    }

    // If phase wasn't explicitly set, start timer
    // to update background phase throughout the day
    if (!phase) {
      const phaseChangeTimer = setInterval(
        () => {
          setCurrentPhase(getCurrentPhase())
        },
        1000 * 60 * updateFrequency,
      )
      // Clear interval on unmount
      return () => {
        clearInterval(phaseChangeTimer)
      }
    }
  }, [disableAnimations, updateFrequency, aquariumEffect, waterlightEffect, phase])

  // Render
  return (
    <div className={classes.bgContainer}>
      <div className={classes.sky_bg}>
        <div className="sky_bg_stars"></div>
        <div className="sky_bg_sun"></div>
      </div>
      <div
        className={classes.bg}
        onTransitionEnd={() => {
          if (view == 'underwater') {
            enableLoginAnimations(false)
          }
          if (onTransitionEnd) {
            onTransitionEnd(view)
          }
        }}
      >
        <div className={clsx(classes.bg_view, classes.bg_forgot_pass)}></div>
        <div className={clsx(classes.bg_view, classes.bg_login)}>
          <div className="bg_login_water" id="login-water">
            <div className="login_splash" id="login-splash-target"></div>
          </div>
          <div className="mountains_left"></div>
          <div className="mountains_right"></div>
        </div>
        <div className={clsx(classes.bg_view, classes.bg_app)} id="app-bg">
          <div className={classes.aquarium} id="aquarium"></div>
        </div>
      </div>
    </div>
  )
}

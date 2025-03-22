import type { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

/**
 * Background Component Styles
 */

type StyleProps = {
  view: 'underwater' | 'land' | 'sky'
  phase: 'day' | 'morning' | 'evening' | 'night'
  viewTransitionTime: string
}

export const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  // Main Background Container

  bgContainer: {
    width: '100%',
    height: '100vh',
    position: 'fixed',
  },

  // Background Sky/Stars/Sun

  sky_bg: {
    zIndex: -1100,
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    transition: ({ viewTransitionTime }) => `background ${viewTransitionTime} ease-in-out`,
    background: ({ phase }) => {
      switch (phase) {
        case 'day':
          return theme.custom.gradients.daytime
        case 'morning':
          return theme.custom.gradients.morning
        case 'evening':
          return theme.custom.gradients.evening
        case 'night':
          return theme.custom.gradients.night
      }
    },
    '& .sky_bg_sun': {
      position: 'absolute',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      width: 333,
      height: 333,
      top: 0,
      left: '10%',
      backgroundImage: ({ phase }) =>
        phase == 'morning' ? 'url(assets/svg/sun--morning.svg)' : 'url(assets/svg/sun--day.svg)',
      transform: ({ view }) =>
        view == 'land'
          ? 'translate3d(0,0,0)'
          : view == 'sky'
            ? 'translate3d(0,50px,0)'
            : 'translate3d(0,-50px,0)',
      transition: ({ viewTransitionTime }) =>
        `transform 2s ease, background-image ${viewTransitionTime} ease-in-out`,
    },
    '& .sky_bg_stars': {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      opacity: ({ phase }) => {
        switch (phase) {
          case 'day':
            return 0
          case 'morning':
            return 0.3
          case 'evening':
            return 0.3
          case 'night':
            return 1
        }
      },
      transition: ({ viewTransitionTime }) => `opacity ${viewTransitionTime} ease-in-out`,
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        width: '200%',
        top: 0,
        bottom: 0,
        backgroundImage: 'url(assets/svg/stars.svg)',
        backgroundSize: '50% auto',
        animation: '$stars 120s linear infinite',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        width: '200%',
        top: 0,
        bottom: 0,
        backgroundImage: 'url(assets/svg/stars-2.svg)',
        backgroundSize: '50% auto',
        animation: '$stars 120s linear infinite',
        animationDuration: '240s',
      },
    },
  },
  '@keyframes stars': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(-50%)',
    },
  },

  // Main BackGround - all transitions between views happen here

  bg: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    transition: 'transform 2s ease',
    transform: ({ view }) =>
      view == 'land'
        ? 'translate3d(0,-100%,0)'
        : view == 'sky'
          ? 'translate3d(0,0,0)'
          : 'translate3d(0,-200%,0)',
    zIndex: -1000,
  },
  bg_view: {
    transition: 'transform 2s ease',
    width: '100vw',
    height: '100vh',
    position: 'relative',
  },

  // Forgot Password (sky) view
  bg_forgot_pass: {},

  // Login (land) view

  bg_login: {
    '& > *': {
      position: 'absolute',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    },
    '& .bg_login_water': {
      bottom: 0,
      left: 0,
      right: 0,
      height: '45%',
      background: ({ phase }) => {
        switch (phase) {
          case 'day':
            return 'linear-gradient(180deg, #9FE4D5 0%, #88DECB 100%)'
          case 'morning':
            return 'linear-gradient(180deg, #6CBBE9 0%, #FFA976 100%)'
          case 'evening':
            return 'linear-gradient(180deg, #B2E9DD 0%, #BEABC8 100%)'
          case 'night':
            return 'linear-gradient(180deg, #10364C 0%, #89A7B9 100%)'
        }
      },
      transition: ({ viewTransitionTime }) => `background ${viewTransitionTime} ease-in-out`,
    },
    '& .mountains_left': {
      left: 0,
      width: '40%',
      height: '80%',
      maxHeight: 596,
      bottom: '10%',
      backgroundImage: 'url(assets/svg/mountains-left.svg)',
      backgroundPosition: '0% 50%',
    },
    '& .mountains_right': {
      right: 0,
      width: '60%',
      height: '80%',
      maxHeight: 596,
      bottom: '10%',
      backgroundImage: 'url(assets/svg/mountains-right.svg)',
      backgroundPosition: '100% 50%',
    },
    '& .login_splash': {
      position: 'absolute',
      bottom: 50,
      left: '50%',
    },
  },

  // App (Underwater) View

  bg_app: {
    background: ({ phase }) => {
      switch (phase) {
        case 'day':
          return 'linear-gradient(180deg, #47CCAF 0%, #1B97DE 100%)'
        case 'morning':
          return 'linear-gradient(180deg, #FF9454 0%, #1B97DE 100%)'
        case 'evening':
          return 'linear-gradient(180deg, #9A7EAA 0.29%, #FFBED2 100%)'
        case 'night':
          return 'linear-gradient(180deg, #6C92A8 0.29%, #47CCAF 100%)'
      }
    },
    transition: ({ viewTransitionTime }) => `background ${viewTransitionTime} ease-in-out`,
    '& > *': {
      position: 'absolute',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    },
  },
  aquarium: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    '& canvas': {
      mixBlendMode: 'multiply',
      opacity: 0.5,
      width: '100%',
      height: '100%',
    },
  },
}))

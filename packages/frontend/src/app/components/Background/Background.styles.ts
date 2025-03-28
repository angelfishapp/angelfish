import { keyframes, styled } from '@mui/material/styles'

/**
 * Background Component Styles
 */

type StyleProps = {
  view: 'underwater' | 'land' | 'sky'
  phase: 'day' | 'morning' | 'evening' | 'night'
  viewTransitionTime: string
}

// Keyframes for the stars animation
const starsScroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`

export const BackgroundContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'small',
})<StyleProps>(({ theme, view, phase, viewTransitionTime }) => ({
  width: '100%',
  height: '100vh',
  position: 'fixed',
  '& .sky_bg': {
    zIndex: -1100,
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    transition: `background ${viewTransitionTime} ease-in-out`,
    background:
      phase === 'day'
        ? theme.custom.gradients.daytime
        : phase === 'morning'
          ? theme.custom.gradients.morning
          : phase === 'evening'
            ? theme.custom.gradients.evening
            : theme.custom.gradients.night,
    '& .sky_bg_sun': {
      position: 'absolute',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      width: 333,
      height: 333,
      top: 0,
      left: '10%',
      backgroundImage:
        phase == 'morning' ? 'url(assets/svg/sun--morning.svg)' : 'url(assets/svg/sun--day.svg)',
      transform:
        view == 'land'
          ? 'translate3d(0,0,0)'
          : view == 'sky'
            ? 'translate3d(0,50px,0)'
            : 'translate3d(0,-50px,0)',
      transition: `transform 2s ease, background-image ${viewTransitionTime} ease-in-out`,
    },
    '& .sky_bg_stars': {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      opacity: phase === 'night' ? 1 : phase === 'morning' || phase === 'evening' ? 0.3 : 0,
      transition: `opacity ${viewTransitionTime} ease-in-out`,
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        width: '200%',
        top: 0,
        bottom: 0,
        backgroundImage: 'url(assets/svg/stars.svg)',
        backgroundSize: '50% auto',
        animation: `${starsScroll} 120s linear infinite`,
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
        animation: `${starsScroll} 120s linear infinite`,
        animationDuration: '240s',
      },
    },
  },

  // Main BackGround - all transitions between views happen here

  '& .main': {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    transition: 'transform 2s ease',
    transform:
      view == 'land'
        ? 'translate3d(0,-100%,0)'
        : view == 'sky'
          ? 'translate3d(0,0,0)'
          : 'translate3d(0,-200%,0)',
    zIndex: -1000,
  },
  '& .main_view': {
    transition: 'transform 2s ease',
    width: '100vw',
    height: '100vh',
    position: 'relative',
  },

  // Land view

  '& .land_bg': {
    '& > *': {
      position: 'absolute',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    },
    '& .land_bg_water': {
      bottom: 0,
      left: 0,
      right: 0,
      height: '45%',
      background:
        phase === 'day'
          ? 'linear-gradient(180deg, #9FE4D5 0%, #88DECB 100%)'
          : phase === 'morning'
            ? 'linear-gradient(180deg, #6CBBE9 0%, #FFA976 100%)'
            : phase === 'evening'
              ? 'linear-gradient(180deg, #B2E9DD 0%, #BEABC8 100%)'
              : 'linear-gradient(180deg, #10364C 0%, #89A7B9 100%)',
      transition: `background ${viewTransitionTime} ease-in-out`,
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

  // Underwater view

  '& .underwater_bg': {
    background:
      phase === 'day'
        ? 'linear-gradient(180deg, #47CCAF 0%, #1B97DE 100%)'
        : phase === 'morning'
          ? 'linear-gradient(180deg, #FF9454 0%, #1B97DE 100%)'
          : phase === 'evening'
            ? 'linear-gradient(180deg, #9A7EAA 0.29%, #FFBED2 100%)'
            : 'linear-gradient(180deg, #6C92A8 0.29%, #47CCAF 100%)',
    transition: `background ${viewTransitionTime} ease-in-out`,
    '& > *': {
      position: 'absolute',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    },
  },
  '& .aquarium': {
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

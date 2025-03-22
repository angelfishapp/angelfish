import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

/**
 * Stepper Component Styles
 */

export const useStyles = makeStyles<Theme>((theme: Theme) => ({
  stepperContainer: {
    position: 'fixed',
    inset: 0,
    boxSizing: 'border-box',
    padding: '24px 0 24px 104px',
    zIndex: theme.zIndex.mobileStepper,

    '&.backdrop': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
    },

    '& > div': {
      position: 'relative',
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      maxWidth: 1300,
      width: '100%',
      height: '100%',
    },
  },
  stepContainer: {
    margin: 0,
    padding: 0,
    flex: 1,
    listStyle: 'none',
    position: 'relative',
    '& .step': {
      opacity: 0,
      listStyle: 'none',
      transform: 'translateY(100%)',
      position: 'absolute',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.5s ease',
    },
  },
  bubbleContainer: {
    margin: '0 2rem 0 1rem !important',
  },
}))

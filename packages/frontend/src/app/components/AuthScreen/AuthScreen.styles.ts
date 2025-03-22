import type { Theme } from '@mui/material/styles'
import { makeStyles, styled } from '@mui/styles'

/**
 * AuthScreen Styles
 */
export const useStyles = makeStyles<Theme>(() => ({
  mainScreen: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
  },
  authContainer: {
    transition: 'opacity 0.5s ease, visibility 0.5s ease',
    perspective: '1500px',
    '&.sky': {
      '& $email_screen': {
        visibility: 'visible',
        opacity: 1,
      },
      '& $auth_screen': {
        visibility: 'hidden',
        opacity: 0,
      },
    },
    '&.land': {
      '& $email_screen': {
        visibility: 'hidden',
        opacity: 0,
      },
      '& $auth_screen': {
        visibility: 'visible',
        opacity: 1,
        transform: 'rotateY(0deg)',
      },
    },
    '&.underwater': {
      '& $email_screen': {
        visibility: 'hidden',
        opacity: 0,
      },
      '& $auth_screen': {
        visibility: 'hidden',
        opacity: 0,
      },
    },
  },
  email_screen: {
    position: 'absolute',
    top: 0,
    width: '100%',
    transition: 'visibility 0.5s ease 0.5s, opacity 0.5s ease',
    '& .formHeader': {
      textAlign: 'center',
    },
  },
  auth_screen: {
    transition: 'visibility 0.5s linear 0.5s, opacity 0.5s ease 0.5s',
  },
  app_screen: {
    opacity: 0,
    animationName: '$fadeIn',
    animationDuration: ' 4s',
    animationDelay: '0s',
    animationFillMode: 'forwards',
    overflow: 'hidden',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}))

/**
 * AuthContainer Styles
 */
export const AuthContainer = styled('div')(() => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  boxSizing: 'border-box',
  position: 'relative',
  '& .hideAuthForm': {
    opacity: 0,
    transition: 'opacity 2s ease .2s',
  },
  '& .authForm': {
    position: 'absolute',
    maxWidth: 472,
    zIndex: 2,
    width: '100%',
    borderRadius: 8,
    '&::before': {
      content: '""',
      background: '#fff',
      opacity: 0.7,
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 8,
    },
    '& .content': {
      padding: 24,
      position: 'relative',
      zIndex: 2,
    },
    '& .formHeader': {
      height: 50,
    },
    '& .logo': {
      height: 50,
    },
    '& h1': {
      textAlign: 'center',
      margin: '12px 0',
      fontSize: 24,
      fontWeight: 'normal',
      '& p': {
        margin: 0,
        marginBottom: 12,
        position: 'relative',
      },
    },
    '& .error': {
      textAlign: 'center',
      color: 'red',
    },
    '& .formMiddle': {
      position: 'relative',
      zIndex: 2,
    },
    '& input': {
      width: '100%',
      boxSizing: 'border-box',
      fontSize: 18,
      padding: '15px 17px',
      border: 0,
      borderRadius: 8,
    },
    '& .oobField': {
      '& input': {
        padding: '10px',
        fontSize: '3rem',
      },
    },
    '& .formBottom': {
      paddingTop: 24,
      textAlign: 'center',
      '& p': {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
      },
    },
  },
}))

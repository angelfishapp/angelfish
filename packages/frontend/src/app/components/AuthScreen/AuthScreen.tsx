import clsx from 'clsx'
import React from 'react'

import { Background } from '../Background'
import type { AuthScreenProps } from './AuthScreen.interface'
import { AuthScreenContainer } from './AuthScreen.styles'
import AuthForm from './components/AuthForm/AuthForm'
import EmailForm from './components/EmailForm/EmailForm'

/**
 * Main Component - Controls Background and Screen Displayed to user based on their
 * Authentication/Signup Status
 */
export default function AuthScreen({
  onGetOOBCode,
  onAuthenticate,
  isAuthenticated = false,
  disableBackgroundAnimation = false,
  children,
}: AuthScreenProps) {
  // Component State
  /* Current background view to display */
  const [backgroundView, setBackgroundView] = React.useState<'underwater' | 'land' | 'sky'>(
    isAuthenticated ? 'underwater' : 'sky',
  )
  /* Flag to render AuthContainer, stops login components from appearing
       behind app screen when app is loaded */
  const [showLogin, setShowLogin] = React.useState<boolean>(true)
  /* Flag to determine if user actually logged in/registered on AuthForm
       to stop animation being disrupted after isAuthenticated change */
  const [isLogin, setIsLogin] = React.useState<boolean>(false)

  /**
   * Update screen state when isAuthenticated changes
   */
  React.useEffect(() => {
    if (!isLogin) {
      setBackgroundView(isAuthenticated ? 'underwater' : 'sky')
      setShowLogin(!isAuthenticated)
    }
  }, [isAuthenticated, isLogin])

  /**
   * Callback for when fish splash to submerge background underwater
   */
  const onSplash = () => {
    setBackgroundView('underwater')
  }

  /**
   * Show Email Form to start Authentication process
   */
  const onShowEmailForm = () => {
    setBackgroundView('sky')
  }

  /**
   * Handle logging in via AuthForm
   */
  const handleAuthenticate = async (oob_code: string) => {
    setIsLogin(true)
    return await onAuthenticate(oob_code)
  }

  // Render
  return (
    <AuthScreenContainer>
      {/* App Background */}
      <Background
        disableAnimations={disableBackgroundAnimation}
        view={backgroundView}
        onTransitionEnd={(view) => {
          if (view == 'underwater') {
            setShowLogin(false)
            setIsLogin(false)
          } else {
            setShowLogin(true)
          }
        }}
      />

      {/* Login Screens */}

      {showLogin ? (
        <div className={clsx('authContainer', backgroundView)}>
          {/* Main Authentication Form (land) */}
          <div className="auth_screen">
            <AuthForm
              focused={backgroundView === 'land'}
              onAuthenticate={handleAuthenticate}
              onSplash={onSplash}
              onBack={onShowEmailForm}
            />
          </div>

          {/* Email Form (sky) */}
          <div className="email_screen">
            <EmailForm
              focused={backgroundView === 'sky'}
              onGetOOBCode={onGetOOBCode}
              onNext={() => setBackgroundView('land')}
            />
          </div>
        </div>
      ) : (
        <div className="app_screen">
          {/* Main Application Screen (underwater) */}
          {children}
        </div>
      )}
    </AuthScreenContainer>
  )
}

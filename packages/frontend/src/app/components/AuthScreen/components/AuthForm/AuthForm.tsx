import Button from '@mui/material/Button'
import clsx from 'clsx'
import React from 'react'

import { GetErrorMessage } from '@/api'
import { OOBField } from '@/components/forms/OOBField'
import { AudioPlayer } from '@/utils/audio.utils'
import LoginAnimation from '../../animations/login-animation'
import { AuthContainer } from '../../AuthScreen.styles'
import type { AuthFormProps } from './AuthForm.interface'
import { useTranslate } from '@/utils/i18n'

/**
 * Displays the authentication form at center of login screen to enter and validate
 * the OOB Code sent to the user's email address
 */
export default function AuthForm({
  focused = false,
  onAuthenticate,
  onBack,
  onSplash,
}: AuthFormProps) {
  const { authScreen: t } = useTranslate('screens')
  console.log(t)
  // Component State
  const oobCodeFieldRef = React.useRef<HTMLDivElement>(null)
  const [showAuthForm, setShowAuthForm] = React.useState<boolean>(true)
  const [loginAnimation, setLoginAnimation] = React.useState<LoginAnimation>()
  const [displayError, setDisplayError] = React.useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  /*
   * Add Login Logo Animation to Login Screen
   */
  React.useEffect(() => {
    try {
      if (!loginAnimation) {
        setLoginAnimation(
          new LoginAnimation({
            containerId: 'login-auth-logo',
            waterTargetId: 'login-splash-target',
            onFishJump() {
              setShowAuthForm(false)
              // Play the sound when the fish jumps
              AudioPlayer.create('assets/sounds/Chimes.mp3').then((audioPlayer) => {
                audioPlayer.play()
              })
            },
            // This should be a callback function for when the fish hits the water.
            // Used to transition the background onto the next screen
            onSplash() {
              onSplash()
            },
            // This is fired when the animation finishes. The lottie element is removed automatically,
            // but this could be used to trigger the removal of other elements from the page.
            onEnd() {
              // Reset Form State
              setIsLoading(false)
              setDisplayError(undefined)
              setShowAuthForm(true)
            },
          }),
        )
      }
    } catch (error) {
      /* eslint-disable no-console */
      console.error('Error Initialising LoginAnimation:', error)
      /* eslint-enable no-console */
    }
  }, [showAuthForm, onSplash, loginAnimation])

  /*
   * Autofocus on the first input field when the form is focused
   */
  React.useEffect(() => {
    if (focused) {
      const inputElement = oobCodeFieldRef.current?.querySelector(
        'input#oob-digit-0',
      ) as HTMLInputElement
      setTimeout(() => {
        // Add timeout in case field is hidden
        inputElement?.focus()
      }, 1000)
    }
  }, [focused])

  /**
   * Handle Clicking Sign In Button
   */
  const handleAuthentication = async (oob_code: string) => {
    loginAnimation?.loading()
    setIsLoading(true)
    try {
      await onAuthenticate(oob_code)
      loginAnimation?.jump()
    } catch (error) {
      loginAnimation?.stop()
      const errorCode =
        typeof error === 'object' && error !== null && 'code' in error
          ? (error as { code: string }).code
          : undefined
      const message = await GetErrorMessage({ category: 'auth', code: errorCode })
      setDisplayError(`${message} `)
      setIsLoading(false)
      throw error
    }
  }

  return (
    <AuthContainer>
      <div className={clsx('authForm', showAuthForm ? undefined : 'hideAuthForm')}>
        <div className="content">
          <div className="formHeader">
            <div className="logo" id="login-auth-logo" />
          </div>
          <div className="formMiddle">
            <section>
              <h1>{t['verificationCode']}</h1>
              {displayError && <div className="error">{displayError}</div>}
              <form>
                <OOBField
                  ref={oobCodeFieldRef}
                  className="oobField"
                  fullWidth
                  onSubmit={handleAuthentication}
                />
              </form>
            </section>
          </div>
          <div className="formBottom">
            <div>
              <p>{t['didNotReceiveCode']}</p>
              <Button
                disabled={isLoading}
                onClick={() => {
                  onBack()
                  setDisplayError(undefined)
                }}
              >
                {t['goBack']}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthContainer>
  )
}

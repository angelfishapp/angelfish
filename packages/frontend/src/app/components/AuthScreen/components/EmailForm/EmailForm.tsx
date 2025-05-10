import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

import { AuthContainer } from '../../AuthScreen.styles'
import type { EmailFormProps } from './EmailForm.interface'

/**
 * Displays the forgotten password form
 */
export default function ResetPasswordForm({
  email: defaultEmail,
  focused = false,
  onGetOOBCode,
  onNext,
}: EmailFormProps) {
  // Component State
  const emailFieldRef = React.useRef<HTMLInputElement>(null)
  const [email, setEmail] = React.useState<string>(defaultEmail || '')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [errorMsg, setErrorMsg] = React.useState<string>('')
  const [isEmailSent, setIsEmailSent] = React.useState<boolean>(false)

  /**
   * Update current email if changes
   */
  React.useEffect(() => {
    setEmail(defaultEmail || '')
  }, [defaultEmail])

  /**
   * Set email field to focused when focused prop changes
   */
  React.useEffect(() => {
    if (focused) {
      emailFieldRef.current?.focus()
      setTimeout(() => {
        // Add timeout in case field is hidden
        emailFieldRef.current?.focus()
      }, 1000)
    }
  }, [focused])

  /**
   * Handle Clicking Send Email Button
   */
  const handleGetOOBCode = () => {
    setIsLoading(true)
    onGetOOBCode(email)
      .then(() => {
        setIsEmailSent(true)
        setIsLoading(false)
      })
      .catch((error) => {
        setErrorMsg(`${error}`)
        setIsLoading(false)
      })
  }

  /**
   * Handle Clicking Return to Sign In Button
   */
  const handleShowLogin = () => {
    // Put timer so form state doesn't change while user
    // can see form - should happen after the form fades out
    setTimeout(() => {
      setEmail('')
      setIsLoading(false)
      setIsEmailSent(false)
    }, 500)
    onNext()
  }

  // Render
  return (
    <AuthContainer>
      <div className="authForm">
        <div className="content">
          <div className="formHeader">
            <div className="static_logo">
              <img src="assets/svg/logo_black.svg" alt="Angelfish Logo" height="50" />
            </div>
          </div>
          <div className="formMiddle">
            {/* use isEmailSent flag to display form or success message */}
            {isEmailSent ? (
              <section>
                <h1>Check Your Inbox!</h1>
                <p>
                  An email with a 6-digit code has been sent to your inbox. If you can&apos;t find
                  it within 5 minutes please check your Spam folder, try again or contact support if
                  you still don&apos;t see the email.
                </p>
                <Button fullWidth onClick={handleShowLogin}>
                  Next
                </Button>
              </section>
            ) : (
              <section>
                <h1>Enter Your Email</h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    handleGetOOBCode()
                  }}
                >
                  <p className="error">{errorMsg}</p>
                  <p>
                    <input
                      ref={emailFieldRef}
                      type="email"
                      required={true}
                      placeholder="aquaman@atlantis.com"
                      value={email}
                      autoComplete="off"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </p>
                  <Button
                    disabled={isLoading}
                    fullWidth
                    type="submit"
                    startIcon={isLoading ? <CircularProgress size={30} /> : undefined}
                  >
                    Send Code to Email
                  </Button>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </AuthContainer>
  )
}

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { AuthScreen } from '.'

/**
 * Story Book Meta
 */

const meta = {
  title: 'App/Login',
  component: AuthScreen,
  args: {
    children: undefined,
    onGetOOBCode: async (email: string) => action('onGetOOBCode')(email),
    onAuthenticate: async (oob_code: string) => action('onAuthenticate')(oob_code),
  },
  render: ({ onGetOOBCode, onAuthenticate, isAuthenticated, ...args }) => {
    const RenderComponent = () => {
      const [authenticated, setAuthenticated] = React.useState(isAuthenticated)

      return (
        <AuthScreen
          isAuthenticated={authenticated}
          onGetOOBCode={async (email: string) => {
            await onGetOOBCode(email)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            if (email === 'test@angelfish.app') {
              throw new Error(
                "There was a connection error trying to login to Angelfish. Make sure you're online.",
              )
            }
          }}
          onAuthenticate={async (oob_code: string) => {
            await onAuthenticate(oob_code)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            if (oob_code === '111111') {
              throw new Error('Invalid OOB Code')
            }
            setAuthenticated(true)
          }}
          {...args}
        >
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh', top: 0, position: 'absolute', minWidth: '100wh' }}
          >
            <Grid item xs={3}>
              <Paper style={{ padding: 10 }}>
                You are now in the app!
                <br />
                <Button onClick={() => setAuthenticated(false)}>Logout</Button>
              </Paper>
            </Grid>
          </Grid>
        </AuthScreen>
      )
    }

    return <RenderComponent />
  },
} satisfies Meta<typeof AuthScreen>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    isAuthenticated: false,
  },
}

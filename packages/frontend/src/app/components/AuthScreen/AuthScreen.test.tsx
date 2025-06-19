import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'

import * as stories from './AuthScreen.stories'

const { Default } = composeStories(stories)

describe('AuthLogin tests', () => {
  it('renders login form without crashing', () => {
    vi.mock('@/app/context/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
      }),
    }))

    render(<Default isAuthenticated={false} />)

    expect(screen.getByText(/Enter Your Email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/aquaman@atlantis.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Code to Email/i })).toBeInTheDocument()
  })
})

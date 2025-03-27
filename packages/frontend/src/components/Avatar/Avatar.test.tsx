import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './Avatar.stories' // Ensure correct path

const composed = composeStories(stories)

describe('Avatar', () => {
  test('renders WithAvatar story', () => {
    render(<composed.WithAvatar />)
    const avatarImage = screen.getAllByRole('img')[0]
    expect(avatarImage).toBeInTheDocument()
    expect(avatarImage).toHaveAttribute(
      'src',
      `data:image/png;base64, ${composed.WithAvatar.args.avatar}`,
    )
  })

  test('renders InitialsAvatar story', () => {
    render(<composed.InitialsAvatar />)
    expect(screen.getAllByText('JS').length).toEqual(4)
  })

  test('renders JustAvatar story', async () => {
    render(<composed.JustAvatar />)
    const avatarImage = screen.getAllByRole('img')[0]
    expect(avatarImage).toBeInTheDocument()
    expect(avatarImage).toHaveAttribute(
      'src',
      `data:image/png;base64, ${composed.WithAvatar.args.avatar}`,
    )
  })

  test('renders CustomIcon story', async () => {
    render(<composed.CustomIcon />)
    expect(screen.getAllByTestId('AccountBalanceIcon').length).toBeGreaterThan(0)
  })

  test('renders NoUserAvatar story', async () => {
    render(<composed.NoUserAvatar />)
    expect(screen.getAllByTestId('PersonIcon').length).toBeGreaterThan(0)
  })
})

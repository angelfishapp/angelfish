import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './AvatarField.stories'

const { Default, NoAvatar, Logo } = composeStories(stories)

describe('renders Search Story', () => {
  test('render of default Story', async () => {
    render(<Default />)

    const [title] = screen.getAllByText(/Avatar Field/i)
    expect(title).toBeInTheDocument()

    const avatarImage = screen.getAllByRole('img')[0]
    expect(avatarImage).toBeInTheDocument()
    expect(avatarImage).toHaveAttribute('src', `data:image/png;base64, ${Default.args.value}`)

    const arrow = screen.getByTestId('CameraAltOutlinedIcon')
    expect(arrow).toBeInTheDocument()
    fireEvent.click(arrow)

    const [PickAvatarTitle] = await screen.findAllByText(/Pick Your Avatar/i)
    expect(PickAvatarTitle).toBeInTheDocument()

    const selctButton = await screen.getByRole('button')
    expect(selctButton).toBeInTheDocument()
  })

  test('render of NoAvatar Story', async () => {
    render(<NoAvatar />)
    const [title] = screen.getAllByText(/Avatar Field/i)
    expect(title).toBeInTheDocument()

    const avatarImage = screen.getByTestId('PersonIcon')
    expect(avatarImage).toBeInTheDocument()

    const arrow = screen.getByTestId('CameraAltOutlinedIcon')
    expect(arrow).toBeInTheDocument()
    fireEvent.click(arrow)

    const [PickAvatarTitle] = await screen.findAllByText(/Pick Your Avatar/i)
    expect(PickAvatarTitle).toBeInTheDocument()

    const selctButton = await screen.getByRole('button')
    expect(selctButton).toBeInTheDocument()
  })

  test('render of NoAvatar Story', async () => {
    render(<Logo />)
    const [title] = screen.getAllByText(/Logo Field/i)
    expect(title).toBeInTheDocument()

    const avatarImage = screen.getAllByRole('img')[0]
    expect(avatarImage).toBeInTheDocument()
    expect(avatarImage).toHaveAttribute('src', `data:image/png;base64, ${Logo.args.value}`)

    const arrow = screen.getByTestId('CameraAltOutlinedIcon')
    expect(arrow).toBeInTheDocument()
    fireEvent.click(arrow)

    const [PickAvatarTitle] = await screen.findAllByText(/Pick Your Household Logo/i)
    expect(PickAvatarTitle).toBeInTheDocument()

    const selctButton = await screen.getByRole('button')
    expect(selctButton).toBeInTheDocument()
  })
})

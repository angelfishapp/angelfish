import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './CloseButton.stories' // Ensure correct path

const composed = composeStories(stories) as ReturnType<typeof composeStories<typeof stories>>

describe('CategoryLabel', () => {
  test('renders default Button story', () => {
    render(<composed.Default />)
    const buttons = screen.getAllByRole('button')
    const button = buttons[0]
    expect(button).toBeInTheDocument()
    const style = getComputedStyle(button)
    expect(style.width).toBe('40px')
  })
  test('renders small Button story', () => {
    render(<composed.Small />)
    render(<composed.Default />)
    const buttons = screen.getAllByRole('button')
    const button = buttons[0]
    expect(button).toBeInTheDocument()
    const style = getComputedStyle(button)
    expect(style.width).toBe('25px')
  })
})

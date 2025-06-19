import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'

import * as stories from './PhoneField.stories'

const { Default } = composeStories(stories)

describe('Phone Field', () => {
  it('renders without crashing', () => {
    render(<Default />)
    expect(screen.getAllByText('Phone Field')[0]).toBeInTheDocument()
    const input = document.getElementById(':r0:') as HTMLInputElement
    expect(input).toBeInTheDocument()
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '970' } })

    expect(input).toHaveValue('+970                ')
    const flag = document.querySelector('[title="Palestine, State of"]')
    expect(flag).toBeInTheDocument()
  })
})

import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'

import * as stories from './InstitutionSearchField.stories'

const { EmptyValue, WithValue } = composeStories(stories)

describe('InstitutionSearchField', () => {
  it('renders without crashing', () => {
    render(<EmptyValue />)
    const [title] = screen.getAllByText(/Institution Search Field/i)
    expect(title).toBeInTheDocument()
  })

  it('displays options when typing', () => {
    render(<EmptyValue {...EmptyValue.args} />)
    const input = screen.getByPlaceholderText('Type in Institution Name...') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Chase' } })

    expect(input.value).toBe('Chase')
  })

  it('calls onChange when an option is selected', () => {
    const handleChange = vi.fn()
    render(<EmptyValue onChange={handleChange} />)

    const input = screen.getByPlaceholderText('Type in Institution Name...') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Chase' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

    expect(input.value).toBe('Chase')
  })

  it('renders the selected value with an icon', () => {
    render(<WithValue />)

    const input = screen.getByPlaceholderText('Type in Institution Name...')
    expect(input).toHaveValue(WithValue.args.value)
  })
})

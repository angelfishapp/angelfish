import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'

import * as stories from './SwitchField.stories'

const { Default } = composeStories(stories)

describe('SwitchField tests', () => {
  it('renders without crashing', () => {
    render(<Default />)
    expect(screen.getByText('Switch Field')).toBeInTheDocument()
    const switchInput = screen.getByRole('checkbox')
    expect(switchInput).toBeInTheDocument()
    expect(switchInput).not.toBeChecked()
  })

  it('toggles the switch when clicked', () => {
    const handleChange = vi.fn()
    render(<Default label="Switch Field" value={false} onChange={handleChange} />)
    const switchInput = screen.getByRole('checkbox')
    fireEvent.click(switchInput)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('renders with default value', () => {
    render(<Default label="Switch Field" defaultValue={true} onChange={() => {}} />)
    const switchInput = screen.getByRole('checkbox')
    expect(switchInput).toBeChecked()
  })
})

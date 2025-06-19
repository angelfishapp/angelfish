import { institutions as INSTITUTIONS } from '@angelfish/tests/fixtures'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'

import * as stories from './InstitutionField.stories'

const { EmptyValue, WithValue } = composeStories(stories)

describe('InstitutionField', () => {
  it('renders without crashing', () => {
    render(<EmptyValue />)
    expect(screen.getByPlaceholderText('Search Institutions...')).toBeInTheDocument()
  })

  it('displays options when typing', () => {
    render(<EmptyValue {...EmptyValue.args} />)
    const input = screen.getByPlaceholderText('Search Institutions...')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Bank' } })

    INSTITUTIONS.forEach((institution) => {
      if (institution.name.includes('Bank')) {
        expect(screen.getByText(institution.name)).toBeInTheDocument()
      }
    })
  })

  it('calls onChange when an option is selected', () => {
    const handleChange = vi.fn()
    render(<EmptyValue onChange={handleChange} />)

    const input = screen.getByPlaceholderText('Search Institutions...')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: INSTITUTIONS[0].name } })
    fireEvent.click(screen.getByText(INSTITUTIONS[0].name))

    expect(handleChange).toHaveBeenCalledWith(INSTITUTIONS[0])
  })

  it('renders the selected value with an icon', () => {
    render(<WithValue />)
    const input = screen.getByPlaceholderText('Search Institutions...')
    expect(input).toHaveValue(INSTITUTIONS[1].name)
  })
})

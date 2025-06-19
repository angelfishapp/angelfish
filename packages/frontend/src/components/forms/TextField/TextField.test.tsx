import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'

import * as TextFieldStories from './TextField.stories'

const { SingleLineText, WithAdornments, MultiLineText } = composeStories(TextFieldStories)

describe('TextField', () => {
  it('renders SingleLineText with label and placeholder', () => {
    render(<SingleLineText />)

    expect(screen.getByText('Single Line Textfield')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Placeholder text...')).toBeInTheDocument()
    expect(screen.getByText('Here is some helper text')).toBeInTheDocument()
  })

  it('renders WithAdornments with start and end adornments', () => {
    render(<WithAdornments />)

    expect(screen.getByText('$')).toBeInTheDocument()
    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  it('renders MultiLineText with correct rows and label', () => {
    render(<MultiLineText />)

    expect(screen.getByText('Multi Line Textfield')).toBeInTheDocument()
    const textarea = screen.getByPlaceholderText('Placeholder text...') as HTMLTextAreaElement
    expect(textarea).toBeInTheDocument()
    expect(textarea.rows).toBe(5)
  })
})

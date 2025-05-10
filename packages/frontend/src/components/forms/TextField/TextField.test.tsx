import theme from '@/app/theme'
import { ThemeProvider } from '@mui/material/styles'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as TextFieldStories from './TextField.stories'

const { SingleLineText, WithAdornments, MultiLineText } = composeStories(TextFieldStories)

describe('TextField (story-based)', () => {
  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
  it('renders SingleLineText with label and placeholder', () => {
    renderWithTheme(<SingleLineText />)

    expect(screen.getByText('Single Line Textfield')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Placeholder text...')).toBeInTheDocument()
    expect(screen.getByText('Here is some helper text')).toBeInTheDocument()
  })

  it('renders WithAdornments with start and end adornments', () => {
    renderWithTheme(<WithAdornments />)

    expect(screen.getByText('$')).toBeInTheDocument()
    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  it('renders MultiLineText with correct rows and label', () => {
    renderWithTheme(<MultiLineText />)

    expect(screen.getByText('Multi Line Textfield')).toBeInTheDocument()
    const textarea = screen.getByPlaceholderText('Placeholder text...') as HTMLTextAreaElement
    expect(textarea).toBeInTheDocument()
    expect(textarea.rows).toBe(5)
  })
})

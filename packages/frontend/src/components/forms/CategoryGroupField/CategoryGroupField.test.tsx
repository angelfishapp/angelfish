import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './CategoryGroupField.stories'

const { Default } = composeStories(stories)

describe('renders categoryGroupField Story', () => {
  test('render of default Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Category Group Field/i)
    expect(title).toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(/Search Category Groups.../i)
    expect(textBox).toBeInTheDocument()
    fireEvent.change(textBox, { target: { value: 'investment Income' } })
    fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(textBox).toHaveAttribute('value', 'Investment Income')

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)

    expect(textBox).toBeInTheDocument()
    expect(textBox).toHaveAttribute('value', '')
  })
})

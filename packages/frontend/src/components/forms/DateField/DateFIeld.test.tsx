import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import {  render, screen } from '@testing-library/react'
import * as stories from './DateField.stories'
import moment from 'moment'

const { Default } = composeStories(stories)

describe('renders Date Field Story', () => {
  test('render of default Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Date Field/i)
    expect(title).toBeInTheDocument()

    const input = document.getElementById('data-picker-field') as HTMLInputElement
    expect(input).toBeInTheDocument()

    const todayFormatted = moment().format('MM/DD/YYYY')
    expect(input.value).toBe(todayFormatted)

  })
})

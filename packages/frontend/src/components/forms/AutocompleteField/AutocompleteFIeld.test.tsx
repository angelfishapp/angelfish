import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './AutocompleteField.stories'

const { SingleSelect, CustomValueDisplay, MultiSelect } = composeStories(stories)

describe('renders Search Story', () => {
  test('render of default Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <SingleSelect />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Singleselect Autocomplete Field/i)
    expect(title).toBeInTheDocument()

    const input = screen.getByPlaceholderText('Select a tag') as HTMLInputElement
    expect(input).toBeInTheDocument()

    const arrow = screen.getByTestId('ArrowDropDownIcon')
    expect(arrow).toBeInTheDocument()
    fireEvent.click(arrow)

    const [tag1] = await screen.findAllByText(/Tag 1/i)
    expect(tag1).toBeInTheDocument()

    const [tag2] = await screen.findAllByText(/Tag 2/i)
    expect(tag2).toBeInTheDocument()

    const [tag3] = await screen.findAllByText(/Tag 3/i)
    expect(tag3).toBeInTheDocument()
    fireEvent.click(tag3)
    expect(input.value).toBe('Tag 3')

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)
    expect(input.value).toBe('')
  })

  test('render of default Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <MultiSelect />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Multiselect Autocomplete Field/i)
    expect(title).toBeInTheDocument()

    const input = screen.getByRole('combobox') as HTMLInputElement
    expect(input).toBeInTheDocument()

    const arrow = screen.getByTestId('ArrowDropDownIcon')
    expect(arrow).toBeInTheDocument()

    fireEvent.click(arrow)

    const [tag1] = await screen.findAllByText(/Tag 1/i)
    expect(tag1).toBeInTheDocument()

    const [tag2] = await screen.findAllByText(/Tag 2/i)
    expect(tag2).toBeInTheDocument()
    fireEvent.click(tag1)

    fireEvent.change(input, { target: { value: 'Tag 1' } })

    fireEvent.click(tag2)

    fireEvent.change(input, { target: { value: 'Tag 1,Tag 2' } })

    expect(input.value).toBe('Tag 1,Tag 2')

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()

    fireEvent.click(closeIcon)

    expect(input.value).toBe('')
  })

  test('render of CustomValueDisplay Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <CustomValueDisplay />
      </ThemeProvider>,
    )

    const [title] = screen.getAllByText(/Custom Value Display Autocomplete Field/i)
    expect(title).toBeInTheDocument()

    const input = screen.getByRole('combobox') as HTMLInputElement
    expect(input).toBeInTheDocument()

    const arrow = screen.getByTestId('ArrowDropDownIcon')
    expect(arrow).toBeInTheDocument()
    fireEvent.click(arrow)

    const [tag1] = await screen.findAllByText(/Tag 1/i)
    expect(tag1).toBeInTheDocument()

    const [tag2] = await screen.findAllByText(/Tag 2/i)
    expect(tag2).toBeInTheDocument()

    const [tag3] = await screen.findAllByText(/Tag 3/i)
    expect(tag3).toBeInTheDocument()
    fireEvent.click(tag3)
    expect(input.value).toBe('Tag 3')

    const closeIcon = screen.getByTestId('CloseIcon')
    expect(closeIcon).toBeInTheDocument()
    fireEvent.click(closeIcon)
    expect(input.value).toBe('')
  })
})
